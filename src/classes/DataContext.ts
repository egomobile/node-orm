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

import type { IDataAdapter, IDataContext, EntityConfigurations, IFindOptions, IFindOneOptions } from "../types";
import type { Constructor, List, Nilable } from "../types/internal";

/**
 * Options for a data context.
 */
export interface IDataContextOptions {
    /**
     * The data adapter to use.
     */
    adapter: IDataAdapter;
    /**
     * The configurations of all entities / tables.
     */
    entities: EntityConfigurations;
    /**
     * Indicates that the special value `NULL` should not be used
     * by default.
     *
     * @default `false`
     */
    noDbNull?: Nilable<boolean>;
}

export class DataContext implements IDataContext {
    public readonly entities: EntityConfigurations;

    public constructor(public readonly options: IDataContextOptions) {
        this.entities = {
            ...options.entities
        };
    }

    public count<T extends any = any>(type: Constructor<T>, options?: Nilable<IFindOptions>) {
        return this.options.adapter.count<T>(type, options);
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

    public get noDbNull(): boolean {
        return !!this.options.noDbNull;
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
