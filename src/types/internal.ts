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

export type Constructor<T extends unknown = any> = (new (...args: any[]) => T);

export type List<T extends unknown = any> = T[] | Iterable<T> | IterableIterator<T>;

export type Optional<T extends unknown = any> = T | undefined;

export type Nilable<T extends unknown = any> = Optional<T> | Nullable<T>;

export type Nullable<T extends unknown = any> = T | null;
