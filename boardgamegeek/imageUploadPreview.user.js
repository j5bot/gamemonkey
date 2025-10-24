// ==UserScript==
// @name         BGG Image Upload File Preview
// @namespace    https://github.com/j5bot/gamemonkey
// @version      0.1
// @description  Add previews to image upload
// @author       j5bot
// @match        https://boardgamegeek.com/boardgame/*/*/images
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/imageUploadPreview.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/imageUploadPreview.user.js
// ==/UserScript==

(function() {
    'use strict';

    const addImagePreview = () => {
        let filerows = Array.from(document.querySelectorAll('.grid-filerow:not(.grid-header):not([data-image-preview])'));
        if (filerows.length === 0) {
            return;
        }
        filerows = Array.from(document.querySelectorAll('.grid-filerow:not(.grid-header)'));
        setTimeout(() => {
            const files = angular.element(document.querySelector('input[type=file]')).scope().uploader.queue.map(f => f._file);
            files.forEach((file, index) => {
                const filerow = filerows[index];
                if (filerow.getAttribute('data-image-preview')) {
                    return;
                }
                filerow.setAttribute('data-image-preview', 'true');

                const url = URL.createObjectURL(file);
                const img = document.createElement('img');
                img.src = url;
                img.setAttribute('style', 'width: 100%; height: 100%; object-fit: contain;');

                const span = document.createElement('span');
                span.setAttribute('style', `
                height: 256px;
                width: 256px;
                display: block;
                padding: 5px;
                background-color: #dddddd;
                border-radius: 5px;
                `);
                span.appendChild(img);

                const name = filerow.querySelector('small');
                name.insertBefore(span, name.firstChild);
            });
        }, 500);
    };

    addImagePreview();
    const mo = new MutationObserver(addImagePreview);
    mo.observe(document.body, { subtree: true, childList: true });
})();