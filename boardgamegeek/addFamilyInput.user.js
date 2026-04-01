// ==UserScript==
// @name         BGG Add Family to Advanced Search
// @namespace    http://github.com/j5bot/gamemonkey
// @version      0.1
// @description  Add a family lookup input field to advanced search
// @author       You
// @match        https://boardgamegeek.com/advsearch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/addFamilyInput.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/addFamilyInput.user.js
// ==/UserScript==
(function() {
    'use strict';

    const sourceRow = document.getElementsByName('include[designerid]')[0].parentElement.parentElement.parentElement;
    const targetRow = sourceRow.clone(true);

    const sourceInput = sourceRow.querySelector('[name=geekitemname]');

    targetRow.innerHTML = targetRow.innerHTML.replace(new RegExp(sourceInput.id.slice(1), 'g'), 'Family');
    targetRow.innerHTML = targetRow.innerHTML.replace(new RegExp('designer', 'g'), 'family');
    targetRow.innerHTML = targetRow.innerHTML.replace(new RegExp('Designer', 'g'), 'Family');
    targetRow.innerHTML = targetRow.innerHTML.replace(new RegExp(`'0'`, 'g'), `'2'`);

    const targetInput = targetRow.querySelector('[name=geekitemname]');
    const targetHiddens = targetRow.querySelectorAll('div:first-of-type input[type="hidden"]');

    const targetIS = targetRow.querySelector('span:last-of-type');
    const targetISR = targetIS.querySelector('div div');
    const targetOD = document.createElement('div');

    targetHiddens[0].id = 'objectid2';
    targetHiddens[0].name = 'familyids[]';
    targetHiddens[1].id = 'objecttype2';
    targetInput.id = 'qFamily';
    targetInput.name = '';
    targetIS.id = 'instantsearchFamily';
    targetISR.id = 'instantsearchresultsFamily';
    targetOD.id = 'objectiddispFamily';
    targetIS.parentElement.appendChild(targetOD);

    sourceRow.parentElement.insertBefore(targetRow, sourceRow);
})();