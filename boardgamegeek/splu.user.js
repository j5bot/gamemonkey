// ==UserScript==
// @name         BGG SPLU Userscript Version
// @namespace    http://github.com/j5bot/gamemonkey
// @version      0.1.2
// @description  improves the play logging experience on BGG
// @author       dazeysan, j5bot
// @match        https://boardgamegeek.com/boardgame/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/splu.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/splu.user.js
// ==/UserScript==

(function() {
    'use strict';
    document.SPLUcode = '';
    document.SPLUxml = '';

    function addSPLU () {
        const SPLUscript = document.createElement('script');
        SPLUscript.type = 'text/javascript';
        SPLUscript.src = 'https://dazeysan.github.io/SPLU/Source%20Code/SPLU-Current.js';
        document.body.appendChild(SPLUscript);
    }

    setTimeout(() => {
        const logPlayButtons = Array.from(document.querySelectorAll('button[play-recorder-button]'));

        logPlayButtons.forEach(logPlayButton => {
            const spluButton = document.createElement(logPlayButton.tagName);
            spluButton.className = logPlayButton.className;
            spluButton.innerHTML = logPlayButton.innerHTML;
            spluButton.onclick = function () {
                if (window.initSPLU !== undefined) {
                    window.initSPLU();
                } else {
                    try {
                        addSPLU();
                    } catch (e) {}
                }
            };

            logPlayButton.style.display = 'none';
            logPlayButton.parentElement.insertBefore(spluButton, logPlayButton);
        });
    }, 1000);
})();