# Limitations

## CSS image values are required

Zen Mod preferences expose string values as CSS variables. CSS can use a
variable as a complete `background-image` value, but it cannot reliably wrap a
plain string in `url(...)`.

That means icon fields must contain values like:

```text
url("https://example.com/icon.svg")
```

not:

```text
https://example.com/icon.svg
```

The optional right-click UI is different: it accepts plain image URLs and stores
the CSS-ready value for the mod.

## Position-based mapping

The mod has no stable access to workspace names or workspace IDs from CSS, so
icons are mapped with `nth-of-type()` selectors.

Reordering spaces changes which icon applies to which space.

## No native file picker

The mod does not provide a native file picker. Use Data URLs for local files
instead.

## Right-click UI is local-only

Zen Mods cannot add new browser menu actions by themselves. The optional
`Set Icon URL` menu item is installed through a local Autoconfig loader. It
modifies files in the Zen installation directory and can be overwritten by Zen
updates.

## Invalid values can render blank icons

Each space has an enable checkbox. Keep it disabled until the icon value is
valid. If a space is enabled with `none`, an empty value, or malformed CSS,
Zen's original icon is hidden and the replacement may be blank.

## Remote icon privacy

Remote image URLs are loaded by the browser UI. The icon host can see those
requests. Data URLs are safer for private icons.
