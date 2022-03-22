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

import type { IDataAdapter, IDataContext, EntityConfigurations, IFindOptions, IFindOneOptions } from '../types';
import type { Constructor, List, Nilable } from '../types/internal';

export interface IDataContextOptions {
    /**
     * The data adapter to use.
     */
    adapter: IDataAdapter;
    /**
     * The configurations of all entities / tables.
     */
    entities: EntityConfigurations;
}

export class DataContext implements IDataContext {
    public constructor(public readonly options: IDataContextOptions) {
    }

    public get entities(): EntityConfigurations {
        return this.options.entities;
    }

    public find<T extends any = any>(type: Constructor<T>, options?: Nilable<IFindOptions>) {
        return this.options.adapter.find<T>(type, options);
    }

    public findOne<T extends any = any>(type: Constructor<T>, options?: Nilable<IFindOneOptions>) {
        return this.options.adapter.findOne<T>(type, options);
    }

    public insert<T extends any = any>(entities: T | List<T>) {
        return this.options.adapter.insert(entities);
    }

    public query<T extends any = any>(q: any, ...paramsOrArgs: any[]): Promise<T> {
        return this.options.adapter.query(q, ...paramsOrArgs);
    }

    public queryAndMap<T extends any = any>(type: Constructor<T>, q: any, ...paramsOrArgs: any[]): Promise<T[]> {
        return this.options.adapter.queryAndMap(type, q, ...paramsOrArgs);
    }

    public remove<T extends any = any>(entities: T | List<T>) {
        return this.options.adapter.remove<T>(entities);
    }

    public update<T extends any = any>(entities: T | List<T>) {
        return this.options.adapter.update<T>(entities);
    }
}
