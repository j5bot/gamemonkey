// ==UserScript==
// @name         BGG Collection URL Updater
// @namespace    http://github.com/j5bot/gamemonkey
// @version      1.0
// @description  Update URL when permalink changes
// @author       TheCookieCats
// @match        https://boardgamegeek.com/collection/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @run-at       document-end
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/collectionUrlUpdater.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/collectionUrlUpdater.user.js
// ==/UserScript==

window.CE_GetCollection = function CE_GetCollection(){
    const querystring = $('collectionfilterform')
        .toQueryString()
        .replace(/username=.*?&userid=[\d]+/ig, '');
    window.location.href = `${window.location.pathname}?${querystring}`;
};
