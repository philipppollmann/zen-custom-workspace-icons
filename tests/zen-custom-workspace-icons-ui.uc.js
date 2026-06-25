// Zen Custom Workspace Icons profile UI.
// Loaded by the optional Autoconfig app UI loader from tests/install-local.sh.
(function () {
  "use strict";

  if (window.__zcwiProfileUILoaded) {
    return;
  }
  window.__zcwiProfileUILoaded = true;

  const ServicesRef =
    globalThis.Services ||
    ChromeUtils.importESModule("resource://gre/modules/Services.sys.mjs").Services;

  const PREF_ROOT = "uc.zen_custom_space_icons.";
  const MAX_SPACES = 10;
  const MENU_ID = "context_zcwiSetWorkspaceIconURL";
  const STYLE_ID = "zcwi-runtime-style";

  function getStringPref(name, fallback = "") {
    try {
      return ServicesRef.prefs.getStringPref(name, fallback);
    } catch (_error) {
      return fallback;
    }
  }

  function getBoolPref(name, fallback = false) {
    try {
      return ServicesRef.prefs.getBoolPref(name, fallback);
    } catch (_error) {
      return fallback;
    }
  }

  function clearUserPref(name) {
    try {
      if (ServicesRef.prefs.prefHasUserValue(name)) {
        ServicesRef.prefs.clearUserPref(name);
      }
    } catch (_error) {
      // Ignore missing or locked prefs.
    }
  }

  function savePrefs() {
    try {
      ServicesRef.prefs.savePrefFile(null);
    } catch (_error) {
      // Firefox/Zen will persist prefs normally if an immediate save is denied.
    }
  }

  function sanitizePx(value, fallback) {
    const number = Number.parseInt(String(value), 10);
    if (!Number.isFinite(number)) {
      return fallback;
    }
    return Math.max(0, Math.min(number, 64));
  }

  function sanitizeFit(value) {
    return value === "cover" ? "cover" : "contain";
  }

  function unquoteCssURL(value) {
    const trimmed = value.trim();
    if (!trimmed.toLowerCase().startsWith("url(") || !trimmed.endsWith(")")) {
      return trimmed;
    }

    let inner = trimmed.slice(4, -1).trim();
    if (
      (inner.startsWith('"') && inner.endsWith('"')) ||
      (inner.startsWith("'") && inner.endsWith("'"))
    ) {
      inner = inner.slice(1, -1);
    }
    return inner.replace(/\\(["'\\])/g, "$1");
  }

  function isSupportedImageURL(value) {
    return /^(?:https?:\/\/|data:image\/|chrome:\/\/|resource:\/\/|moz-extension:\/\/|blob:)/i.test(
      value
    );
  }

  function cssURL(value) {
    const escaped = value
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\r?\n/g, "\\a ");
    return `url("${escaped}")`;
  }

  function iconURLForSpace(index) {
    if (!getBoolPref(`${PREF_ROOT}space_${index}.enabled`, false)) {
      return "";
    }

    const rawURL = getStringPref(`${PREF_ROOT}space_${index}.url`, "");
    if (rawURL) {
      return rawURL;
    }

    const cssValue = getStringPref(`${PREF_ROOT}space_${index}.icon`, "");
    return cssValue && cssValue !== "none" ? unquoteCssURL(cssValue) : "";
  }

  function buildCSS() {
    const iconSize = sanitizePx(getStringPref(`${PREF_ROOT}icon_size`, "18"), 18);
    const iconRadius = sanitizePx(getStringPref(`${PREF_ROOT}icon_radius`, "4"), 4);
    const iconFit = sanitizeFit(getStringPref(`${PREF_ROOT}icon_fit`, "contain"));

    let css = `
:root {
  --zcwi-icon-size: ${iconSize}px;
  --zcwi-icon-radius: ${iconRadius}px;
  --zcwi-icon-fit: ${iconFit};
}

#zen-workspaces-button > toolbarbutton::before,
zen-workspace .zen-current-workspace-indicator-icon::before {
  content: "";
  background-repeat: no-repeat;
  background-position: center;
  background-size: var(--zcwi-icon-fit);
  border-radius: var(--zcwi-icon-radius);
  pointer-events: none;
}

#zen-workspaces-button > toolbarbutton::before {
  display: none;
  width: var(--zcwi-icon-size);
  height: var(--zcwi-icon-size);
  margin: auto;
}

zen-workspace .zen-current-workspace-indicator-icon::before {
  display: none;
  width: 100%;
  height: 100%;
}
`;

    for (let index = 1; index <= MAX_SPACES; index += 1) {
      const iconURL = iconURLForSpace(index);
      if (!iconURL || !isSupportedImageURL(iconURL)) {
        continue;
      }

      const image = cssURL(iconURL);
      css += `
#zen-workspaces-button > toolbarbutton:nth-of-type(${index})::before {
  display: block;
  background-image: ${image};
}

#zen-workspaces-button > toolbarbutton:nth-of-type(${index}) > .zen-workspace-icon {
  opacity: 0;
}

zen-workspace:nth-of-type(${index}) .zen-current-workspace-indicator-icon {
  position: relative;
  width: var(--zcwi-icon-size);
  height: var(--zcwi-icon-size);
}

zen-workspace:nth-of-type(${index}) .zen-current-workspace-indicator-icon > * {
  display: none;
}

zen-workspace:nth-of-type(${index}) .zen-current-workspace-indicator-icon::before {
  display: block;
  background-image: ${image};
}
`;
    }

    return css;
  }

  function refreshStyles() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElementNS("http://www.w3.org/1999/xhtml", "style");
      style.id = STYLE_ID;
      document.documentElement.appendChild(style);
    }
    style.textContent = buildCSS();
  }

  function allWorkspaceButtons() {
    return Array.from(
      document.querySelectorAll(
        "#zen-workspaces-button > toolbarbutton[zen-workspace-id]"
      )
    );
  }

  function triggerWorkspaceButton() {
    const popup = document.getElementById("zenWorkspaceMoreActions");
    const trigger = popup?.triggerNode || document.popupNode;
    const directButton = trigger?.closest?.(
      "#zen-workspaces-button > toolbarbutton[zen-workspace-id]"
    );
    if (directButton) {
      return directButton;
    }

    const activeWorkspace = window.gZenWorkspaces?.activeWorkspace;
    if (!activeWorkspace) {
      return null;
    }
    return allWorkspaceButtons().find(
      (button) => button.getAttribute("zen-workspace-id") === activeWorkspace
    );
  }

  function triggerSpaceIndex() {
    const button = triggerWorkspaceButton();
    const buttons = allWorkspaceButtons();
    const index = button ? buttons.indexOf(button) + 1 : 0;
    return index > 0 ? index : 1;
  }

  function setIconURLFromPrompt() {
    const index = triggerSpaceIndex();
    const currentURL = iconURLForSpace(index);
    const result = { value: currentURL };
    const confirmed = ServicesRef.prompt.prompt(
      window,
      `Set Space ${index} Icon URL`,
      "Enter an image URL or Data URL. Leave empty to clear the custom icon.",
      result,
      null,
      { value: false }
    );
    if (!confirmed) {
      return;
    }

    const iconURL = unquoteCssURL(result.value.trim());
    if (!iconURL) {
      ServicesRef.prefs.setBoolPref(`${PREF_ROOT}space_${index}.enabled`, false);
      ServicesRef.prefs.setStringPref(`${PREF_ROOT}space_${index}.icon`, "none");
      clearUserPref(`${PREF_ROOT}space_${index}.url`);
      savePrefs();
      refreshStyles();
      return;
    }

    if (!isSupportedImageURL(iconURL)) {
      ServicesRef.prompt.alert(
        window,
        "Invalid image URL",
        "Use https://, data:image/, chrome://, resource://, moz-extension://, or blob:."
      );
      return;
    }

    ServicesRef.prefs.setBoolPref(`${PREF_ROOT}space_${index}.enabled`, true);
    ServicesRef.prefs.setStringPref(`${PREF_ROOT}space_${index}.url`, iconURL);
    ServicesRef.prefs.setStringPref(`${PREF_ROOT}space_${index}.icon`, cssURL(iconURL));
    savePrefs();
    refreshStyles();
  }

  function installMenuItem() {
    const popup = document.getElementById("zenWorkspaceMoreActions");
    if (!popup) {
      return false;
    }

    if (document.getElementById("context_zenSetWorkspaceIconURL")) {
      return true;
    }

    let menuItem = document.getElementById(MENU_ID);
    if (!menuItem) {
      menuItem = document.createXULElement("menuitem");
      menuItem.id = MENU_ID;
      menuItem.setAttribute("label", "Set Icon URL");
      menuItem.addEventListener("command", setIconURLFromPrompt);

      const changeIconItem = document.getElementById("context_zenEditWorkspaceIcon");
      if (changeIconItem) {
        changeIconItem.after(menuItem);
      } else {
        popup.prepend(menuItem);
      }
    }

    return true;
  }

  function retryInstallMenuItem(attempt = 0) {
    if (installMenuItem() || attempt > 60) {
      return;
    }
    window.setTimeout(() => retryInstallMenuItem(attempt + 1), 250);
  }

  const prefObserver = {
    observe() {
      refreshStyles();
    },
  };

  ServicesRef.prefs.addObserver(PREF_ROOT, prefObserver);
  window.addEventListener(
    "unload",
    () => {
      ServicesRef.prefs.removeObserver(PREF_ROOT, prefObserver);
    },
    { once: true }
  );

  refreshStyles();
  retryInstallMenuItem();
})();
