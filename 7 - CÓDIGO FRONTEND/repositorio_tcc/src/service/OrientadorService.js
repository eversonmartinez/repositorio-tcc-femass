import { BaseService } from './BaseService';

export class OrientadorService extends BaseService {

    constructor(){
        super("/orientadores");
    }
}