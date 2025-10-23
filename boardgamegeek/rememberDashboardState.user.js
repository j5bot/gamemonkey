// ==UserScript==
// @name         BGG Remember Dashboard State
// @namespace    https://github.com/j5bot/gamemonkey
// @version      0.1
// @description  Remember and restore the status of dropdowns on the dashboard page
// @author       j5bot
// @match        https://boardgamegeek.com/dashboard
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/rememberDashboardState.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/rememberDashboardState.user.js
// ==/UserScript==

(function() {
    'use strict';
    let dashboardDropdownState = {};

    const saveDashboardDropdownState = () => {
        window.localStorage.setItem('dashboardState', JSON.stringify(dashboardDropdownState));
    };

    setTimeout(() => {
        const filterBtns = Array.from(document.querySelectorAll('[id^=filter-button]'));
        const subtypeBtns = Array.from(document.querySelectorAll('[id^=subtype-button]'));
        const hubSelectorBtns = Array.from(document.querySelectorAll('[id^=hub_selector]'));
        const sortBtns = Array.from(document.querySelectorAll('[id^=sort-button]'));

        const setDropdownValue = (btn, value) => {
            const options = Array.from(btn.parentElement.querySelectorAll('ul > li > button'));
            const option = options.find(option => option.innerText.trim() === value);
            option?.click();
        };

        const optionHandler = event => {
            const dropdownBtnId = event.currentTarget
                .parentElement.parentElement.parentElement
                .querySelector('button')?.id;
            dashboardDropdownState[dropdownBtnId] = event.currentTarget.innerText.trim();
            saveDashboardDropdownState();
        };

        const addEventListenersAndDataAttributes = btns => {
            btns.forEach(btn => {
                btn.addEventListener('click', event => {
                    const optionBtns = Array.from(btn.parentElement.querySelectorAll('ul > li > button'));
                    optionBtns.forEach(optionBtn => {
                        optionBtn.onclick = optionHandler;
                    });
                });
            });
        };

        const setInitialValues = () => {
            dashboardDropdownState = JSON.parse(window.localStorage.getItem('dashboardState') ?? '{}');
            Object.entries(dashboardDropdownState).forEach(([id, state]) => {
                setDropdownValue(document.getElementById(id), state);
            });
        };

        [
            filterBtns,
            subtypeBtns,
            hubSelectorBtns,
            sortBtns
        ].forEach(addEventListenersAndDataAttributes);

        setInitialValues();
    }, 2000);
})();