module.exports = {
    "root": true,
    "extends": "ego",
    "parserOptions": {
        "project": "tsconfig.json",
        "tsconfigRootDir": __dirname,
        "sourceType": "module",
    },
    "rules": {
        // Additional, per-project rules...
        "import/no-default-export": ["off"],
        "require-await": ["off"],
        "no-redeclare": ["off"]
    }
}