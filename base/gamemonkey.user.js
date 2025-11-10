// ==UserScript==
// @name         BGG GameMonkey Base Script
// @namespace    https://github.com/j5bot/gamemonkey
// @version      0.2
// @description  Combine all Mutation Observers into one for efficiency, etc.
// @author       j5bot
// @match        https://boardgamegeek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/base/gamemonkey.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/base/gamemonkey.user.js
// ==/UserScript==

(function() {
    'use strict';

    const storedSettings = unsafeWindow.localStorage.getItem('gamemonkey-settings');
    let settings = (storedSettings && JSON.parse(storedSettings)) || {};

    if (!settings.bggXMLApiKey) {
        const key = unsafeWindow.prompt('Please enter a BGG XML API key to use GameMonkey scripts');
        if (!key) {
            return;
        }
        settings.bggXMLApiKey = key;
        unsafeWindow.localStorage.setItem('gamemonkey-settings', JSON.stringify(settings));
    }
    unsafeWindow.bggXMLApiKey = settings.bggXMLApiKey;

    unsafeWindow.gamemonkey = {
        settings,
        scriptObservers: [],
        observeFn: function () {
            this.scriptObservers.forEach(so => {
                if (so.selector) {
                    const elements = Array.from(document.querySelectorAll(so.selector));
                    if (!elements) {
                        return;
                    }
                    so.fn(elements);
                }
            });
        },
        setSettings: newSettings => {
            unsafeWindow.localStorage.setItem('gamemonkey-settings', JSON.stringify(newSettings));
            settings = newSettings;
            unsafeWindow.gamemonkey.settings = newSettings;
        },
    };

    unsafeWindow.gamemonkey.observeFn();
    const mo = new MutationObserver(unsafeWindow.gamemonkey.observeFn.bind(unsafeWindow.gamemonkey));
    setTimeout(() => mo.observe(document, { subtree: true, childList: true }), 200);
})();