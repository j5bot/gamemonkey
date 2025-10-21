// ==UserScript==
// @name         BGG Default Wishlist Sort Ascending
// @namespace    http://github.com/j5bot/gamemonkey
// @version      0.1
// @author       j5bot
// @description  Sort links from profile page to wishlists ascending by priority by default
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @match        https://boardgamegeek.com/profile/*
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/sortWishlistLinks.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/sortWishlistLinks.user.js
// ==/UserScript==

(function() {
    'use strict';

    const collectionLinkSelector = `a[href*='/collection/user/'][href*='wishlist=1']:not([data-wishlist-link='true'])`;

    function updateLinks() {
        const links = document.querySelectorAll(collectionLinkSelector);
        links.forEach((link, index, array) => {
            link.href += `&sort=wishlist&sortdir=asc`;
            link.setAttribute("data-wishlist-link", 'true');
        });
    }

    updateLinks();
    const mo = new MutationObserver(updateLinks);
    mo.observe(document.body, { subtree: true, childList: true });

})();
