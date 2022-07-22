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

import { NULL } from "../constants";
import type { IEntityFieldTransformer } from "../types";
import { isNil } from "../utils/internal";

/**
 * Converts from and to a Date value.
 */
export const dateTransformer: IEntityFieldTransformer = {
    /**
     * @inheritdoc
     */
    "from": (value) => {
        return valueToDate(value, NULL);
    },

    /**
     * @inheritdoc
     */
    "to": (value) => {
        return valueToDate(value, value);
    }
};

function valueToDate(value: unknown, ifNilValue: any): any {
    if (value instanceof Date) {
        return value;
    }
    else if (isNil(value)) {
        return ifNilValue;
    }
    else {
        if (typeof value === "number") {
            return new Date(value);
        }
        else {
            const str = String(value).trim();
            if (str.length) {
                return new Date(parseInt(str, 10));
            }
            else {
                return ifNilValue;
            }
        }
    }
}
