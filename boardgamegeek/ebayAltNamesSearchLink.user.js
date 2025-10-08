// ==UserScript==
// @name         BGG eBay AltNames Search Link
// @namespace    http://github.com/j5bot/gamemonkey
// @version      0.1
// @description  Add an eBay search link for the current game for only US results, but for all
//               alternate names
// @author       j5bot
// @match        https://boardgamegeek.com/*/*/marketplace/ebay
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @connect      boardgamegeek.com
// @grant        GM_xmlhttpRequest
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/ebayAltNamesSearchLink.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/ebayAltNamesSearchLink.user.js
// ==/UserScript==

(function() {
    'use strict';

    const domain = 'https://www.ebay.com';
    const region = 'R40'; // us
    const category = '220'; // toys

    let lastRequestTime = 0;

    // a map of all the API call results
    let dataMap = {};

    // Rate-limit: ensure at least `apiDelay` ms between API calls
    const apiDelay = 5 * 1000; // 5 seconds

    // shared parser
    const parser = new DOMParser();

    const fetchThing = (id, callback) => {
        const url = `https://boardgamegeek.com/xmlapi2/thing?id=${encodeURIComponent(id)}`;

        const onload = function(resp) {
            if (resp.status === 200) {
                const data = parseNamesFromThingXml(resp.responseText);
                callback(data);
            } else if (resp.status === 202) {
                // queued; try again after slight delay
                setTimeout(() => {
                    fetchThing(id, callback);
                }, 1500);
            } else {
                callback(null);
            }
            dataMap[url] = resp;
        };

        const cached = dataMap[url];
        if (cached) {
            onload(cached);
            return;
        }

        const now = Date.now();
        if (now - lastRequestTime < apiDelay) {
            // too soon; skip or delay
            // you could queue or throttle; for now, skip
            callback(null);
            return;
        }
        lastRequestTime = now;

        GM_xmlhttpRequest({
            url,
            headers: {
                accept: 'application/xml'
            },
            onload,
            onerror: err => {
                console.error("BGG API request error:", err);
                callback(null);
            }
        });
    };

    const parseNamesFromThingXml = xmlText => {
        const doc = parser.parseFromString(xmlText, 'application/xml');
        const item = doc.querySelector('item');
        if (!item) return [];
        const nameNodes = Array.from(item.querySelectorAll('name'));

        return nameNodes.map(node => node.getAttribute('value'));
    };

    const bggPathId = window.location.pathname.split('/')[2];
    const bggId = parseInt(bggPathId, 10);

    const eBayBaseUrl = `${domain}/sch/i.html?_sacat=${category}&_from=${region}&rt=nc&LH_PrefLoc=1&mkevt=1&mkcid=1&mkrid=707-53477-19255-0&campid=5335841951&toolid=20006`;

    const makeEBayLink = names => {
        const url = new URL(eBayBaseUrl);
        const usp = url.searchParams;
        usp.append('_nkw', `(${names.map(name => `"${name}"`).join(',')}) board game`);
        return url.toString();
    };

    const getLink = () => {
        if (isNaN(bggId)) {
            return;
        }

        const callback = data => {
            const link = makeEBayLink(data);
            const addButton = document.querySelector(`a[href*="/geekbay/searchitem/thing/${bggId}"]`);
            if (!addButton) {
                return;
            }
            addButton.href = link;
            addButton.target = '_blank';
            addButton.setAttribute('ng-href', link);
            addButton.innerHTML = `<svg data-prefix="fas" data-icon="magnifying-glass" class="svg-inline--fa fa-magnifying-glass fa-sm fa-pull-undefined" role="img" viewBox="0 0 512 512" aria-hidden="true"><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg> Search`;
        };

        fetchThing(bggId, callback);
    };

    getLink();
})();