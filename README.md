[![npm](https://img.shields.io/npm/v/@egomobile/orm.svg)](https://www.npmjs.com/package/@egomobile/orm)
[![last build](https://img.shields.io/github/workflow/status/egomobile/node-orm/Publish)](https://github.com/egomobile/node-orm/actions?query=workflow%3APublish)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/egomobile/node-orm/pulls)

# @egomobile/orm

> A simple and generic ORM mapper.

## Install

Execute the following command from your project folder, where your `package.json` file is stored:

```bash
npm install --save @egomobile/orm
```

## Usage

```typescript
import { createDataContext, DbNullable, NULL as DbNull } from "@egomobile/orm";
import { PostgreSQLDataAdapter } from "@egomobile/orm-pg"; // npm i @egomobile/orm-pg

// the reason, why non-nullable fields
// can have (null) values is, that (null)
// indicates, that the underlying fields
// should not be defined / updated in the
// database
//
// to set a value explicitly (null) in database
// use the value of DbNull instead
class User {
  // non-nullable fields
  public id: number | null = null;
  public first_name: string | null = null;
  public last_name: string | null = null;

  // nullable fields
  public email: DbNullable<string | null> = null;
}

async function main() {
  const context = await createDataContext({
    adapter: new PostgreSQLDataAdapter(),
    entities: {
      // name of the entity / table
      users: {
        ids: ["id"], // list of column(s) which represent the ID
        type: User, // the class / type to use to create objects from
      },
    },
  });

  const listOfUsers = await context.find(User, {
    // the following both settings depend on the underlying
    // data adapter
    where: "is_active=$1 AND is_deleted=$2",
    params: [true, false], // $1, $2

    offset: 1, // skip the first
    limit: 100, // only return 100 rows
  });

  // return a user with ID 5979
  const specificUser = await context.findOne(User, {
    where: "id=$1",
    params: [5979], // $1
  });

  if (specificUser !== null) {
    // update with new data
    specificUser.last_name = "Doe";
    specificUser.first_name = "Jane";
    specificUser.email = DbNull;
    await context.update(specificUser);

    // remove from database
    await context.remove(specificUser);
  } else {
    console.log("User not found");
  }
}

// create new POCO
const newUser = new User();
newUser.first_name = "John";
newUser.last_name = "Doe";
// ... and add it to database
await context.insert(newUser);

// depending on data adapter, it might be
// possible to do raw queries
const result: any = await context.query(
  "SELECT * FROM users WHERE id=$1 AND is_active=$2;",
  23979,
  true
);
console.log(result);

main().catch(console.error);
```

## Documentation

The API documentation can be found [here](https://egomobile.github.io/node-orm/).
