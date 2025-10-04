// ==UserScript==
// @name         BGG Geeklist Thumb Collage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to collect images from geeklist item entries to put them into grids for making screenshots
// @author       j5bot
// @match        https://boardgamegeek.com/geeklist/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/geeklistThumbCollage.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/geeklistThumbCollage.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `
#gatherbox { background-color: white; padding: 5px; border: solid 1px #999; }
#gatherbox button { border: solid 1px #333; margin: 5px; padding: 3px; }
.gather-container {
    display: inline-block;
    position: relative;
    width: 175px;
    height: 175px;
    margin: 2px;
    overflow: hidden;
    background-image: linear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(117, 19, 93, 0.73));
}
.gather-container img:first-of-type {
    height: 100%;
    width: 100%;
    object-fit: cover;
    position: absolute;
    opacity: 0.3;
}
.geeklist-item__img.geeklist-item__img.geeklist-item__img.geeklist-item__img {
    padding: 0px !important;
}
    `;

    let imgCount = 0;

    function copyImages() {
        const imgs = page.getElementsByClassName('geeklist-item__img');
        Array.from(imgs).forEach(img => {
            const container = document.createElement('div');
            container.className = 'gather-container';

            const bgImg = document.createElement('img');
            bgImg.src = img.src;

            img.style.display = 'inline-block !important';
            img.style.padding = '2px !important';
            img.style.objectFit = 'none !important';
            img.style.width = 'auto !important';
            img.style.height = 'auto !important';
            img.style.position = 'relative !important';
            img.style.zIndex = 2;
            container.appendChild(bgImg);
            container.appendChild(img);
            box.appendChild(container);

            imgCount++;
            if (imgCount % 16 === 0) {
                box.appendChild(document.createElement('hr'));
            }
        });
    }


    const page = document.body.firstElementChild;
    const box = document.createElement('div');
    box.id = 'gatherbox';
    const giBox = document.createElement('div');

    const gatherImages = document.createElement('button');
    gatherImages.innerText = 'GATHER';
    gatherImages.onclick = copyImages;
    giBox.appendChild(gatherImages);

    const splitImages = document.createElement('button');
    splitImages.innerText = 'SPLIT';
    giBox.appendChild(splitImages);

    const styleEl = document.createElement('style');
    styleEl.innerText = styles;
    document.body.appendChild(styleEl);

    box.appendChild(giBox);

    document.body.insertBefore(box, page);
})();