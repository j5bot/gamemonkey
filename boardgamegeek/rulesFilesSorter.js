// ==UserScript==
// @name         BGG Rules Files Sorter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  shows first 50 files and attempts to sort official rules / rules to the top
// @author       j5bot
// @match        https://boardgamegeek.com/*/*/*/files*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/rulesFilesSorter.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/rulesFilesSorter.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const rulesWords = [
        'rules',
        'rulebook',
        'manual',
        'regle',
        'règle',
    ];

    const officialWords = [
        'official',
    ];

    const rulesWordsRegEx = new RegExp(`(${rulesWords.join('|')})`, 'ig');
    const officialWordsRegEx = new RegExp(`(${officialWords.join('|')})`, 'ig');

    setTimeout(() => {
        const countButton = Array.from(
            document.querySelectorAll('showcount-selector[showcount="filectrl.params.showcount"] button[ng-click="setter(\'showcount\', option)"]')
        )?.pop();

        try {
            countButton?.click();
        } catch (e) {}

        const fileList = document.querySelector('.summary-file');
        fileList.style.flexDirection = 'column';
        fileList.style.display = 'flex';

        setTimeout(() => {
            const files = Array.from(fileList.querySelectorAll('li'));
            files.sort((a, b) => {
                const aTitle = a.querySelector('.summary-item-title h3 a')?.innerText;
                const bTitle = b.querySelector('.summary-item-title h3 a')?.innerText;
                const aIsRules = rulesWordsRegEx.test(aTitle);
                const bIsRules = rulesWordsRegEx.test(bTitle);
                const aIsOfficial = aIsRules && officialWordsRegEx.test(aTitle);
                const bIsOfficial = bIsRules && officialWordsRegEx.test(bTitle);

                return aIsOfficial && bIsOfficial ?
                       0 :
                       aIsOfficial ?
                       -1 : bIsOfficial ? 1 : aIsRules && bIsRules ? 0 : aIsRules ? -1 : 1;
            });

            files.forEach((file, index) => {
                file.style.order = index.toString();
            });
        }, 2000);

    }, 2000);
})();