// ==UserScript==
// @name         BGG Gameplay Age
// @namespace    https://github.com/j5bot/gamemonkey
// @version      0.1
// @description  Add the age of the last play in years to collection views which already contain
//               play counts
// @author       j5bot
// @match        https://boardgamegeek.com/collection/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      boardgamegeek.com
// @run-at       document-end
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/gameplayAge.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/gameplayAge.user.js
// ==/UserScript==
(function () {
    const bggXMLApiKey = unsafeWindow.bggXMLApiKey ?? JSON.parse(window.localStorage.getItem('gamemonkey-settings'))?.bggXMLApiKey;
    if (!bggXMLApiKey) {
        const getScript = unsafeWindow.confirm('Get GameMonkey base script?');
        if (getScript) {
            GM_openInTab('https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/base/gamemonkey.user.js');
        }
    }

    const queue = [];
    let isProcessing = false;

    const parser = new DOMParser();

    const defaultDelay = 700;
    const year = 365 * 24 * 60 * 60 * 1000;

    const usernameSelector = '#collection .fl a';
    const playsSelector = '[id^="quickplay_results"] a:not([data-play-age="true"])';
    const playParamRegEx = new RegExp('/plays/(.+?)/(\\d+)', 'i');

    const addRecencyToCell = item => {
        if (!item) {
            return;
        }

        const { link, playDate, recency } = item;

        if (recency === 0 || recency === undefined) {
            return;
        }

        const cell = link.parentElement;
        const recencyElement = document.createElement('div');
        recencyElement.title = playDate.toISOString().split('T')[0];
        recencyElement.textContent = `${recency.toString()} years`;
        cell.appendChild(recencyElement);
    };

    const enqueue = (link, username, [type, id], playCount) => {
        queue.push({ link, type, id, username, playCount });
    };

    const dequeue = async (delay = 5000) => {
        if (queue.length === 0) {
            setTimeout(() => dequeue(delay), delay);
            return;
        }
        const item = queue.shift();

        fetchPlayDateRecency(item).then(item => {
            addRecencyToCell(item);
            setTimeout(() => dequeue(delay), delay);
        });
    };

    const getLatestPlayDate = (xmlText) => {
        const doc = parser.parseFromString(xmlText, 'application/xml');
        const plays = doc.getElementsByTagName('play');
        const latestPlay = Array.from(plays).find(play => play.hasAttribute('date')
                                  && play.getAttribute('date').length > 0);
        return latestPlay ? latestPlay.getAttribute('date') : null;
    };

    const getPlayDateRecency = dateString => {
        if (!dateString) {
            return {};
        }
        const playDate = new Date(dateString);
        return {
            playDate,
            recency: Math.floor((Date.now() - playDate) / year)
        };
    };

    const fetchPlayDateRecency = async item => {
        return new Promise((resolve, reject) => {
            const { username, type, id } = item;

            const url = new URL(`https://www.boardgamegeek.com/xmlapi2/plays?type=${type}&id=${id}&username=${username}&page=1`);

            const onload = (response) => {
                if (response.status === 429) {
                    console.warn('retrying load plays after 2s');
                    setTimeout(() => fetchPlayDateRecency(item).then(resolve).catch(reject), defaultDelay);
                    return;
                }
                if (response.status === 200) {
                    resolve({
                        ...item,
                        ...getPlayDateRecency(getLatestPlayDate(response.responseText)),
                    });
                    return;
                }
                reject(response.error);
            };

            GM_xmlhttpRequest({
                method: 'GET',
                url: url.toString(),
                headers: {
                    'Accept': 'application/xml',
                    'Authorization': `Bearer ${bggXMLApiKey}`
                },
                onload,
                onerror: function(err) {
                    console.error('BGG API request error:', err);
                    reject(err);
                },
            });
        })
    };

    const init = async (rawPlaysLinks) => {
        const username = document.querySelector(usernameSelector)?.href.split('/').slice(-1)[0];
        const playLinks = rawPlaysLinks ?? document.querySelectorAll(playsSelector);
        playLinks.forEach(link => {
            link.setAttribute('data-play-age', 'true');
            const matches = link.href.match(playParamRegEx);
            if (!matches) {
                return;
            }
            const playCount = link.innerText.trim();
            if (isNaN(parseInt(playCount, 10))) {
                return;
            }
            enqueue(link, username, matches.slice(1), playCount);
        });
        if (!isProcessing) {
            dequeue(defaultDelay).then();
            isProcessing = true;
        }
    };

    if (unsafeWindow.gamemonkey) {
        console.info('Gameplay age script init via gamemonkey base script...');
        unsafeWindow.gamemonkey.scriptObservers.push({
            selector: playsSelector,
            fn: init
        });
    }
})();