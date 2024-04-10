import {areaModel} from '../models/areaModelo.js';
import { crudService } from './index.js';

export const obtenerAreas = async () => {
    try {
      const registros = await areaModel.findMany({
        select: {
          id: true,
          descripcion: true,
        },
      });
  
      return registros;
    } catch (error) {
      console.error(`Error al intentar obtener todos los registros: ${error.message}`);
      return null;
    }
  };
