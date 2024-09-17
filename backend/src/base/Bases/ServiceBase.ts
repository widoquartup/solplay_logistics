import { ServiceInterface } from './ServiceInterface';
import type { FindQueryParams } from "./__interfaces/FindQueryParams";
import type { FindResult } from "./__interfaces/FindResult";
import { RepositoryInterface, SortType } from './RepositoryInterface';
import { Document, FilterQuery, SortOrder } from 'mongoose';

export abstract class ServiceBase<T extends Document> implements ServiceInterface<T> {
    protected repository: RepositoryInterface<T>;

    constructor(repository: RepositoryInterface<T>) {
        this.repository = repository;
    }

    async index(query: FindQueryParams): Promise<FindResult<T>> {
        return await this.repository.find(query);
    }

    async show(_id: string): Promise<T | null> {
        return await this.repository.findById(_id);
    }

    async store(item: T): Promise<T> {
        return await this.repository.create(item);
    }

    async update(_id: string, item: T): Promise<T | null> {
        return await this.repository.update(_id, item);
    }

    async delete(_id: string): Promise<boolean> {
        return await this.repository.delete(_id);
    }

    async softDelete(_id: string): Promise<boolean> {
        return await this.repository.softDelete(_id);
    }

    async findWithMongo(query: FilterQuery<T>, sort?: SortType): Promise<T[]> {
        return await this.repository.findWithMongo(query, sort);
    }


}
