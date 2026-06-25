# Sample Icon Values

Paste one of these into a Space icon field and enable that Space.

## Remote SVG

```text
url("https://example.com/icon.svg")
```

## Remote PNG

```text
url("https://example.com/icon.png")
```

## Local file converted with the helper

```sh
node scripts/file-to-css-url.js ./my-space-icon.svg
```

The command prints a value that starts like this:

```text
url("data:image/svg+xml;base64,...
```
