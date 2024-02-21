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

import { ValidationError } from "../classes";
import type { NULL } from "../constants";
import type { EntityConfigurations, IEntityConfig, Nullable } from "../types";
import type { Constructor, Nilable } from "../types/internal";
import { isAsync } from "./internal";

/**
 * An async action used by `verifyEntityConfigurations()` function.
 */
export type AsyncVerifyEntityConfigurationsAction<TConfig extends EntityConfigurations = EntityConfigurations> =
    (context: IVerifyEntityConfigurationsActionContext<TConfig>) => PromiseLike<void>;

/**
 * An sync action used by `verifyEntityConfigurations()` function.
 */
export type SyncVerifyEntityConfigurationsAction<TConfig extends EntityConfigurations = EntityConfigurations> =
    (context: IVerifyEntityConfigurationsActionContext<TConfig>) => void;

/**
 * A context for a `VerifyEntityConfigurationsAction` function.
 */
export interface IVerifyEntityConfigurationsActionContext<
    TConfig extends EntityConfigurations = EntityConfigurations
> {
    /**
     * The current entity.
     */
    entity: {
        /**
         * The configuration object.
         */
        config: TConfig[keyof TConfig];
        /**
         * The name.
         */
        name: keyof TConfig;
    };
    /**
     * A non-empty value that represents a validation error.
     */
    validationError?: Nilable<string>;
}

/**
 * Options for `verifyEntityConfigurations()` function.
 */
export interface IVerifyEntityConfigurationsOptions<TConfig extends EntityConfigurations = EntityConfigurations> {
    /**
     * The configuration.
     */
    configurations: TConfig;
}

/**
 * Options for `verifyForStrictEntityDocumentation()` function.
 */
export interface IVerifyForStrictEntityDocumentationOptions<TConfig extends EntityConfigurations = EntityConfigurations> extends IVerifyEntityConfigurationsOptions<TConfig> {
}

/**
 * Possible value for an action used by `verifyEntityConfigurations()` function.
 */
export type VerifyEntityConfigurationsAction<TConfig extends EntityConfigurations = EntityConfigurations> =
    AsyncVerifyEntityConfigurationsAction<TConfig> |
    SyncVerifyEntityConfigurationsAction<TConfig>;

/**
 * Returns a value as non `NULL` value.
 *
 * @example
 * ```
 * import { getDbValue, NULL as DbNull, Nullable } from '@egomobile/orm'
 *
 * const a: Nullable<number> = 0
 * getDbValue(a)  // 0
 *
 * const b: Nullable<number> = DbNull
 * getDbValue(b)  // (null)
 * ```
 *
 * @param {T|Nullable<T>} val The value to transform.
 *
 * @returns {T|null} Is explicit (null) or not.
 */
export function getDbValue<T extends any = any>(val: T): T;
export function getDbValue<T extends any = any>(val: Nullable<T>): T | null {
    return isExplicitNull(val) ? null : val;
}

/**
 * Checks if a value represents an explicit (null).
 *
 * @example
 * ```
 * import { isExplicitNull, NULL } from '@egomobile/orm'
 *
 * // following values return (true)
 * isExplicitNull(NULL)
 * isExplicitNull(Symbol('NULL'))
 *
 * // anything else is (false)
 * ```
 *
 * @param {any} val The value to check.
 *
 * @returns {boolean} Is explicit (null) or not.
 */
export function isExplicitNull(val: any): val is typeof NULL {
    return typeof val === "symbol" && String(val) === "Symbol(NULL)";
}

/**
 * Validations the `EntityConfigurations` of a specific data context
 * using an `action`.
 *
 * @param {VerifyEntityConfigurationsAction} action The action to invoke.
 * @param {IVerifyEntityConfigurationsOptions<TConfig>} options The options.
 *
 * @returns {void|Promise<void>} No result here.
 */
export function verifyEntityConfigurations<TConfig extends EntityConfigurations = EntityConfigurations>(
    action: AsyncVerifyEntityConfigurationsAction,
    options: IVerifyEntityConfigurationsOptions<TConfig>
): Promise<void>;
export function verifyEntityConfigurations<TConfig extends EntityConfigurations = EntityConfigurations>(
    action: SyncVerifyEntityConfigurationsAction,
    options: IVerifyEntityConfigurationsOptions<TConfig>
): void;
export function verifyEntityConfigurations<TConfig extends EntityConfigurations = EntityConfigurations>(
    action: VerifyEntityConfigurationsAction,
    options: IVerifyEntityConfigurationsOptions<TConfig>
): void | Promise<void> {
    const {
        configurations
    } = options;

    const createActionContext = (entityName: string, entityConfig: IEntityConfig): IVerifyEntityConfigurationsActionContext => {
        return {
            "entity": {
                "config": entityConfig,
                "name": entityName
            }
        };
    };

    const throwOnError = (entityName: string, validationError: Nilable<string>) => {
        validationError = validationError?.trim();
        if (validationError?.length) {
            throw new ValidationError(`Validation of ${entityName} entity failed: ${validationError}`);
        }
    };

    if (isAsync(action)) {
        // asynchronious execution

        return (async () => {
            for (const [entityName, entityConfig] of Object.entries(configurations)) {
                const context = createActionContext(entityName, entityConfig);

                await action(context);

                throwOnError(entityName, context.validationError);
            }
        })();
    }

    for (const [entityName, entityConfig] of Object.entries(configurations)) {
        // synchronious execution

        const context = createActionContext(entityName, entityConfig);

        action(context);

        throwOnError(entityName, context.validationError);
    }
}

/**
 * Checks if entity configurations have all a complete and valid documentation.
 * If not, if throws an error.
 *
 * @param {IVerifyForStrictEntityDocumentationOptions<TConfig>} options The options.
 *
 * @throws ValidationError At least one validation failed.
 */
export function verifyForStrictEntityDocumentation<TConfig extends EntityConfigurations = EntityConfigurations>(
    options: IVerifyForStrictEntityDocumentationOptions<TConfig>
) {
    verifyEntityConfigurations((context) => {
        const {
            "config": entityConfig,
            "name": entityName
        } = context.entity;

        const entityComment = entityConfig.comment?.trim();
        if (!entityComment || entityComment.length < 10) {
            context.validationError = `Documentation for '${entityName}' has no meanful comment of min. 10 characters`;
            return;
        }

        const entityClass: Constructor<any> = entityConfig.type;
        const entityInstance = new entityClass();

        // props without methods
        const properties = new Set(
            [
                ...Object.getOwnPropertyNames(entityClass.prototype),
                ...Object.getOwnPropertyNames(entityInstance)
            ].filter((prop) => {
                return prop !== "constructor" &&
                    typeof entityClass.prototype[prop] !== "function" &&
                    typeof entityInstance[prop] !== "function";
            })
        );

        const entityFieldEntries = Object.entries(entityConfig.fields ?? {});

        for (const property of [...properties]) {
            const matchingFieldEntry = entityFieldEntries.find(([fieldName]) => {
                return fieldName === property;
            });
            if (!matchingFieldEntry) {
                context.validationError = `Field '${property}' for '${entityName}' is not documented`;
                return;
            }

            const [, fieldConfig] = matchingFieldEntry;

            const fieldComment = fieldConfig?.comment?.trim();
            if (!fieldComment || fieldComment.length < 10) {
                context.validationError = `Field '${property}' for '${entityName}' has no meanful comment of min. 10 characters`;
                return;
            }
        }
    }, options);
}
