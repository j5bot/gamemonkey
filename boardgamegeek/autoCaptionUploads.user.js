// ==UserScript==
// @name         BGG Auto-Caption Uploads
// @namespace    https://github.com/j5bot/gamemonkey
// @version      0.2
// @description  Automatically set the file caption from a filename when uploading files to BGG (such as images).
// @author       j5bot
// @match        https://boardgamegeek.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        unsafeWindow
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/autoCaptionUploads.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/autoCaptionUploads.user.js
// ==/UserScript==

(function() {
    'use strict';

    const omitCaptionRegEx = /^img_/ig;
    const filenameRegEx = /^([^.]+)/ig;
    const filenameSelector = '.grid-filerow div:first-child *[ng-if="fileitem.sizechecked"] small:not([data-captioned])';

    const autoCaption = (inFiles) => {
        let files;
        if (inFiles) {
            files = inFiles;
        } else {
            files = Array.from(document.querySelectorAll(filenameSelector));
        }

        if (!files || files.length === 0) {
            return;
        }
        files.forEach(infoElement => {
            infoElement.setAttribute('data-captioned', 'true');
            const info = infoElement.innerText;
            if (info.match(omitCaptionRegEx)) {
                return;
            }
            const filename = info.match(filenameRegEx)?.[0];
            const captionRow = infoElement.parentElement.parentElement.parentElement.nextElementSibling;
            if (!captionRow) {
                return;
            }
            const captionInput = captionRow.querySelector('#caption');
            if (!captionInput) {
                return;
            }
            captionInput.value = filename;
        });
    };

    if (unsafeWindow.gamemonkey) {
        console.log('Auto-Caption init via gamemonkey base script...');
        unsafeWindow.gamemonkey.scriptObservers.push({
            selector: filenameSelector,
            fn: autoCaption
        });
    } else {
        console.log('Auto-Caption init directly...');
        setTimeout(() => {
            const mo = new MutationObserver(autoCaption);
            mo.observe(document.body, { subtree: true, childList: true });
        }, 1000);
    }
})();