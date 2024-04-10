import { Router } from 'express';
import { AreaService } from '../service/index.js'
import { responsesUtiles } from '../utils/index.js'

const router = Router(); +

    router.get('/', (req, res) => {
        res.send('Hola desde area Router')
    })

    router.get('/obtenerTodo', async (req, res) => {

        try {
            const obtenerAreas = await AreaService.obtenerAreas()
            responsesUtiles.OperacionExitosa(res, obtenerAreas)
        } catch (error) {
            responsesUtiles.manejarError(res, error, 'error al intentar obtener las areas')
        }
    })

    export default router;