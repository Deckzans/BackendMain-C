import { requisicionModel } from '../models/accionUsuario.js';
import { eliminarRegistroPorId } from './crudService.js';
import { crudService } from './index.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const crearRequisicion = async (datosRequisicion) => {
    return crudService.crearRegistro(requisicionModel, datosRequisicion);
}

export const obtenerRequisiciones = async (usuarioId) => {
    try {
        const registros = await requisicionModel.findMany({
            where: {
                usuarioId: usuarioId,
            },
            include: {
                usuario: {
                    select: {
                        nombre: true,
                        // Otros campos del modelo 'Usuario' que desees incluir
                    },
                },
                // Puedes agregar otras relaciones que desees incluir aquí
            },
        });
        return registros;
    } catch (error) {
        console.error(`Error al intentar obtener las requisiciones del empleado ${usuarioId}: ${error.message}`);
        return null;
    }
}

// Función para editar una requisición por su ID
export const editarRequisicion = async (id, nuevosDatos) => {
    try {
        // Busca la requisición por su ID
        const requisicion = await prisma.requisicion.findUnique({
            where: {
                id: id,
            },
        });

        // Verifica si la requisición existe
        if (!requisicion) {
            console.log(`La requisición con ID ${id} no existe.`);
            return false; // Devuelve false para indicar que la requisición no existe
        }

        // Actualiza la requisición con los nuevos datos
        await prisma.requisicion.update({
            where: {
                id: id,
            },
            data: nuevosDatos,
        });

        console.log(`Requisición con ID ${id} editada correctamente.`);
        return true; // Devuelve true para indicar que la edición fue exitosa
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error(`Error al intentar editar la requisición con ID ${id}: ${error.message}`);
        throw error; // Re-lanza el error para que el llamador pueda manejarlo si es necesario
    }
};

// Función para eliminar una requisición por su ID
export const eliminarRequisicion = async (id) => {
    try {
        // Busca la requisición por su ID
        const requisicion = await prisma.requisicion.findUnique({
            where: {
                id: id,
            },
        });

        // Verifica si la requisición existe
        if (!requisicion) {
            console.log(`La requisición con ID ${id} no existe.`);
            return false; // Devuelve false para indicar que la requisición no existe
        }

        // Elimina la requisición
        await prisma.requisicion.delete({
            where: {
                id: id,
            },
        });

        console.log(`Requisición con ID ${id} eliminada correctamente.`);
        return true; // Devuelve true para indicar que la eliminación fue exitosa
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error(`Error al intentar eliminar la requisición con ID ${id}: ${error.message}`);
        throw error; // Re-lanza el error para que el llamador pueda manejarlo si es necesario
    }
};
export const obtenerTodasLasRequisiciones = async () => {
    try {
      const requisiciones = await prisma.requisicion.findMany({
        include: {
          usuario: true, // Incluye todos los campos de la relación 'usuario'
          // Puedes agregar otras relaciones que desees incluir aquí
        },
      });
      return requisiciones;
    } catch (error) {
      console.error(`Error al intentar obtener todas las requisiciones: ${error.message}`);
      return null;
    }
  };