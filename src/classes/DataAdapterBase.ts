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

import type { IDataAdapter, IDataContext, IFindOneOptions, IFindOptions } from '../types';
import type { Constructor, List, Nilable } from '../types/internal';

/**
 * A basic data adapter.
 */
export abstract class DataAdapterBase implements IDataAdapter {
    /**
     * The underlying adapter.
     */
    private _context: Nilable<IDataContext>;

    /**
     * Gets the underlying context.
     *
     * @returns {IDataContext} The context.
     */
    public get context(): IDataContext {
        // eslint-disable-next-line no-underscore-dangle
        if (!this._context) {
            throw new TypeError('context is not defined');
        }

        // eslint-disable-next-line no-underscore-dangle
        return this._context;
    }

    /**
     * @inheritdoc
     */
    public abstract find<T extends any = any>(type: Constructor<T>, options?: IFindOptions | null): Promise<T[]>;

    /**
     * @inheritdoc
     */
    public abstract findOne<T extends any = any>(type: Constructor<T>, options?: IFindOneOptions | null): Promise<T | null>;

    /**
     * @inheritdoc
     */
    public abstract insert<T extends any = any>(entities: T | List<T>): Promise<T>;

    /**
     * @inheritdoc
     */
    public abstract query(q: any, ...paramsOrArgs: any[]): Promise<any>;

    /**
     * @inheritdoc
     */
    public abstract remove<T extends any = any>(entities: T | List<T>): Promise<T>;

    /**
     * @inheritdoc
     */
    public setContext(context: IDataContext): this {
        // eslint-disable-next-line no-underscore-dangle
        this._context = context;

        return this;
    }

    /**
     * @inheritdoc
     */
    public abstract update<T extends any = any>(entities: T | List<T>): Promise<T>;
}
