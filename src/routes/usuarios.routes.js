import { Router, json } from 'express';
import { accionUsuario, usuarioServices } from '../service/index.js'
import { responsesUtiles } from '../utils/index.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { editarRequisicion, eliminarRequisicion, obtenerTodasLasRequisiciones } from '../service/accionUsuario.js';

const router = Router(); 

    router.get('/', (req, res) => {
        res.send('Hola desde usuariosRouter')
    })


//Ruta para agregar un usuario 
router.post('/agregar', async (req, res) => {
    // console.log(req.body)
    try {
        const nuevoUsuario = await usuarioServices.crearUsuario(req.body)
        console.log(nuevoUsuario)
        //devolucion de respuesta
        const respuesta =
            nuevoUsuario === 'clave_unica'
                ? responsesUtiles.manejarError(res, 'Nombre de usuario duplicado', "el usuario esta duplicado",409)
                : nuevoUsuario
                    ? responsesUtiles.OperacionExitosa(res, nuevoUsuario, 'Usuario agregado exitosamente')
                    : responsesUtiles.manejarError(res, 'Error al agregar el usuario');
        return respuesta;
        //fin de devoluccion de respuesta
    } catch (error) {
        responsesUtiles.manejarError(res, error, 'error al intentar agregar un nuevo usuario')
    }
})

//ruta para eliminar un usuario
router.delete('/eliminar/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const resultadoEliminacion = await usuarioServices.eliminarUsuario(id);

        if (!resultadoEliminacion.success) {
            if (resultadoEliminacion.message === 'La entidad no existe, no se puede eliminar.') {
                responsesUtiles.manejarEntidadNoEncontrada(res, id);
            } else if (resultadoEliminacion.message === 'No se puede eliminar el usuario debido a restricciones de clave externa.') {
                responsesUtiles.manejarError(res, resultadoEliminacion.message, 'No se puede realizar la acción debido a restricciones de clave externa.', 403);
            } else {
                responsesUtiles.manejarError(res, resultadoEliminacion.message, 'Error al intentar eliminar un usuario');
            }
        } else {
            responsesUtiles.OperacionExitosa(res, null, 'Usuario eliminado exitosamente');
        }
    } catch (error) {
        responsesUtiles.manejarError(res, error, 'Error al intentar eliminar un usuario');
    }
});

router.get('/obtenerTodo', async (req, res) => {

    try {
        const obtenerUsuarios = await usuarioServices.obtenerUsuarios()
        responsesUtiles.OperacionExitosa(res, obtenerUsuarios)
    } catch (error) {
        responsesUtiles.manejarError(res, error, 'error al intentar obtener todos los usuarios')
    }
})

router.get('/obtener/:id', async (req, res) => {

    const id = parseInt(req.params.id)

    try {
        const obtenerUsuario = await usuarioServices.obtenerUsuario(id)

        if (obtenerUsuario === null) {
            responsesUtiles.manejarEntidadNoEncontrada(res, id);
        } else if (obtenerUsuario !== true) {
            responsesUtiles.OperacionExitosa(res, obtenerUsuario, 'Usuario obtenido exitosamente');
        } else {
            responsesUtiles.manejarError(res, 'Error al obtener el usuario');
        }

    } catch (error) {
        responsesUtiles.manejarError(res, error, `error al intentar obtener el usuario ${id} `)
    }
})


router.put('/editar/:id', async (req, res) => {
    
    try {
        const id = parseInt(req.params.id);
        const nuevosDatosUsuario = req.body; 

        const usuarioExistente = await usuarioServices.obtenerUsuario(id);

        if (usuarioExistente) {
            const usuarioEditado = await usuarioServices.editarUsuario(id, nuevosDatosUsuario);

            if (usuarioEditado === null) {
                responsesUtiles.manejarEntidadNoEncontrada(res, id);
            } else if (usuarioEditado !== true) {
                responsesUtiles.OperacionExitosa(res, usuarioEditado, 'Usuario editado correctamente');
            } else {
                responsesUtiles.manejarError(res, 'Error al editar el usuario');
            }
        }
    } catch (error) {
        console.error(`Error al intentar editar el usuario ${id}: ${error.message}`);
        responsesUtiles.manejarError(res, error, `error al intentar editar el usuario ${id} `)
    }
});


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const usuario = await usuarioServices.obtenerUsuarioPorNombre(username);

        if (usuario) {
            // Comparar la contraseña ingresada con la contraseña hasheada almacenada
            
            const match = await bcrypt.compare(password, usuario.password);

            if (match) {
                // Generar el token JWT si las contraseñas coinciden
                const token = jwt.sign({
                    usuarioId: usuario.id,
                    usuario: usuario.usuario,
                    rol: usuario.rol,
                }, "7F9$#k3Yz%P!vE*5@&sL", { expiresIn: '1h' });

                res.status(200).json({
                    success: true,
                    mensaje: 'Inicio de sesión exitoso',
                    data: {
                        token,
                        usuario: usuario.usuario,
                        rol: usuario.rol,
                        id: usuario.id
                    },
                });
            } else {
                // Enviar una respuesta 401 (Unauthorized) cuando las contraseñas no coinciden
                res.status(401).json({
                    success: false,
                    mensaje: 'Nombre de usuario o contraseña incorrectos',
                    error: null,
                });
            }
        } else {
            // Enviar una respuesta 401 (Unauthorized) cuando no se encuentra el usuario
            res.status(401).json({
                success: false,
                mensaje: 'Nombre de usuario o contraseña incorrectos',
                error: null,
            });
        }
    } catch (error) {
        console.error(`Error al intentar iniciar sesión: ${error.message}`);
        // Manejar otros errores y enviar una respuesta 500 (Internal Server Error)
        res.status(500).json({
            success: false,
            mensaje: 'Error al intentar iniciar sesión',
            error: error.message || error,
        });
    }
});

