// ==UserScript==
// @name         BGG Select All Add-ons Button (Sleeve It)
// @namespace    https://github.com/j5bot/gamemonkey
// @version      0.1
// @description  When using the "Sleeve It" button/tab, add a button which selects all Add-ons
// @author       j5bot
// @match        https://boardgamegeek.com/boardgame/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/selectAllAddOns.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/selectAllAddOns.user.js
// ==/UserScript==

(function() {
    'use strict';

    const addSelectAllAddOns = () => {
        const fieldSet = document.querySelector('.modal-content fieldset[ng-if="selectorctrl.cardSets.expansions.length || selectorctrl.cardSets.addons.length"]');
        const legend = fieldSet.querySelector('legend');
        const hasSelectAllButton = !!legend.querySelector('.btn.btn-secondary');
        if (!fieldSet || hasSelectAllButton) {
            return;
        }
        const updateBtn = document.querySelector('.modal-footer .btn.btn-primary');
        const selectAllBtn = updateBtn.cloneNode(true);
        selectAllBtn.className = 'btn btn-secondary';
        selectAllBtn.innerText = 'Select All Add-ons';
        selectAllBtn.addEventListener('click', () => {
            selectAllAddOns(fieldSet);
        });
        legend.appendChild(selectAllBtn);
    };

    const selectAllAddOns = fieldSet => {
        const addOns = Array.from(fieldSet.querySelectorAll('input[type=checkbox]'));
        addOns.forEach(checkbox => checkbox.click());
    };

    const mo = new MutationObserver(addSelectAllAddOns);
    mo.observe(document.body, { subtree: true, childList: true });
})();
