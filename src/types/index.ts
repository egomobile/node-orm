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

import type { Constructor, List, Nilable, Nullable } from './internal';

/**
 * Object with entity configurations.
 */
export type EntityConfigurations = Record<string, IEntityConfig>;

/**
 * A data context.
 */
export interface IDataContext extends IDataRepository {
    /**
     * The list of entity configurations.
     */
    entities: EntityConfigurations;
}

/**
 * A data adapter, like a Mongo or PostgreSQL connection.
 */
export interface IDataAdapter extends IDataRepository {
    /**
     * Sets the data context.
     *
     * @param {IDataContext} context The context.
     *
     * @returns {this}
     */
    setContext(context: IDataContext): this;
}

/**
 * A data repository.
 */
export interface IDataRepository {
    /**
     * Finds a list of items.
     *
     * @param {Constructor<T>} type The class / type.
     * @param {Nullable<IFindOptions>} [options] The custom options.
     *
     * @returns {Promise<T[]>} The promise with the items.
     */
    find<T extends unknown = any>(type: Constructor<T>, options?: Nullable<IFindOptions>): Promise<T[]>;

    /**
     * Tries to find a simple item.
     *
     * @param {Constructor<T>} type The class / type.
     * @param {Nullable<IFindOneOptions>} [options] The custom options.
     *
     * @returns {Promise<Nullable<T>>} The promise with the item or (null) if not found.
     */
    findOne<T extends unknown = any>(type: Constructor<T>, options?: Nullable<IFindOneOptions>): Promise<Nullable<T>>;

    /**
     * Does a raw query.
     *
     * @param {any} q The object / value, which represents the query.
     * @param {any[]} [paramsOrArgs] A list of optional parameters or arguments for the query.
     *
     * @returns {Promise<T>} The promise with the raw result.
     */
    query<T extends unknown = any>(q: any, ...paramsOrArgs: any[]): Promise<T>;

    /**
     * Removes one or more entities.
     *
     * @param {T|List<T>} entities The entities to remove.
     */
    remove<T extends unknown = any>(entities: T | List<T>): Promise<void>;

    /**
     * Updates one or more entities.
     *
     * @param {T|List<T>} entities The entities to update.
     */
    update<T extends unknown = any>(entities: T | List<T>): Promise<void>;
}

/**
 * A configuration for an entity.
 */
export interface IEntityConfig {
    /**
     * The class / type to use to create instances for an entity.
     */
    type: Constructor<unknown>;
}

/**
 * Options for finding one single entity.
 */
export interface IFindOneOptions {
    /**
     * Custom list of fields / columns.
     */
    fields?: Nilable<any[]>;
    /**
     * An object that represents the parameters for the 'where' part.
     */
    params?: any;
    /**
     * The number of items to skip. Default: 0
     */
    skip?: Nilable<number>;
    /**
     * An object, which is used to sort the result.
     */
    sort?: Nilable<any>;
    /**
     * An object, which is used to filter the result.
     */
    where?: Nilable<any>;
}

/**
 * Options for finding entities.
 */
export interface IFindOptions extends IFindOneOptions {
    /**
     * The maximum number of items. Default: no limit
     */
    limit?: Nilable<number>;
}
