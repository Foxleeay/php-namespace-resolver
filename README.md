# PHP Namespace Resolver

> Experimental release. Unexpected bugs may occur while the extension is being tested and refined.

## Features

- Resolve a selected PHP class name by searching the workspace for a matching `.php` file.
- Read the namespace from the matched file and build the corresponding `use` statement.
- Insert the import directly below the current file’s `namespace` declaration.

## Usage

1. Select a PHP class name in a PHP file (for example `User`).
2. Run the `Import Class` command.
3. The matching `use` statement is added under the `namespace` line in the current file.

## Limitations

- If multiple files define the same class name, the first match found in the workspace is used.
- Alias handling (`use Foo as Bar;`) and advanced conflict resolution are not yet implemented.
