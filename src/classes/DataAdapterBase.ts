/* eslint-disable unicorn/filename-case */

// This file is part of the @egomobile/orm distribution.
// Copyright (c) Next.e.GO Mobile SE, Aachen, Germany (https://e-go-mobile.com/)
//
// @egomobile/orm is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation, version 3.
//
// @egomobile/orm is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

import type { IDataAdapter, IDataContext, IFindOneOptions, IFindOptions } from "../types";
import type { Constructor, List, Nilable } from "../types/internal";

/**
 * A basic data adapter.
 */
export abstract class DataAdapterBase implements IDataAdapter {
    /**
     * The underlying adapter.
     */
    private _context: Nilable<IDataContext>;

    /**
     * Gets the underlying context.
     *
     * @returns {IDataContext} The context.
     */
    public get context(): IDataContext {
        // eslint-disable-next-line no-underscore-dangle
        if (!this._context) {
            throw new TypeError("context is not defined");
        }

        // eslint-disable-next-line no-underscore-dangle
        return this._context;
    }

    /**
     * @inheritdoc
     */
    public abstract find<T extends any = any>(type: Constructor<T>, options?: Nilable<IFindOptions>): Promise<T[]>;

    /**
     * @inheritdoc
     */
    public abstract findOne<T extends any = any>(type: Constructor<T>, options?: Nilable<IFindOneOptions>): Promise<T | null>;

    /**
     * Returns an entity by its type.
     *
     * @param {Constructor<any>} type The type of the entity.
     *
     * @returns {object|null} The object or (null), if not found.
     */
    public getEntityByType(type: Constructor<any>) {
        for (const [name, config] of Object.entries(this.context.entities)) {
            if (config.type === type) {
                return {
                    config,
                    name
                };
            }
        }

        return null;
    }

    /**
     * Returns an entity by its type or throws an exception if not found.
     *
     * @param {Constructor<any>} type The type of the entity.
     *
     * @returns {object} The object.
     */
    public getEntityByTypeOrThrow(type: Constructor<any>) {
        const entity = this.getEntityByType(type);
        if (entity) {
            return entity;
        }
        else {
            throw new Error(`Entity type ${type.name} not configured`);
        }
    }

    /**
     * Returns the list of entity/table fields, which represent
     * the IDs of a row.
     *
     * @param {Constructor<any>} type The type.
     *
     * @returns {string[]} The list of field names.
     */
    public getEntityIdsByType(type: Constructor<any>): string[] {
        const entity = this.getEntityByTypeOrThrow(type);

        if (entity.config.ids?.length) {
            return entity.config.ids;
        }
        else {
            return [];
        }
    }

    /**
     * Returns the list of entity fields columns, which represent
     * the IDs of a row, or throws an exception if not defined.
     *
     * @param {Constructor<any>} type The type.
     *
     * @returns {string[]} The list of ID fields.
     */
    public getEntityIdsByTypeOrThrow(type: Constructor<any>): string[] {
        const entity = this.getEntityByTypeOrThrow(type);

        if (entity.config.ids?.length) {
            return entity.config.ids;
        }
        else {
            throw new Error(`No IDs defined for type ${type.name}`);
        }
    }

    /**
     * Returns the name of the underlying entity/table by type or throws an exception, if not configured.
     *
     * @param {Constructor<any>} type The type.
     *
     * @returns {string} The name of the underlying entity/table name.
     */
    public getEntityNameByTypeOrThrow(type: Constructor<any>): string {
        return this.getEntityByTypeOrThrow(type).name;
    }

    /**
     * @inheritdoc
     */
    public abstract insert<T extends any = any>(entityOrEntities: T | List<T>): Promise<T | T[]>;

    /**
     * @inheritdoc
     */
    public abstract query(q: any, ...paramsOrArgs: any[]): Promise<any>;

    /**
     * @inheritdoc
     */
    public abstract queryAndMap(type: Constructor<any>, q: any, ...paramsOrArgs: any[]): Promise<any[]>;

    /**
     * @inheritdoc
     */
    public abstract remove<T extends any = any>(entityOrEntities: T | List<T>): Promise<T | T[]>;

    /**
     * @inheritdoc
     */
    public setContext(context: IDataContext): this {
        // eslint-disable-next-line no-underscore-dangle
        this._context = context;

        return this;
    }

    /**
     * @inheritdoc
     */
    public abstract update<T extends any = any>(entityOrEntities: T | List<T>): Promise<T | T[]>;
}
