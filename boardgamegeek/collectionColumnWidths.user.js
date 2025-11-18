// ==UserScript==
// @name         BGG Resize Collection Column Widths
// @namespace    https://github.com/j5bot/gamemonkey
// @version      0.1
// @description  Allow resize of collection column widths.  Remembers last widths.
// @author       j5bot
// @match        https://boardgamegeek.com/collection/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/collectionColumnWidths.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/collectionColumnWidths.user.js
// ==/UserScript==

(function() {
    'use strict';

    const selector = '.collection_table tr th:not([data-head-resize="true"]';

    const setHeadersResizable = rawHeadCells => {
        let dragging = false;
        let startX;
        let startWidth;

        const headCells = rawHeadCells ?? Array.from(document.querySelectorAll(selector));

        headCells.forEach(cell => {
            const column = cell.className;
            const prevWidth = window.gamemonkey.settings.columnWidths?.[column];
            if (prevWidth) {
                cell.style.width = cell.style.maxWidth = cell.style.minWidth = prevWidth;
            }

            const resizer = document.createElement('div');
            Object.assign(resizer.style, {
                position: 'absolute',
                right: 0,
                top: 0,
                border: 'solid 0 #999',
                backgroundColor: '#ccc',
                borderWidth: '0 1px 0 0',
                cursor: 'hand'
            });
            resizer.innerHTML = '&nbsp;';
            resizer.setAttribute('draggable', 'true');

            resizer.addEventListener('dragstart', event => {
                dragging = true;
                startX = event.pageX;
                startWidth = cell.clientWidth;
            });

            resizer.addEventListener('drag', event => {
                if (!dragging) {
                    return;
                }
                cell.style.width = cell.style.maxWidth = cell.style.minWidth = `${startWidth + (event.pageX - startX)}px`;
            });

            resizer.addEventListener('dragend', () => {
                dragging = false;
                window.gamemonkey.setSettings(
                    Object.assign(
                        window.gamemonkey.settings,
                        {
                            columnWidths: {
                                ...window.gamemonkey.settings.columnWidths ?? {},
                                [column]: cell.style.width,
                            }
                        },
                    )
                );
            });

            cell.style.position = 'relative';
            cell.appendChild(resizer);
            cell.setAttribute('data-head-resize', 'true');
        });
    };

    if (window.gamemonkey) {
        console.log('Resize Collection Headers init via gamemonkey base script...');
        window.gamemonkey.scriptObservers.push({
            selector,
            fn: setHeadersResizable
        });
    } else {
        console.log('Resize Collection Headers not initialized');
    }})();