import { BaseService } from './BaseService';

export class TCCService extends BaseService {

    constructor(){
        super("/tcc");
    }
}