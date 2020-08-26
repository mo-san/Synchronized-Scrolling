# Synchronized Scrolling


## Features

You can scroll two (and more, of course) editor panels synchronously no matter how splitting including vertically or horizontally split:

![readme_image](https://user-images.githubusercontent.com/8792364/84137362-8eb8bd00-aa87-11ea-9556-a86f0990ef1f.gif)

## Installation

Visit and download from [VS Code Marketplace page](https://marketplace.visualstudio.com/items?itemName=masakit.synchronized-scrolling), or search for `synchronized-scrolling` from the command palatte (Ctrl+Alt+P) inside the Code app.


## Commands

| Command | Command Name | Keybinding |
|---|---|---|
| `synchronizedScrolling.toggleSynchronizedScrolling` | Toggle Synchronized Scrolling | (Not set) |


## Settings

| Name | Description |
|---|---|
| `Automatically Enabled` | When set `true`, synchronized scroll will be activated when two or more files are opened horizontally or vertically (Defaults to `true`). |
| `By Line` | If unchecked, editors are aligned to the ratio to whole content. If checked (default), they are aligned line by line.


## Known Issues

On such a situation like that one is word-wrapped and another is not, the not wrapped one may scroll horizontally if the visible lines in it are long. This is because the extensions cannot tell whether the editor is word-wrapped or not.

## Licence

MIT Licence

## Contribution
[Github Repository](https://github.com/mo-san/Synchronized-Scrolling)

## Release Notes

- 0.1.0 / 2020-06-09<br>Initial release
- 0.2.0 / 2020-06-29<br>Fixed scrolling also the Output window
- 0.3.0 / 2020-08-26<br>Fixed scrolling when in git comparison

## Credits

The icon is made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
