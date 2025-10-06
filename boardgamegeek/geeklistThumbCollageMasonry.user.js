// ==UserScript==
// @name         BGG Geeklist Thumb Collage (MiniMasonry)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to collect images from geeklist item entries to put them into grids for making screenshots
// @author       j5bot
// @match        https://boardgamegeek.com/geeklist/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/minimasonry@1.3.2/build/minimasonry.min.js
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/geeklistThumbCollageMasonry.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/geeklistThumbCollageMasonry.user.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `
#gatherbox { background-color: white; padding: 5px; }
#gatherbox button { border: solid 1px #333; margin: 5px; padding: 3px; }
.masonry-container { position: relative; background-color: white; }
.masonry-item { position: absolute; }
    `;

    let imgCount = 0;
    let masonry;
    let masonryWidth = undefined;

    function copyImages() {
        const imgs = page.getElementsByClassName('geeklist-item__img');
        Array.from(imgs).forEach(img => {
            img.className = 'masonry-item';
            contain.appendChild(img);
            img.width = `${img.naturalWidth}px`;
            img.height = `${img.naturalHeight}px`;
        });

        if (!masonry) {
            setTimeout(() => {
                const mw = parseInt(masonryWidth, 10);
                masonry = new MiniMasonry({
                    container: contain,
                    baseWidth: isNaN(mw) ? undefined : mw,
                });
            }, 1000);
        } else {
            setTimeout(() => masonry.layout(), 1000);
        }
    };

    const contain = document.createElement('div');
    contain.className = 'masonry-container';

    const page = document.body.firstElementChild;

    const container = document.createElement('div');
    container.style.backgroundColor = 'white';
    container.style.padding = '0 0 10px 0';

    const box = document.createElement('div');
    box.style.paddingBottom = '10px';
    box.id = 'gatherbox';
    const giBox = document.createElement('div');

    const gatherImages = document.createElement('button');
    gatherImages.innerText = 'GATHER (MASONRY)';
    gatherImages.onclick = copyImages;
    giBox.appendChild(gatherImages);

    const masonryWidthInput = document.createElement('input');
    masonryWidthInput.type = 'text';
    masonryWidthInput.placeholder = 'Item Width';
    masonryWidthInput.style.border = 'solid 1px blue';
    masonryWidthInput.style.padding = '3px';
    masonryWidthInput.onblur = (event) => {
        masonryWidth = event.currentTarget.value;
        masonryWidth = parseInt(masonryWidth, 10);
        masonryWidth = isNaN(masonryWidth) ? undefined : masonryWidth;
    };
    giBox.appendChild(masonryWidthInput);

    const styleEl = document.createElement('style');
    styleEl.innerText = styles;
    document.body.appendChild(styleEl);

    box.appendChild(giBox);

    document.body.insertBefore(container, page);
    container.appendChild(box);
    container.appendChild(contain);
})();
