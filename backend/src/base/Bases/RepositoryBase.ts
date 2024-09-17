// import mongoose from "mongoose";
import { Model, FilterQuery } from 'mongoose';

import { RepositoryInterface, SortType } from "./RepositoryInterface";
import { context } from '@base/context';
import NotFoundException from "@base/Exceptions/NotFoundException";
import type { FindQueryParams } from "./__interfaces/FindQueryParams";
import type { FindResult } from "./__interfaces/FindResult";
import { BaseDocument } from './__interfaces/BaseDocument'; // importar la nueva interfaz
import { MongoQueryBuilder } from '@base/Utils/MongoQueryBuilder';

// import util from 'util';
// import config from '@src/app/config';

export abstract class RepositoryBase<T extends BaseDocument> implements RepositoryInterface<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;

    }

    async find(query: FindQueryParams): Promise<FindResult<T>> {
        const { itemsPerPage, skip, sort, page, search, filters, permanentFilters, project } = this.processQuery(query);
        // console.log(">>>>>>>>>>>>>> FILTERS ",filters, this.model.modelName || this.model.constructor.name);
        const totalRows = await this.getTotalRows(permanentFilters);
        const totalFilteredRows: number = await this.getTotalFilteredRows(search, permanentFilters, filters);
        const queryAggregation = [
            { $match: { isDeleted: false } },
            { $match: permanentFilters }, // Agregar la etapa de búsqueda
            { $match: filters }, // Agregar la etapa de búsqueda
            { $match: search }, // Agregar la etapa de búsqueda
            { $project: project }, // Etapa de proyección
            { $sort: sort },
            { $skip: skip },
            { $limit: itemsPerPage },
        ];
        // console.log('notin->', util.inspect(filters, { depth: null, colors: true }));
        const collection = await this.model.aggregate(queryAggregation).exec();
        return {
            collection: collection,
            itemsPerPage: itemsPerPage,
            page: page,
            pages: Math.ceil(totalFilteredRows / itemsPerPage),
            totalFilteredRows: totalFilteredRows,
            totalRows: totalRows
        };
    }

    async findById(_id: string): Promise<T | null> {
        return await this.model.findOne({ _id, isDeleted: false }).lean();
    }
    async findOne(query: FilterQuery<T>): Promise<T | null> {
        return this.model.findOne(query).lean();
    }

    async findWithMongo(query: FilterQuery<T>, sort?: SortType): Promise<T[]> {
        let result = this.model.find(query);
        if (sort !== undefined){
            result = result.sort(sort);
        }
        return await result.exec();
    }


    async create(item: Omit<T, "_id">): Promise<T> {
        const created = await this.model.create(item as T);
        const action = {
            action: "created",
            entity: this.model.collection.collectionName,
            item: created,
        };
        context.actions = [...context.actions, action];
        return created;
    }

    async update(_id: string, datos: Partial<T>): Promise<T> {
        const updatedDocument = await this.model.findOneAndUpdate(
            { _id, isDeleted: false },
            datos,
            { new: true }
        );
        if (!updatedDocument) {
            throw new NotFoundException(`Documento con _id=${_id} no encontrado.`);
        }
        const action = {
            action: "updated",
            entity: this.model.collection.collectionName,
            item: updatedDocument,
        };
        context.actions = [...context.actions, action];
        return updatedDocument;
    }

    async delete(_id: string): Promise<boolean> {
        const deletedDocument = await this.model.findOneAndDelete({ _id, isDeleted: false });
        if (!deletedDocument) {
            throw new NotFoundException(`Documento con _id=${_id} no encontrado.`);
        }
        const action = {
            action: "delete",
            entity: this.model.collection.collectionName,
            item: deletedDocument,
        };
        context.actions = [...context.actions, action];
        return true;
    }

    async softDelete(_id: string): Promise<boolean> {
        const resource = await this.findById(_id);
        if (!resource) {
            throw new NotFoundException(`Documento con _id=${_id} no encontrado.`);
        }
        await this.update(_id, { isDeleted: true } as Partial<T>);
        return true;
    }
    /**
     * bloque privadas
     */
    processQuery(query: FindQueryParams, sortDefault: Record<string, 1 | -1> = { _id: -1 }) {

        let itemsPerPage: number = 5;
        let page: number = 1;
        let sortBy: string[] = [];
        let sortDesc: boolean[] = [];

        // eslint-disable-next-line
        let project: Record<string, any> = { __v: 0 };
        // eslint-disable-next-line
        let search: Record<string, any> = {};
        // eslint-disable-next-line
        let filters: Record<string, any> = {};
        // eslint-disable-next-line
        let permanentFilters: Record<string, any> = {};

        if (query.filters !== undefined) {
            const builder = new MongoQueryBuilder(JSON.parse(query.filters));
            filters = builder.getQuery();
        }
        if (query.permanentFilters !== undefined) {
            const builder = new MongoQueryBuilder(JSON.parse(query.permanentFilters));
            permanentFilters = builder.getQuery();
        }
        if (query.itemsPerPage !== undefined) {
            itemsPerPage = parseInt(query.itemsPerPage);
        }
        if (query.page !== undefined) {
            page = parseInt(query.page);
        }
        if (query.sortBy !== undefined) {
            sortBy = JSON.parse(query.sortBy);
        }
        if (query.sortDesc !== undefined) {
            sortDesc = JSON.parse(query.sortDesc);
        }
        if (query.simpleSearch !== undefined) {
            search = this.buildSearch(query.simpleSearch);
        }
        if (query.project !== undefined) {
            project = JSON.parse(query.project);
        }
        const sort = this.buildSortObject(sortBy, sortDesc, sortDefault);
        const skip: number = this.getSkip(page, itemsPerPage);

        return { itemsPerPage, skip, sort, page, search, filters, permanentFilters, project };
    }


    // eslint-disable-next-line
    async getTotalRows(permanentFilters: Record<string, any>,) {

        const totalRowsAggregation = await this.model.aggregate([
            { $match: { isDeleted: false } },
            { $match: permanentFilters },
            { $count: "totalRows" }
        ]).exec();

        return totalRowsAggregation.length > 0 ? totalRowsAggregation[0].totalRows : 0;
    }
    // eslint-disable-next-line
    async getTotalFilteredRows(search: Record<string, any>, permanentFilters: Record<string, any>, filters: Record<string, any>): Promise<number> {

        const totalRowsAggregation = await this.model.aggregate([
            { $match: { isDeleted: false } },
            { $match: permanentFilters },
            { $match: filters },
            { $match: search },
            { $count: "totalFilteredRows" }
        ]).exec();

        return totalRowsAggregation.length > 0 ? totalRowsAggregation[0].totalFilteredRows : 0;
    }
    getSkip(page: number, itemsPerPage: number) {
        return (page * itemsPerPage) - itemsPerPage;
    }

    buildSortObject(
        sortBy: string[],
        sortDesc: boolean[],
        sortDefault: Record<string, 1 | -1>
    ): Record<string, 1 | -1> {
        if (sortBy.length === 0) {
            return sortDefault;
        }

        const sortObject: Record<string, 1 | -1> = {};
        for (let i = 0; i < sortBy.length; i++) {
            sortObject[sortBy[i]] = sortDesc[i] ? -1 : 1;
        }
        return sortObject;
    }
    isNumeric(value: string | number): boolean {
        return !isNaN(Number(value)) && isFinite(Number(value));
    }
    /* eslint-disable */
    buildSearch(searchString: string): Record<string, any> {
        const searchObject: Record<string, any> = {};
        const search: { search: string; fields: string[] } = JSON.parse(searchString);

        if (search.search && search.fields && Array.isArray(search.fields)) {
            const orArray: Record<string, any>[] = [];

            for (const field of search.fields) {
                const fieldSearch: Record<string, any> = {};
                if (this.isNumeric(search.search)) {
                    fieldSearch[field] = parseInt(search.search)
                } else {
                    fieldSearch[field] = { $regex: search.search, $options: 'i' };
                }
                orArray.push(fieldSearch);
            }

            searchObject['$or'] = orArray;
        }
        return searchObject;
    }
    /* eslint-enable */


}
