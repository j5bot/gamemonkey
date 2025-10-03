// ==UserScript==
// @name         BGG Hover Preview via API
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Show a preview of a boardgame when hovering a BGG link using XML API2
// @match        https://boardgamegeek.com/*
// @match        https://www.boardgamegeek.com/*
// @grant        GM_xmlhttpRequest
// @connect      boardgamegeek.com
// @connect      api.geekdo.com
// ==/UserScript==

(function() {
    'use strict';

    let previewBox = null;
    let lastRequestTime = 0;

    // a map of all the API call results
    let dataMap = {};

    // Rate-limit: ensure at least `apiDelay` ms between API calls
    const apiDelay = 5 * 1000; // 5 seconds

    // shared parser
    const parser = new DOMParser();

    // supported thing types
    const thingTypes = [
        "boardgame",
        "boardgameaccessory",
        "boardgameexpansion",
        "thing"
    ];

    const thingTypeLinkSelector = thingTypes.map((thingType) => {
        return `a[href*="/${thingType}/"]:not([data-preview-attached=true])`;
    }).join(",");

    const thingTypeAndIdRegEx = new RegExp(`\/(${thingTypes.join("|")})\/(\\d+)(\/.+|)$`);

    function extractThingTypeAndId(href) {
        const m = href.match(thingTypeAndIdRegEx);
        return m ? {type: m[1], id: m[2]} : {};
    }

    function createPreviewBox() {
        previewBox = document.createElement("div");
        previewBox.className = "tw-absolute tw-z-1000 tw-bg-white tw-max-w-sm tw-hide tw-p-2" +
                               " tw-rounded-md tw-border-gray-500";
        previewBox.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
        document.body.appendChild(previewBox);
    }

    function showPreviewAt(linkEl, html) {
        if (!previewBox) createPreviewBox();
        previewBox.innerHTML = html;
        const rect = linkEl.getBoundingClientRect();
        // position below link
        previewBox.style.top = (rect.bottom + window.scrollY + 5) + "px";
        previewBox.style.left = (rect.left + window.scrollX) + "px";
        previewBox.style.display = "block";
    }

    function hidePreview() {
        if (previewBox) {
            previewBox.style.display = "none";
        }
    }

    function xmlToText(node) {
        if (!node) {
            return "";
        }
        return node.textContent ? node.textContent : node.getAttribute("value") ?? "";
    }

    function parseThingXml(xmlText) {
        const doc = parser.parseFromString(xmlText, "application/xml");
        const item = doc.querySelector("item");
        if (!item) return null;

        const obj = {};
        obj.id = item.getAttribute("id");
        const nameElem = item.querySelector("name[type='primary']") || item.querySelector("name");
        obj.name = xmlToText(nameElem);
        obj.year = xmlToText(item.querySelector("yearpublished"));
        obj.thumbnail = xmlToText(item.querySelector("thumbnail"));
        obj.image = xmlToText(item.querySelector("image"));
        obj.minplayers = xmlToText(item.querySelector("minplayers"));
        obj.maxplayers = xmlToText(item.querySelector("maxplayers"));
        obj.playingtime = xmlToText(item.querySelector("playingtime"));
        obj.description = xmlToText(item.querySelector("description"));

        const avg = item.querySelector("statistics ratings average");
        obj.average = avg ? avg.getAttribute("value") : "";

        return obj;
    }

    function buildPreviewHtml(data) {
        if (!data) return "<div>You must wait 5 seconds before hovering on the next link (a BGG's API restriction)</div>";

        const imgThumb = data.thumbnail ? `<img src="${data.thumbnail}"  alt="${data.name}"/>` : "";
        const imgFull = data.image ? `<img src="${data.image}" alt="${data.name}"/>` : "";
        // show thumb first, then full image if exists
        const imgSection = imgFull ? imgFull : imgThumb;

        const players = (data.minplayers && data.maxplayers) ? `${data.minplayers}–${data.maxplayers}` : "";
        const time = data.playingtime ? `${data.playingtime} min` : "";
        const avg = data.average ? data.average : "N/A";

        // truncate description
        let desc = data.description || "";
        desc = desc.replace(/\\n|\\r/g, " ").trim();
        if (desc.length > 300) desc = desc.slice(0, 300) + "…";

        return `
            <div>
                <div class="tw-text-base tw-font-semibold tw-mb-0.5">
                    ${data.name} ${data.year ? `(${data.year})` : ""}
                </div>
                ${imgSection}
                <div class="tw-text-sm tw-ml-0.5 tw-mr-0.5 tw-flex tw-justify-between">
                    <div><span class="tw-font-semibold">Rating:</span> ${avg}</div>
                    ${players ? `<div><span class="tw-font-semibold">Players:</span> ${players}</div>` : ""}
                    ${time ? `<div><span class="tw-font-semibold">Time:</span> ${time}</div>` : ""}
                </div>
                <div class="tw-text-xs color-gray-400">${desc}</div>
            </div>
        `;
    }

    function fetchThing(type, id, callback) {
        const url = `https://boardgamegeek.com/xmlapi2/thing?id=${encodeURIComponent(id)}&stats=1`;

        const onload = function(resp) {
            if (resp.status === 200) {
                const data = parseThingXml(resp.responseText);
                callback(data);
            } else if (resp.status === 202) {
                // queued; try again after slight delay
                setTimeout(() => {
                    fetchThing(type, id, callback);
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
            method: "GET",
            url: url,
            headers: {
                "Accept": "application/xml"
            },
            onload,
            onerror: function(err) {
                console.error("BGG API request error:", err);
                callback(null);
            }
        });
    }

    function attachHover(link, index, array) {
        let hoverTimer;

        const {type, id} = extractThingTypeAndId(link.href);
        link.setAttribute("data-preview-attached", "true");

        link.addEventListener("mouseenter", () => {
            hoverTimer = setTimeout(() => {
                fetchThing(type, id, (data) => {
                    const html = buildPreviewHtml(data);
                    showPreviewAt(link, html);
                });
            }, 300);
        });

        link.addEventListener("mouseleave", () => {
            clearTimeout(hoverTimer);
            hidePreview();
        });
    }

    function init() {
        const links = document.querySelectorAll(thingTypeLinkSelector);
        links.forEach((link, index, array) => {
            attachHover(link, index, array);
        });
    }

    init();
    const mo = new MutationObserver(init);
    mo.observe(document.body, { subtree: true, childList: true });

})();