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

import type { NULL } from "../constants";
import type { Constructor, List, Nilable } from "./internal";

/**
 * An action, which transforms data.
 *
 * @param {any} value The input value.
 *
 * @returns {any} The output value.
 */
export type DataTransformer = (value: any) => any;

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
     *     offset: 1,
     *     limit: 10
     *   })
     * }
     * ```
     *
     * @param {Constructor<T>} type The class / type.
     * @param {Nilable<IFindOptions>} [options] The custom options.
     *
     * @returns {Promise<T[]>} The promise with the items.
     */
    find<T extends any = any>(type: Constructor<T>, options?: Nilable<IFindOptions>): Promise<T[]>;

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
     * @param {Nilable<IFindOneOptions>} [options] The custom options.
     *
     * @returns {Promise<T|null>} The promise with the item or (null) if not found.
     */
    findOne<T extends any = any>(type: Constructor<T>, options?: Nilable<IFindOneOptions>): Promise<T | null>;

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
     * @param {T} entity The entity to insert.
     * @param {List<T>} entities The entities to insert.
     *
     * @returns {Promise<T|T[]>} The promise with the inserted entity/entities.
     */
    insert<T extends any = any>(entity: T): Promise<T>;
    insert<T extends any = any>(entities: List<T>): Promise<T[]>;
    insert<T extends any = any>(entityOrEntities: T | List<T>): Promise<T | T[]>;

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
    query<T extends any = any>(q: any, ...paramsOrArgs: any[]): Promise<T>;

    /**
     * Does a raw query and maps the result(s) to entity objects.
     * The classes do not need to be configured in context, so it is
     * possbile to implement and work with "joins".
     *
     * @example
     * ```
     * import { IDataRepository } from '@egomobile/orm'
     *
     * class UserAndRole {
     *   role_id!: string;
     *   user_id!: string;
     * }
     *
     * async function loadUserRoles(repo: IDataRepository): Promise<UserAndRole[]> {
     *   // PostgreSQL example
     *   // s. https://github.com/egomobile/node-orm-pg
     *
     *   return await repo.queryAndMap(
     *     UserAndRole,  // type of the target entity
     *                   // does not need to be configured
     *                   // in data context
     *
     *     // build query
     *     "SELECT DISTINCT ur.id AS role_id, u.id AS user_id " +
     *     "FROM user_roles ur " +
     *     "INNER JOIN users u ON u.id = ur.user_id " +
     *     "WHERE u.is_active = $1 AND u.is_deleted = $2;",
     *
     *     // additional parameters
     *     true, false  // $1, $2
     *   )
     * }
     * ```
     *
     * @param {Constructor<T>} type The target type.
     * @param {any} q The object / value, which represents the query.
     * @param {any[]} [paramsOrArgs] A list of optional parameters or arguments for the query.
     *
     * @returns {Promise<T[]>} The promise with the mapped entities.
     */
    queryAndMap<T extends any = any>(type: Constructor<T>, q: any, ...paramsOrArgs: any[]): Promise<T[]>;

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
     * @param {T} entity The entity to remove.
     * @param {List<T>} entities The entities to remove.
     *
     * @returns {Promise<T|T[]>} The promise with the removed entity/entities.
     */
    remove<T extends any = any>(entity: T): Promise<T>;
    remove<T extends any = any>(entities: List<T>): Promise<T[]>;
    remove<T extends any = any>(entityOrEntities: T | List<T>): Promise<T | T[]>;

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
     * @param {T} entity The entity to update.
     * @param {List<T>} entities The entities to update.
     *
     * @returns {Promise<T|T[]>} The promise with the updated entity/entities.
     */
    update<T extends any = any>(entity: T): Promise<T>;
    update<T extends any = any>(entities: List<T>): Promise<T[]>;
    update<T extends any = any>(entityOrEntities: T | List<T>): Promise<T | T[]>;
}

/**
 * A configuration for an entity.
 */
export interface IEntityConfig {
    /**
     * The custom field configurations.
     */
    fields?: Nilable<Record<string, IEntityFieldConfig>>;
    /**
     * List of columns / fields which representthe ID.
     */
    ids?: Nilable<string[]>;
    /**
     * The class / type to use to create instances for an entity.
     */
    type: Constructor<any>;
}

/**
 * A configuration for an entity field.
 */
export interface IEntityFieldConfig {
    /**
     * The custom and optional data transformer.
     */
    transformer?: Nilable<IEntityFieldTransformer>;
}

/**
 * An object, which transforms the data of a field.
 */
export interface IEntityFieldTransformer {
    /**
     * The optional action to invoke, when
     * data comes from database to entity.
     */
    from?: Nilable<DataTransformer>;
    /**
     * The optional action to invoke, when
     * data of an entity field is written
     * to database.
     */
    to?: Nilable<DataTransformer>;
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
     * The number of items to skip. Default: 0
     */
    offset?: Nilable<number>;
    /**
     * An object that represents the parameters for the 'where' part.
     */
    params?: Nilable;
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

/**
 * A data(-base) value, which can also be (null) or something like that.
 */
export type Nullable<T extends any = any> = T | typeof NULL;
