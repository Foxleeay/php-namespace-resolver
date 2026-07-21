## Version 1.2

- `Import Class` now prompts a choice palette when the selected class name matches **multiple** files with different namespaces, letting you pick which one to import.
- When only **one** match is found, `Import Class` imports it directly without prompting.
- Import statements are now inserted right after the current file's `namespace` declaration; if no namespace is present, they are inserted just below the `<?php` tag with a blank separating line.
- Added cancellation feedback ("Import cancelled") when the choice palette is dismissed.

## Version 1.1

- Added `Import All Classes` command that scans the entire workspace and imports all matching classes for the selected name.
- Kept `Import Class` command behavior limited to the first matching class.
- Improved documentation in README to describe both commands and current limitations.

## Version 1.0

Initial release
