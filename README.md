# Zen Custom Workspace Icons

Zen Custom Workspace Icons replaces Zen Browser's visible Space/Workspace icons
with custom image URLs or embedded Data URLs.

This repository contains two things:

- a CSS-first Zen Mod (`chrome.css`, `preferences.json`, `theme.json`)
- optional local tooling for testing and for a right-click `Set Icon URL` UI

The normal Zen Mod is the portable, registry-friendly version. The optional UI
loader is for local installs only because Zen Mods cannot add browser menu items
by themselves.

## Features

- Custom icons for Space 1 through Space 10.
- Per-space enable switches.
- Remote image URLs and local Data URLs.
- Configurable icon size, radius, and object fit.
- Covers the compact Space switcher and current-workspace header icon.
- Optional local right-click action: `Set Icon URL`.

## Quick Install

Clone the repo:

```sh
git clone https://github.com/philipppollmann/zen-custom-workspace-icons.git
cd zen-custom-workspace-icons
```

Install the CSS mod into your active Zen profile:

```sh
./tests/install-local.sh
```

If auto-detection fails, open `about:support` in Zen, copy the `Profile Folder`,
and pass it explicitly.

macOS example:

```sh
./tests/install-local.sh --profile "$HOME/Library/Application Support/zen/Profiles/<profile>"
```

Windows example from Git Bash:

```sh
./tests/install-local.sh --profile "/c/Users/<you>/AppData/Roaming/zen/Profiles/<profile>"
```

Fully quit and restart Zen after installing.

See [docs/install.md](docs/install.md) for full macOS and Windows instructions,
including uninstall and troubleshooting.

## Optional Right-Click UI

The local UI loader adds `Set Icon URL` to the Space right-click menu. It uses
Firefox/Zen Autoconfig, so it modifies files inside the local Zen installation.
Zen updates can overwrite it.

macOS:

```sh
./tests/install-local.sh --install-app-ui "/Applications/Zen.app"
```

Windows from Git Bash, usually as Administrator if Zen is in `Program Files`:

```sh
./tests/install-local.sh --install-app-ui "/c/Program Files/Zen Browser"
```

Add `--profile "<Profile Folder>"` if profile auto-detection fails. On Windows,
pass the directory that contains `application.ini` or pass the `zen.exe` path.

Then fully quit and restart Zen. Right-click a Space and choose `Set Icon URL`.
Paste a plain image URL, for example:

```text
https://example.com/icon.svg
```

Leave the prompt empty to clear that Space icon.

## Preference Value Format

When configuring the CSS mod through Zen Mod preferences or environment
variables, icon values must be complete CSS image values:

```text
url("https://example.com/icon.svg")
```

or:

```text
url("data:image/svg+xml,%3Csvg ... %3E")
```

Plain URLs are only accepted by the optional `Set Icon URL` UI.

For local files, convert an icon to a CSS-ready Data URL:

```sh
node scripts/file-to-css-url.js ./icon.svg
```

## Uninstall

Remove the profile CSS install:

```sh
./tests/install-local.sh --uninstall
```

Remove the optional app UI loader:

```sh
./tests/install-local.sh --uninstall-app-ui "/Applications/Zen.app"
```

Windows example:

```sh
./tests/install-local.sh --uninstall-app-ui "/c/Program Files/Zen Browser"
```

Restart Zen after uninstalling.

## Project Layout

```text
.
├── chrome.css
├── preferences.json
├── theme.json
├── docs/
│   ├── icon-data-url-guide.md
│   ├── install.md
│   ├── limitations.md
│   └── usage.md
├── examples/
│   ├── data-url-examples.md
│   └── sample-icons.md
├── patches/
│   └── zen-desktop-workspace-icon-url.patch
├── scripts/
│   └── file-to-css-url.js
└── tests/
    ├── install-local.sh
    └── zen-custom-workspace-icons-ui.uc.js
```

## Notes

- Space mapping is positional. `Space 1` means the first visible Space button.
- Reordering Spaces changes which icon applies to which Space.
- Data URLs are best for private or local icons.
- Remote icon hosts can see requests when Zen loads their images.
- The optional app UI loader is a local customization, not a standard Zen Mod
  feature.

## Contributing

The native Zen source patch in `patches/zen-desktop-workspace-icon-url.patch`
shows what a first-class implementation in Zen itself could look like. It is
intended for development or upstream PR work, not for normal users.