// Ruta para verificar token
router.post('/verificar-token', (req, res) => {
    const { token } = req.body;
  
    if (!token) {
      return res.status(400).json({
        success: false,
        mensaje: 'Token no proporcionado en el cuerpo de la solicitud',
        error: null,
      });
    }
  
    try {
      // Verificar el token con la misma clave secreta utilizada para firmar el token
      jwt.verify(token, '7F9$#k3Yz%P!vE*5@&sL');
  
      res.status(200).json({
        success: true,
        mensaje: 'Token válido',
      });
    } catch (error) {
      console.error(`Error al verificar el token: ${error.message}`);
      return res.status(401).json({
        success: false,
        mensaje: 'Token no válido',
        error: error.message,
      });
    }
  });


  router.post('/agregarRequisicion', async (req, res) => {
    try {
        const convertirANumerico = (valor) => parseInt(valor) || 0;

        const datosRequisicion = {
            ...req.body,
            usuarioId: convertirANumerico(req.body.usuarioId),
        };
        
        const nuevaRequisicion = await accionUsuario.crearRequisicion(datosRequisicion);
        
        if (nuevaRequisicion) {
            // Operación exitosa
            return responsesUtiles.OperacionExitosa(res, nuevaRequisicion, 'Requisición creada exitosamente');
        } else {
            // Error al agregar la requisición
            return responsesUtiles.manejarError(res, 'Error al crear la requisición');
        }
    } catch (error) {
        responsesUtiles.manejarError(res, error, 'Error al intentar crear una nueva requisición');
    }
});
  // Ruta para obtener todas las requisiciones de un usuario específico
  router.get('/obtenerRequisiciones/:id', async (req, res) => {
    try {
        // Obtén el parámetro 'id' de la URL
        const usuarioId = parseInt(req.params.id) 

        const obtenerRequisiciones = await accionUsuario.obtenerRequisiciones(usuarioId);
        responsesUtiles.OperacionExitosa(res, obtenerRequisiciones);
    } catch (error) {
        responsesUtiles.manejarError(res, error, 'Error al intentar obtener todas las requisiciones');
    }
});



// Ruta para editar una requisición por su ID
router.put('/requisiciones/editar/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const nuevosDatos = req.body; // Se espera recibir los nuevos datos en el cuerpo de la solicitud
    try {
        const editado = await editarRequisicion(id, nuevosDatos);
        if (editado) {
            res.status(200).json({ success: true, message: `Requisición con ID ${id} editada correctamente` });
        } else {
            res.status(404).json({ success: false, message: `La requisición con ID ${id} no existe` });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: `Error al intentar editar la requisición: ${error.message}` });
    }
});

// Ruta para eliminar una requisición por su ID
router.delete('/requisiciones/eliminar/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const eliminado = await eliminarRequisicion(id);
        if (eliminado) {
            res.status(200).json({ success: true, message: `Requisición con ID ${id} eliminada correctamente` });
        } else {
            res.status(404).json({ success: false, message: `La requisición con ID ${id} no existe` });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: `Error al intentar eliminar la requisición: ${error.message}` });
    }
});


// Ruta para obtener todas las requisiciones
router.get('/obtenerRequisiciones', async (req, res) => {
    try {
      const requisiciones = await obtenerTodasLasRequisiciones();
      if (requisiciones) {
        res.status(200).json(requisiciones);
      } else {
        res.status(404).json({ message: 'No se encontraron requisiciones.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las requisiciones.' });
    }
  });
  



export default router;