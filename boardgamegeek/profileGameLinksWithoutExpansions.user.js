// ==UserScript==
// @name         BGG Profile Games Links without Expansions
// @namespace    https://github.com/j5bot/gamemonkey
// @version      0.1
// @description  Add links for collection items without expansions to profile 'Games' tab
// @author       j5bot
// @match        https://boardgamegeek.com/profile/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/profileGameLinksWithoutExpansions.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/profileGameLinksWithoutExpansions.user.js
// ==/UserScript==

(function() {
    'use strict';

    const bgSelector = `gg-profile-games a[href^='/collection/user/'][href*='subtype=boardgame&']`;
    const selectors = [
        'own',
        'prevowned',
        'trade',
        'want',
        'wanttobuy',
        'wanttoplay',
        'preordered',
        'wishlist',
        'comment',
        'hasparts',
        'wantparts'
    ].map(status =>
        `${bgSelector}[href*='&${status}=1']`
    );



    setTimeout(() => {
        selectors.forEach(selector => {
            const collectionLinks = Array.from(
                document.querySelectorAll(selector)
            );
            collectionLinks.forEach(link => {
                const parent = link.parentElement;
                const clone = link.cloneNode(true);
                link.href += '&excludesubtype=boardgameexpansion';
                clone.innerText = ' (w/exp)';
                clone.style.fontSize = '8px';
                parent.appendChild(clone);
            });
        });
    }, 1000);
})();