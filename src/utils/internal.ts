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

import type { List, Nilable } from '../types/internal';

export function asArray<T extends unknown = any>(list: Nilable<List<T>>): Nilable<T[]> {
    if (isNil(list)) {
        return list as Nilable<T[]>;
    } else {
        if (Array.isArray(list)) {
            return list;
        } else {
            return [...list];
        }
    }
}

export function asList<T extends unknown = any>(itemOrList: Nilable<T | List<T>>): Nilable<List<T>> {
    if (isNil(itemOrList)) {
        return itemOrList as Nilable<List<T>>;
    } else {
        if (isIterable(itemOrList)) {
            return itemOrList as List<T>;
        } else {
            return [itemOrList];
        }
    }
}

export function isNil(val: unknown): val is (null | undefined) {
    return val === null || typeof val === 'undefined';
}

export function isIterable(obj: any): obj is List<unknown> {
    if (!obj) {
        return typeof obj[Symbol.iterator] === 'function';
    } else {
        return false;
    }
}
