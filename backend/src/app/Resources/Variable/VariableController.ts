// VariableController.ts
import { ControllerBase } from '@base/Bases/ControllerBase';
import { VariableService } from './VariableService';
import { VariableRepository } from './VariableRepository';
import { VariableModel } from './VariableModel';
import { VariableType } from './VariableType';

class VariableController extends ControllerBase<VariableType, VariableService> {
    constructor(service: VariableService) {
        super(service);
    }
}

const repository = new VariableRepository(VariableModel);
const service = new VariableService(repository);
const variableController = new VariableController(service);
export { variableController };
