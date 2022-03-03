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
     * @example
     * ```
     * import { IDataRepository } from '@egomobile/orm'
     *
     * // keep sure to initialize your props
     * // with a value, which is not (undefined)
     * class User {
     *   id: number = -1;
     *   first_name: string = '';
     *   last_name: string = '';
     *   is_active: boolean | null = null;
     *   is_deleted: boolean = false;
     * }
     *
     * async function load10ActiveUsersAndSkipFirst(repo: IDataRepository): Promise<User[]> {
     *   // in SQL context
     *   return await repo.find(User, {
     *     where: 'is_active=$1 AND (is_deleted=$2 or is_deleted IS NULL)',
     *     params: [ true, false ],  // $1, $2
     *
     *     skip: 1,
     *     limit: 10
     *   })
     * }
     * ```
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
     * @example
     * ```
     * import { IDataRepository } from '@egomobile/orm'
     *
     * // keep sure to initialize your props
     * // with a value, which is not (undefined)
     * class User {
     *   id: number = -1;
     *   first_name: string = '';
     *   last_name: string = '';
     *   is_active: boolean | null = null;
     *   is_deleted: boolean = false;
     * }
     *
     * async function loadLastActiveUser(repo: IDataRepository): Promise<User> {
     *   // in SQL context
     *   return await repo.findOne(User, {
     *     where: 'is_active=$1 AND (is_deleted=$2 or is_deleted IS NULL)',
     *     params: [ true, false ],  // $1, $2
     *
     *     sort: {
     *       'created': 'DESC',  // first sort by 'created' (descending)
     *       'id': 'DESC',  // then by 'id' (descending)
     *       'last_name': 'ASC',  // then by 'last_name' (ascending)
     *       'first_name': 'ASC'  // then by 'first_name' (ascending)
     *     }
     *   })
     * }
     * ```
     *
     * @param {Constructor<T>} type The class / type.
     * @param {Nullable<IFindOneOptions>} [options] The custom options.
     *
     * @returns {Promise<Nullable<T>>} The promise with the item or (null) if not found.
     */
    findOne<T extends unknown = any>(type: Constructor<T>, options?: Nullable<IFindOneOptions>): Promise<Nullable<T>>;

    /**
     * Insert one or more entities.
     *
     * @example
     * ```
     * import { IDataRepository } from '@egomobile/orm'
     *
     * // keep sure to initialize your props
     * // with a value, which is not (undefined)
     * class User {
     *   id: number | null = null;
     *   first_name: string = '';
     *   last_name: string = '';
     *   is_active: boolean | null = null;
     *   is_deleted: boolean = false;
     * }
     *
     * async function createUser(repo: IDataRepository, firstName: string, lastName: string): Promise<User> {
     *   const newUser = new User()
     *   newUser.last_name = lastName
     *   newUser.first_name = firstName
     *   newUser.is_active = true
     *
     *   await repo.insert(newUser)
     * }
     * ```
     *
     * @param {T|List<T>} entities The entities to insert.
     */
    insert<T extends unknown = any>(entities: T | List<T>): Promise<void>;

    /**
     * Does a raw query.
     *
     * @example
     * ```
     * import { IDataRepository } from '@egomobile/orm'
     *
     * async function deleteInactiveUsers(repo: IDataRepository) {
     *   // in SQL context
     *   //
     *   // result is an object or value
     *   // from the underlying data adapter itself
     *   const result: any = await repo.query(
     *     "UPDATE users SET is_deleted=$1 WHERE is_active=$2;",
     *     false, false  // $1, $2
     *   )
     * }
     * ```
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
     * @example
     * ```
     * import { IDataRepository } from '@egomobile/orm'
     *
     * // keep sure to initialize your props
     * // with a value, which is not (undefined)
     * class User {
     *   id: number = -1;
     *   is_active: boolean | null = null;
     * }
     *
     * async function removeInactiveUsers(repo: IDataRepository, users: User[]) {
     *   const inactiveUsers = users.find(u => u.is_active === false)
     *
     *   await repo.remove(inactiveUsers)
     * }
     * ```
     *
     * @param {T|List<T>} entities The entities to remove.
     */
    remove<T extends unknown = any>(entities: T | List<T>): Promise<void>;

    /**
     * Updates one or more entities.
     *
     * @example
     * ```
     * import { IDataRepository } from '@egomobile/orm'
     *
     * // keep sure to initialize your props
     * // with a value, which is not (undefined)
     * class User {
     *   id: number = -1;
     *   is_deleted: boolean = false;
     * }
     *
     * async function deleteUsers(repo: IDataRepository, users: User[]) {
     *   users.forEach((user) => {
     *     user.is_deleted = true
     *   })
     *
     *   await repo.update(inactiveUsers)
     * }
     * ```
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
