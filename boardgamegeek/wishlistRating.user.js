// ==UserScript==
// @name         BGG Wishlist Emoji in Rating Column
// @namespace    http://github.com/j5bot/gamemonkey
// @version      0.1
// @author       j5bot
// @description  Add an emoji representing the wishlist priority to the rating column
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @match        https://boardgamegeek.com/collection/*
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/wishlistRating.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/wishlistRating.user.js
// ==/UserScript==

(function() {
    'use strict';

    const wishlistSelector = `.wishlist:not([data-wishlist-emoji='true'])`;
    const priorityEmoji = ['🟢','❤️','🩷','🧠','🚫'];

    function updateRatings() {
        const wishlisted = Array.from(document.querySelectorAll(wishlistSelector))

        wishlisted.forEach((wish, index) => {
            const priority = parseInt(wish.innerText.split(/[()]/)[1], 10);
            const emoji = priorityEmoji[priority - 1];
            const rating = wish.parentElement.parentElement.parentElement.querySelector('.rating');
            const node = (rating.firstElementChild ?? rating);
            if (node.innerText === 'N/A') {
                node.innerText = emoji;
                node.style.fontSize = '26px';
            } else {
                node.innerHTML = `${emoji} ${node.innerHTML}`;
                node.style.fontSize = '20px';
            }
            wish.setAttribute('data-wishlist-emoji', 'true');
        });
    }

    updateRatings();
    const mo = new MutationObserver(updateRatings);
    mo.observe(document.body, { subtree: true, childList: true });
})();
