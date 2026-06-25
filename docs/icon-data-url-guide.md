# Icon Data URL Guide

Data URLs embed the icon directly in the preference value. They are useful for
local icons because Zen does not need to request a remote image host.

## Convert a file

Run:

```sh
node scripts/file-to-css-url.js ./icon.svg
```

The script prints a complete CSS image value:

```text
url("data:image/svg+xml;base64,...")
```

Paste that value into the matching Space icon field and enable the checkbox for
that space. If you use the optional right-click UI, you can paste the same
output there; the UI unwraps `url("...")` automatically.

## Recommended formats

- SVG for simple vector icons.
- PNG or WebP for raster icons.
- Square images, ideally 64x64 or larger.

## Keep values manageable

Large PNGs create very long preference values. If an icon is bigger than a few
kilobytes, resize or optimize it before converting.
