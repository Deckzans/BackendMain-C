// routes/descargas.routes.js
import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Ruta para descargar un archivo específico
router.get('/imagen/:nombreImagen', (req, res) => {
    try {
        const { nombreImagen } = req.params;

        // Obtener la ruta del directorio actual usando fileURLToPath y dirname
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        // Utiliza join para construir la ruta de la imagen
        const rutaImagen = join(__dirname, '..', '..', 'uploads', 'img', nombreImagen);

        // Enviar la imagen como respuesta sin configurar Content-Disposition
        res.sendFile(rutaImagen, (err) => {
            if (err) {
                console.error('Error al enviar la imagen:', err);
                res.status(500).send('Error al enviar la imagen');
            }
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).send('Error interno del servidor');
    }
});



router.get('/vacaciones/:nombrearchivo', (req, res) => {
    try {
        const { nombrearchivo } = req.params;

        // Obtener la ruta del directorio actual usando import.meta.url
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        const rutaArchivo = join(__dirname, '..', '..', 'uploads', 'vacaciones', nombrearchivo);

        // Configurar el encabezado Content-Disposition para la descarga
        res.setHeader('Content-Type', 'application/pdf');

        // Enviar la imagen como respuesta
        res.sendFile(rutaArchivo, (err) => {
            if (err) {
                console.error('Error al enviar el archivo:', err);
                res.status(500).send('Error al enviar la imagen');
            }
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).send('Error interno del servidor');
    }
});


router.get('/permisos/:nombrearchivo', (req, res) => {
    try {
        const { nombrearchivo } = req.params;

        // Obtener la ruta del directorio actual usando import.meta.url
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        const rutaArchivo = join(__dirname, '..', '..', 'uploads', 'permiso', nombrearchivo);

        // Configurar el encabezado Content-Disposition para la descarga
        res.setHeader('Content-Type', 'application/pdf');

        // Enviar la imagen como respuesta
        res.sendFile(rutaArchivo, (err) => {
            if (err) {
                console.error('Error al enviar el archivo:', err);
                res.status(500).send('Error al enviar el archivo');
            }
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).send('Error interno del servidor');
    }
});


router.get('/incapacidad/:nombrearchivo', (req, res) => {
    try {
        const { nombrearchivo } = req.params;

        // Obtener la ruta del directorio actual usando import.meta.url
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        const rutaArchivo = join(__dirname, '..', '..', 'uploads', 'incapacidad', nombrearchivo);

        // Configurar el encabezado Content-Type para PDF
        res.setHeader('Content-Type', 'application/pdf');

        // Enviar el archivo como respuesta
        res.sendFile(rutaArchivo, (err) => {
            if (err) {
                console.error('Error al enviar el archivo:', err);
                res.status(500).send('Error al enviar el archivo');
            }
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).send('Error interno del servidor');
    }
});


router.get('/dia/:nombrearchivo', (req, res) => {
    try {
        const { nombrearchivo } = req.params;

        // Obtener la ruta del directorio actual usando import.meta.url
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        const rutaArchivo = join(__dirname, '..', '..', 'uploads', 'dia', nombrearchivo);

        // // Configurar el encabezado Content-Disposition para la descarga
        res.setHeader('Content-Type', 'application/pdf');

        // Enviar la imagen como respuesta
        res.sendFile(rutaArchivo, (err) => {
            if (err) {
                console.error('Error al enviar el archivo:', err);
                res.status(500).send('Error al enviar el archivo');
            }
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).send('Error interno del servidor');
    }
});


router.get('/formacion/:nombrearchivo', (req, res) => {
    try {
        const { nombrearchivo } = req.params;

        // Obtener la ruta del directorio actual usando import.meta.url
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        const rutaArchivo = join(__dirname, '..', '..', 'uploads', 'fomracion', nombrearchivo);

        // Configurar el encabezado Content-Disposition para la descarga
        res.setHeader('Content-Type', 'application/pdf');

        // Enviar la imagen como respuesta
        res.sendFile(rutaArchivo, (err) => {
            if (err) {
                console.error('Error al enviar el archivo:', err);
                res.status(500).send('Error al enviar el archivo');
            }
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;
