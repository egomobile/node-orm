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

export function isAsync(func: ((...args: any[]) => any)): boolean {
    const funcStr = func.toString();

    return /^\s*async\s+/.test(funcStr);
}

export function isNil(val: unknown): val is (null | undefined) {
    return typeof val === "undefined" || val === null;
}
