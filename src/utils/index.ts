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
import { Nullable } from "../types";

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
