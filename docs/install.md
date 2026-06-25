# Installation

This guide covers local installation for macOS and Windows.

Use the normal profile CSS install if you only need custom icons. Use the
optional app UI loader if you also want a right-click `Set Icon URL` menu item.

## Requirements

- Zen Browser installed.
- Git.
- Bash:
  - macOS: Terminal works.
  - Windows: use Git Bash.
- Optional for Data URLs: Node.js, for `scripts/file-to-css-url.js`.

## Find Your Zen Profile

The install script tries to detect the profile automatically. If that fails:

1. Open Zen.
2. Navigate to `about:support`.
3. Find `Profile Folder`.
4. Copy that path and pass it with `--profile`.

Typical profile roots:

```text
macOS:
~/Library/Application Support/zen/Profiles/<profile>

Windows:
C:\Users\<you>\AppData\Roaming\zen\Profiles\<profile>
```

In Git Bash, Windows paths usually look like this:

```text
/c/Users/<you>/AppData/Roaming/zen/Profiles/<profile>
```

## Clone

```sh
git clone https://github.com/philipppollmann/zen-custom-workspace-icons.git
cd zen-custom-workspace-icons
```

## Install The CSS Mod

Try auto-detection first:

```sh
./tests/install-local.sh
```

macOS with explicit profile:

```sh
./tests/install-local.sh --profile "$HOME/Library/Application Support/zen/Profiles/<profile>"
```

Windows with explicit profile from Git Bash:

```sh
./tests/install-local.sh --profile "/c/Users/<you>/AppData/Roaming/zen/Profiles/<profile>"
```

Restart Zen after installing.

## Install With Icons From The Shell

Icon values must be complete CSS image values in this mode.

macOS:

```sh
SPACE_1_ICON='url("https://example.com/work.svg")' \
SPACE_2_ICON='url("https://example.com/personal.svg")' \
./tests/install-local.sh --profile "$HOME/Library/Application Support/zen/Profiles/<profile>"
```

Windows from Git Bash:

```sh
SPACE_1_ICON='url("https://example.com/work.svg")' \
SPACE_2_ICON='url("https://example.com/personal.svg")' \
./tests/install-local.sh --profile "/c/Users/<you>/AppData/Roaming/zen/Profiles/<profile>"
```

Restart Zen after changing icon values.

## Optional Right-Click UI

The standard Zen Mod format cannot add a new right-click menu item. The optional
UI loader uses Zen/Firefox Autoconfig to load a small profile script that adds
`Set Icon URL`.

This modifies the Zen installation directory:

- macOS: files inside `/Applications/Zen.app`.
- Windows: files inside the folder that contains `application.ini`.

Zen updates may remove these files. Re-run the command after updating Zen if the
menu item disappears.

### macOS

```sh
./tests/install-local.sh --install-app-ui "/Applications/Zen.app" \
  --profile "$HOME/Library/Application Support/zen/Profiles/<profile>"
```

Fully quit Zen with `Cmd+Q`, then reopen it.

### Windows

Open Git Bash as Administrator if Zen is installed in `Program Files`.

Pass the directory that contains `application.ini`:

```sh
./tests/install-local.sh --install-app-ui "/c/Program Files/Zen Browser" \
  --profile "/c/Users/<you>/AppData/Roaming/zen/Profiles/<profile>"
```

You can also pass the `zen.exe` path if that is easier:

```sh
./tests/install-local.sh --install-app-ui "/c/Program Files/Zen Browser/zen.exe" \
  --profile "/c/Users/<you>/AppData/Roaming/zen/Profiles/<profile>"
```

Fully quit and restart Zen.

## Use The Right-Click UI

1. Right-click a Space icon.
2. Choose `Set Icon URL`.
3. Paste a plain image URL:

```text
https://example.com/icon.svg
```

Supported URL schemes:

```text
https://
http://
data:image/
chrome://
resource://
moz-extension://
blob:
```

Leave the prompt empty to clear the icon for that Space.

## Convert Local Icons To Data URLs

```sh
node scripts/file-to-css-url.js ./icon.svg
```

The script prints a CSS-ready value:

```text
url("data:image/svg+xml;base64,...")
```

Use the full output in Zen Mod preferences or in `SPACE_1_ICON`.

For the optional right-click UI, paste a plain remote URL or `data:image/...`
URL. The UI also accepts the `url("data:...")` output and unwraps it.

## Uninstall

Remove the CSS profile install:

```sh
./tests/install-local.sh --uninstall --profile "<profile path>"
```

Remove the app UI loader on macOS:

```sh
./tests/install-local.sh --uninstall-app-ui "/Applications/Zen.app" \
  --profile "$HOME/Library/Application Support/zen/Profiles/<profile>"
```

Remove the app UI loader on Windows:

```sh
./tests/install-local.sh --uninstall-app-ui "/c/Program Files/Zen Browser" \
  --profile "/c/Users/<you>/AppData/Roaming/zen/Profiles/<profile>"
```

Restart Zen after uninstalling.

## Troubleshooting

If auto-detection fails, use the exact `Profile Folder` from `about:support`.

If the right-click menu item does not appear:

- Fully quit Zen and reopen it.
- Check that `--install-app-ui` was run against the real Zen installation.
- Re-run `--install-app-ui` after Zen updates.
- On Windows, run Git Bash as Administrator when Zen is installed in
  `Program Files`.

If an icon renders blank:

- For profile CSS values, make sure the value is `url("...")`.
- For the right-click UI, paste a plain image URL or `data:image/...` URL.
- Check that the remote icon URL is reachable.
