// VariableRepository.ts
import { VariableType } from './VariableType';
import mongoose from 'mongoose';
import { RepositoryBase } from '@base/Bases/RepositoryBase';


export class VariableRepository extends RepositoryBase <VariableType> {
  constructor(model: mongoose.Model<VariableType>) {
    super(model);
  }

  async setValue(name: string, group: string = "generic", value: unknown): Promise<any> {
    
    let type:string  = typeof value;
    if (value && typeof value == 'object'){
      type = value.constructor.name;
    }
    let result;
    const filters ={ "$and": [{ "group" : {"=": `${group}`}}, { "name" : {"=": `${name}`}}] };
    const ret = await this.find({filters: JSON.stringify(filters), page: "1", itemsPerPage: "1",});
    try {
      if (ret.collection.length == 0) {
        result = await this.create({name: name, group: group, value: JSON.stringify(value), type: type} as VariableType);
      }else{
        const row = ret.collection[0]; 
        result = await this.update(row._id as string ,
                      {name: name, group: group, value: JSON.stringify(value), type: type} as VariableType
        );
      }
      // console.log("Result", result);
    } catch (error) {
      // console.log("Result", error);
      
    }
  }

  async getValue(name: string, group: string = "generic", defaultValue: any = null): Promise<any> {
    const filters ={ "$and": [{ "group" : {"=": `${group}`}}, { "name" : {"=": `${name}`}}] };
    
    try {
      const ret = await this.find({filters: JSON.stringify(filters), page: "1", itemsPerPage: "1",});
      if (ret.collection.length == 0) {
        await this.setValue(name, group, defaultValue);
        return defaultValue;
      }
      const row = ret.collection[0];
      const resultVariable = JSON.parse(row.value);
      if (row.type == "Date") {
        return new Date(resultVariable);
      }
      return resultVariable;
    } catch (error) {
      // console.log("Error en getValue", error);
      return null;
    }
  }
}

