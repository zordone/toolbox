## Implementation notes

### Changing the port

It's easiest to search for the current port and replace it everywhere.

- package.json scripts
- electron.js PORT constant

### Changing the icon

- Replace `_work/icon.png` then `npm run generate-app-icon`

## To do

- playground: add docs links
- playground: re-run button
- playground: initial cursor position
- generic component for keymap help in tools
- move more colors to root
- fuzzy tool search
- saved settings infrastructure
- moment playground: load locales from UI?
- undo support in text fields

## More tools

- unindent
- prettier for different formats (with auto-recognition?)
- simple world clock, configurable countries
  (maybe use Temporal? https://blogs.igalia.com/compilers/2020/06/23/dates-and-times-in-javascript/)
- test data generator (ex: json-schema-faker)
- xor crypt code generator (to put slightly sensitive strings into code)
- diff
- color utility: hex code, rgb, hsl, lighten, darken, etc.
- dec / hex converter
- expression calculator
- plain javascript playground

## Maybe

- regex match/search/replace helper
- embedded cheat sheets: flex, grid, regex, etc

# Bugs
