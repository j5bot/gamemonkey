// ==UserScript==
// @name         OLWLG Anti-Arbitrage
// @namespace    http://github.com/j5bot/gamemonkey
// @version      1.0
// @description  Uncheck items on OLWLG wants step 4 to avoid arbitrage
// @author       TheCookieCats
// @match        https://bgg.activityclub.org/olwlg/mywants.cgi?listid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bgg.activityclub.org
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/olwlg/anti-arbitrage.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/olwlg/anti-arbitrage.user.js
// ==/UserScript==

(function() {
    'use strict';

    const confirmation = window.confirm('Update to fix possible arbitrage?');

    if (!confirmation) {
        return;
    }

    const mine = Array.from(document.querySelectorAll('th[id*=gm]'));
    const theirs = Array.from(document.querySelectorAll('td[id*=tdgn]'));

    const myCashIds = mine.filter(m => m.querySelector('tt')?.innerText.startsWith('$'))
        .map(c => c.id.replace('gm', ''));

    const theirCashIds = theirs.filter(their => {
            const t = their.querySelector('a')?.innerText;
            return t.startsWith('Alt Name: $') ||
                   t.startsWith('Outside the Scope of BGG');
        })
        .map(c => c.id.replace('tdgn', ''));

    const arbitrageIds = myCashIds.map(myCid => {
        return theirCashIds.map(tCid => `${tCid}-${myCid}`);
    }).flat();

    arbitrageIds.forEach(aId => {
        const cb = document.querySelector(`input[value='${aId}']`);
        cb.click();
        cb.checked = false;
    });
})();