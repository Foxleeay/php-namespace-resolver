# PHP Namespace Resolver

> Experimental release. Unexpected bugs may occur while the extension is being tested and refined.

## Features

- Resolve a selected PHP class name by searching the workspace for matching `.php` files.
- Read the namespace from each matched file and build the corresponding `use` statement.
- Prompt a choice palette when a class name is defined in multiple files, so you can pick the right namespace.
- Insert generated imports directly below the current file's `namespace` declaration, or just below the `<?php` tag when no namespace is present.
- Skip imports that are already present in the current file.

## Commands

### Import Class

- Searches the workspace for `.php` files that define the selected class name.
- If a **single** match is found, its `use` statement is inserted automatically.
- If **multiple** matches are found (same class name, different namespaces), a choice palette lets you select which one to import.
- Recommended for everyday use.

### Import All Classes

- Recursively scans the entire workspace for **all** `.php` files that define the selected class name.
- Builds and inserts a `use` statement for **each** match found, skipping imports that already exist.
- Useful in projects with modular structure or multiple implementations of the same class name.

## Usage

1. Select a PHP class name in a PHP file (for example `User`).
2. Run either:
   - `Import Class` to import a matching class (choosing from a palette if several are found), or
   - `Import All Classes` to import all matching classes in the workspace.
3. The generated `use` statements are added under the `namespace` line in the current file. If the file has no namespace, they are placed just below the `<?php` tag with a blank separating line.

## Limitations

- `Import All Classes` may lead to conflicting imports if multiple files define homonymous classes.
- Alias handling (`use Foo as Bar;`) and advanced conflict resolution are not yet implemented.
- The resolver relies on standard `namespace` declarations and may fail on unconventional file layouts.