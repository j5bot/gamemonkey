// ==UserScript==
// @name         BGG Profile Dropdown Collection Links without Expansions
// @namespace    https://github.com/j5bot/gamemonkey
// @version      0.1
// @description  Add links for collection items without expansions to menu
// @author       j5bot
// @match        https://boardgamegeek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/profileDropdownLinksWithoutExpansions.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/profileDropdownLinksWithoutExpansions.user.js
// ==/UserScript==

(function() {
    'use strict';

    const selector = `.avatar-dropdown__link-grid ul li a[href^='/collection/user/']:not([data-collection-link]),
    .avatar-dropdown__link-grid ul li a[href^='/wishlist/']:not([data-collection-link]),
    gg-my-geek a[href^='/collection/user/']:not([data-collection-link]),
    gg-my-geek a[href^='/wishlist/']:not([data-collection-link])`;

    setTimeout(() => {
        const collectionLinks = Array.from(document.querySelectorAll(selector));
        collectionLinks.forEach(link => {
            link.setAttribute('data-collection-link', 'true');
            link.href += '?excludesubtype=boardgameexpansion';
        });
    }, 1000);
})();