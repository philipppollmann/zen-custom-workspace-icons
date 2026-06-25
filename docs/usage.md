# Usage

## Configure an icon

### Zen Mod preferences

1. Open Zen's mod preferences for Custom Space Icons.
2. Paste a CSS image value into the matching Space field.
3. Enable the matching Space checkbox.
4. Repeat for every space that should use a custom icon.

Valid examples:

```text
url("https://example.com/icon.svg")
```

```text
url("data:image/png;base64,iVBORw0KGgo...")
```

Invalid example:

```text
https://example.com/icon.svg
```

### Optional right-click UI

If you installed the optional app UI loader, you can configure icons directly
from the Space menu:

1. Right-click a Space icon.
2. Choose `Set Icon URL`.
3. Paste a plain image URL or `data:image/...` URL.

Valid examples:

```text
https://example.com/icon.svg
```

```text
data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E
```

Leave the prompt empty to clear the icon for that Space.

## Space order

The mod maps icons by visible workspace order:

- Space 1 targets the first workspace button.
- Space 2 targets the second workspace button.
- Space 10 targets the tenth workspace button.

If you reorder spaces in Zen, the custom icons follow the position, not the
workspace name or internal workspace ID.

## Local icons

Use the helper script to convert a local SVG, PNG, WebP, JPG, or GIF into a
CSS-ready Data URL:

```sh
node scripts/file-to-css-url.js ./icon.svg
```

Paste the printed `url("data:...")` value into a Space icon field.
