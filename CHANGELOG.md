# Change Log (@egomobile/orm)

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
