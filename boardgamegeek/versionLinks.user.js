// ==UserScript==
// @name         BGG Version Links in Collection
// @namespace    http://github.com/j5bot/gamemonkey
// @version      0.1
// @description  Open version page in new tab/window on click from collection
// @author       j5bot
// @match        https://boardgamegeek.com/collection/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/versionLinks.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/versionLinks.user.js
// ==/UserScript==

(async function() {
    'use strict';
    const sleep = async ms => {
        await new Promise(resolve => {
            setTimeout(() => resolve(), ms);
        });
    };

    const parser = new DOMParser();

    const getVersion = async cell => {
        const params = new URLSearchParams('fieldname=version&objecttype=thing&simple=1&linktype=boardgameversion&ajax=1&action=editdata');
        const dataSegments = cell.getAttribute('onclick').split(`'`);
        const collId = dataSegments[3];
        const objectId = dataSegments[9];

        params.append('collid', collId);
        params.append('objectid', objectId);

        const html = await fetch(`/geekcollection.php?${params.toString()}`).then(response => response.text());
        const doc = parser.parseFromString(html, 'text/html');
        const version = doc.querySelector('input[type=radio]:checked')?.value;
        return version;
    };

    const handleVersionClick = async event => {
        const cell = event.currentTarget;
        const version = await getVersion(cell);
        if (!version) {
            return;
        }
        window.open(`https://boardgamegeek.com/boardgameversion/${version}`, '_blank');
    };

    const addVersionLinks = () => {
        const versionCells = Array.from(document.querySelectorAll('[id^=CEcell_version]:not([data-version-link=true])'));

        if (versionCells.length === 0) {
            return;
        }

        versionCells.forEach(cell => {
            cell.setAttribute('data-version-link', 'true');
            cell.onclick = undefined;
            cell.addEventListener('click', handleVersionClick);
            cell.style.textDecoration = 'underline';
        });
    };

    addVersionLinks();
    const mo = new MutationObserver(addVersionLinks);
    mo.observe(document.body, { subtree: true, childList: true });
})();