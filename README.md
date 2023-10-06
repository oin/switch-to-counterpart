# switch-to-counterpart

Quickly switch between files with the same name but different extensions.
For instance, if you invoke the command on `example.c`, it will open `example.h` if it exists.
Trying to open a counterpart that does not exist more than two times in a row will create it.

## Features

This extension adds a command called `switch-to-counterpart.switch` that can be invoked from the command palette or with a keybinding.

When invoked, the command will list all the files with the same name as the current file but different extensions in the current folder.
For instance, if you invoke the command on `example.html.erb`, it will open `example.json` if it exists.

If no counterpart exists and it knows how it should be named (see Settings), it will offer you to create it: press `Enter` to accept or `Esc` to cancel.

## Extension Settings

This extension contributes a single setting, `switch-to-counterpart.creationRules`, which specifies rules for creating counterparts.

It is an array of objects with the following properties:

* `from`: the extension of the file you are switching from
* `to`: the extension of the file you are switching to
* _(optional)_ `languageId`: the ID of the language that must be currently active for the rule to apply

By default, it uses the following rules:

```json
[
	{ "from": ".h", "to": ".c" },
	{ "from": ".h", "to": ".m", "languageId": "objective-c" },
	{ "from": ".h", "to": ".mm", "languageId": "objective-cpp" },
	{ "from": ".hpp", "to": ".cpp" }
]
```

## Known Issues

None currently.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Initial release.
