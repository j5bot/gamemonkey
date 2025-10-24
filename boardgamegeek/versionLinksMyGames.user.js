// ==UserScript==
// @name         BGG Version Link in My Games
// @namespace    https://github.com/j5bot/gamemonkey
// @version      0.1
// @description  Add version links to 'My Games' sub-page of game
// @author       You
// @match        https://boardgamegeek.com/*/*/*/mygames/collection
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/versionLinksMyGames.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/versionLinksMyGames.user.js
// ==/UserScript==

(function() {
    'use strict';

    const addVersionLinks = () => {
        const editBtns = Array.from(document.querySelectorAll('button[add-to-collection-button]:not([data-version-link=true]'));

        if (editBtns.length === 0) {
            return;
        }

        editBtns.forEach(btn => {
            btn.setAttribute('data-version-link', 'true');
            const version = angular.element(btn).scope().item?.versionid;

            if (!version) {
                return;
            }

            const title = btn.parentElement.querySelector('.summary-item-title span span');
            const link = document.createElement('a');
            link.href = `/boardgameversion/${version}`;
            link.target = "_blank";
            link.innerText = title.innerText;
            title.replaceWith(link);
        });
    };

    addVersionLinks();
    const mo = new MutationObserver(addVersionLinks);
    mo.observe(document.body, { subtree: true, childList: true });
})();