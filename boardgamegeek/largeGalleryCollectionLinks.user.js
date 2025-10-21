// ==UserScript==
// @name         BGG Default Collection Link to Large Gallery
// @namespace    http://github.com/j5bot/gamemonkey
// @version      0.1
// @author       j5bot
// @description  Link to large gallery collections from user's profile page
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @match        https://boardgamegeek.com/profile/*
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/largeGalleryCollectionLinks.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/largeGalleryCollectionLinks.user.js
// ==/UserScript==

(function() {
    'use strict';
    const size = "large";

    const collectionLinkSelector = `a[href*='/collection/user/']:not([data-gallery-link='${size}'])`;

    function updateLinks() {
        const links = document.querySelectorAll(collectionLinkSelector);
        links.forEach((link, index, array) => {
            link.href += `&gallery=${size}`;
            link.setAttribute("data-gallery-link", size);
        });
    }

    updateLinks();
    const mo = new MutationObserver(updateLinks);
    mo.observe(document.body, { subtree: true, childList: true });

})();
