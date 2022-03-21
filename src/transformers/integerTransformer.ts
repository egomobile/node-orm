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

import { NULL } from '../constants';
import type { IEntityFieldTransformer } from '../types';
import { isNil } from '../utils/internal';

/**
 * Converts from and to an integer value.
 */
export const integerTransformer: IEntityFieldTransformer = {
    /**
     * @inheritdoc
     */
    from: (value) => valueToInt(value, NULL),

    /**
      * @inheritdoc
      */
    to: (value) => valueToInt(value, value)
};

function valueToInt(value: unknown, ifNilValue: any): any {
    if (Number.isSafeInteger(value)) {
        return value;
    } else if (isNil(value)) {
        return ifNilValue;
    } else {
        const str = String(value).trim();
        if (str.length) {
            return parseInt(str, 10);
        } else {
            return ifNilValue;
        }
    }
}
