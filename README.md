# PHP Namespace Resolver

> Experimental release. Unexpected bugs may occur while the extension is being tested and refined.

## Features

- Resolve a selected PHP class name by searching the workspace for matching `.php` files.
- Read the namespace from each matched file and build the corresponding `use` statement.
- Insert generated imports directly below the current file’s `namespace` declaration.
- Skip imports that are already present in the current file.

## Commands

### Import Class

- Searches the workspace for the **first** `.php` file that defines the selected class name.
- Reads its namespace and inserts a single `use` statement under the current file’s `namespace` line.
- Recommended when you expect a unique class definition.

### Import All Classes

- Recursively scans the entire workspace for **all** `.php` files that define the selected class name.
- Builds and inserts a `use` statement for **each** match found, skipping imports that already exist.
- Useful in projects with modular structure or multiple implementations of the same class name.

## Usage

1. Select a PHP class name in a PHP file (for example `User`).
2. Run either:
   - `Import Class` to import the first matching class, or
   - `Import All Classes` to import all matching classes in the workspace.
3. The generated `use` statements are added under the `namespace` line in the current file.

## Limitations

- `Import All Classes` may lead to conflicting imports if multiple files define homonymous classes.
- Alias handling (`use Foo as Bar;`) and advanced conflict resolution are not yet implemented.
- The resolver relies on standard `namespace` declarations and may fail on unconventional file layouts.