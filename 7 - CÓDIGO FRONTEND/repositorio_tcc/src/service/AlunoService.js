import { BaseService } from './BaseService';

export class AlunoService extends BaseService {

    constructor(){
        super("/alunos");
    }
}