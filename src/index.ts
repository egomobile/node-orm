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

import { DataContext, IDataContextOptions } from "./classes/DataContext";
import type { IDataContext } from "./types";

/**
 * Options for 'createDataContext()' function.
 */
export interface ICreateDataContextOptions extends IDataContextOptions {
}

/**
 * Creates a new data context.
 *
 * @param {ICreateDataContextOptions} options The options.
 *
 * @returns {Promise<IDataContext>} The promise with the new context.
 */
export async function createDataContext(options: ICreateDataContextOptions): Promise<IDataContext> {
    const newContext = new DataContext(options);

    options.adapter.setContext(newContext);

    return newContext;
}

export * from "./types";
export * from "./constants";
export * from "./classes/DataAdapterBase";
export * from "./utils";
