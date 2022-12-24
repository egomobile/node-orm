# Change Log (@egomobile/orm)

## 0.9.0

- **BREAKING CHANGE**: improve interfaces of [insert()](https://egomobile.github.io/node-orm/interfaces/IDataRepository.html#insert), [remove()](https://egomobile.github.io/node-orm/interfaces/IDataRepository.html#remove) and [update()](https://egomobile.github.io/node-orm/interfaces/IDataRepository.html#update) methods
- library required at least [Node 16](https://nodejs.org/en/blog/release/v16.0.0/) now
- code cleanups and improvements
- `npm update`s

## 0.8.0

- add `getDbValue()` utility function
- library required at least [Node 14](https://nodejs.org/en/blog/release/v14.0.0/) now
- apply new [linter settings](https://github.com/egomobile/eslint-config-ego)
- `npm update`s

## 0.7.0

- add [queryAndMap()](https://egomobile.github.io/node-orm/interfaces/IDataRepository.html#queryAndMap)

## 0.6.1

- add types which helpds to realize data transformations between databases and entities
- add helper methods to [DataAdapterBase](https://egomobile.github.io/node-orm/classes/DataAdapterBase.html) to simply access entity configuration data

## 0.5.0

- `insert()`, `remove()` and `update()` of [IDataRepository](https://egomobile.github.io/node-orm/interfaces/IDataRepository.html) return the updated entity now

## 0.4.1

- **BREAKING CHANGE**: change `skip` to `offset` in [IFindOneOptions interface](https://egomobile.github.io/node-orm/interfaces/IFindOneOptions.html)

## 0.3.2

- `isNull()` => `isExplicitNull()`
- (bug-)fixes

## 0.2.1

- add functions, types and values to handle `(null)`s

## 0.1.0

- initial release
