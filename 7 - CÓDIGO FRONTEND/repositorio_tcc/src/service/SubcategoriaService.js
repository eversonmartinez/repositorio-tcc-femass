import { BaseService } from './BaseService';

export class SubcategoriaService extends BaseService {

    constructor(){
        super("/subcategorias");
    }
}