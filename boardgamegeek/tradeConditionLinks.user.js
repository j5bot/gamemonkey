// ==UserScript==
// @name         BGG Add Trade Condition to For Trade Views
// @namespace    https://github.com/j5bot/gamemonkey
// @version      0.1
// @description  Add trade condition column to 'For Trade' links
// @author       j5bot
// @match        https://boardgamegeek.com/profile/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/tradeConditionLinks.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/tradeConditionLinks.user.js
// ==/UserScript==

(function() {
    'use strict';

    const selector = `gg-profile-games a[href^='/collection/user/'][href*='&trade=1']:not([data-trade-columns=true])`;

    const updateForTradeLinks = () => {
        const collectionLinks = Array.from(
            document.querySelectorAll(selector)
        );
        collectionLinks.forEach(link => {
            link.setAttribute('data-trade-columns', 'true');
            link.href += `&${encodeURIComponent('columns=title,status,version,rating,bggrating,plays,comment,conditiontext,commands')}`;
        });
    };

    updateForTradeLinks();
    const mo = new MutationObserver(updateForTradeLinks);
    mo.observe(document.body, { subtree: true, childList: true });
})();
