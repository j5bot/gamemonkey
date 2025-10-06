// ==UserScript==
// @name         BGG Wishlist Do Not Buy Filter
// @namespace    http://github.com/j5bot/gamemonkey
// @version      0.1
// @description  Script to filter out 'Do Not Buy' wishlist items
// @author       j5bot
// @match        https://boardgamegeek.com/collection/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/filterDoNotBuy.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/filterDoNotBuy.user.js
// ==/UserScript==

(function() {
    'use strict';

    const filterLevel = '5';
    let running = false;

    const hideWishlistItems = () => {
        if (running) {
            return;
        }
        running = true;
        const wishlistItems = Array.from(
                document.querySelectorAll('.wishlist:not([data-filtered])')
            )
            .filter(element => element.innerText.includes(`Wishlist(${filterLevel})`));
        wishlistItems.forEach(element => {
            element.setAttribute('data-filtered', 'true');
            const row = element.parentElement.parentElement.parentElement;
            row.style.opacity = '0.4';
            const table = row.parentElement;
            table.appendChild(row);
        });
        running = false;
    };

    const mo = new MutationObserver(hideWishlistItems);
    mo.observe(document.body, { subtree: true, childList: true });
})();
