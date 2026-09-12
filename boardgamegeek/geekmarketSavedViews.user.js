// ==UserScript==
// @name         BGG GeekMarket Load Filterable Page & Store Filters
// @namespace    http://github.com/j5bot/gamemonkey
// @version      1.0.0
// @description  Add filter saving to BGG GeekMarket pages
// @author       TheCookieCats
// @match        https://boardgamegeek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/geekmarketSavedViews.user.js
// @updateURL    https://raw.githubusercontent.com/j5bot/gamemonkey/refs/heads/main/boardgamegeek/geekmarketSavedViews.user.js
// ==/UserScript==

(function() {
    'use strict';

    const marketUrlRegEx = /\/([^/]+)\/(\d+)\/.*/ig;
    const marketBrowseBaseParams = ['objecttype', 'objectid', 'pageid', 'automarket'];

    const separateParams = params => Array.from(params.entries())
        .reduce((acc, [key, value]) => {
            Object.assign(acc[
                marketBrowseBaseParams.includes(key) ? 'baseParams' : 'filterAndSortParams'
                ], { [key]: value });
            return acc;
        }, {
            baseParams: {},
            filterAndSortParams: {},
        });


    window.navigation.addEventListener('navigate', event => {
        const nextURL = new URL(event.destination.url);
        const path = nextURL.pathname;

        switch (true) {
            case path.endsWith('/geekmarket'): {
                const matches = marketUrlRegEx.exec(event.destination.url);
                console.log(matches, event.destination.url);
                const [_, _type, id] = matches;
                window.location.href = `/market/browse?objecttype=thing&objectid=${id}&pageid=1&automarket=1`;
                event.preventDefault();
                return false;
            }
            case path.startsWith('/market/browse'): {
                const params = nextURL.searchParams;

                if (params.get('automarket') !== '1') {
                    return;
                }
                const { baseParams, filterAndSortParams } = separateParams(params);

                if (Object.keys(filterAndSortParams).length === 0) {
                    const storedParams = window.localStorage.getItem('market-filters-default');
                    if (!storedParams) {
                        return;
                    }
                    Object.entries({...baseParams, ...JSON.parse(storedParams)}).forEach(([key, value]) => {
                        params.set(key, value);
                    });
                    window.location.href = nextURL.toString();
                    event.preventDefault();
                    return false;
                } else {
                    window.localStorage.setItem('market-filters-default', JSON.stringify(filterAndSortParams));
                }
                return true;
            }
        }
    });

    const addButtons = () => {
        if (
            document.getElementById('clear-filters-button') &&
            document.getElementById('save-filters-button') &&
            document.getElementById('saved-filters-dropdown')
        ) {
            return;
        }
        const dropdown = document.querySelector('.btn-group.m-l-none');
        const successButton = document.querySelector('.btn-success');
        const toolbar = document.querySelector('[role=toolbar]');

        if (!(dropdown && successButton && toolbar)) {
            return;
        }

        const savedFiltersDropdown = dropdown.cloneNode(true);
        savedFiltersDropdown.id = 'saved-filters-dropdown';
        const sfdb = savedFiltersDropdown.firstElementChild;

        sfdb.classList.remove('btn-primary');
        sfdb.classList.add('btn-success');
        sfdb.innerHTML =
            sfdb.innerHTML.replace('Add Filter', 'Saved Views');

        const sfdli = savedFiltersDropdown.querySelector('li');
        sfdli?.removeAttribute('ng-repeat');
        sfdli?.classList.remove('ng-scope');
        sfdli?.firstElementChild.removeAttribute('ng-click');
        sfdli?.firstElementChild.classList.remove('ng-binding');
        savedFiltersDropdown.querySelectorAll('li').forEach(li => {
            li.parentElement.removeChild(li);
        });
        const sfdul = savedFiltersDropdown.querySelector('ul');
        const marketFilters = JSON.parse(
            window.localStorage.getItem('market-filters-saved') ?? '[]'
        );
        const setFilter = event => {
            const filter = event.currentTarget.parentElement.filter;
            const currentParams = new URLSearchParams(window.location.search);
            console.log(currentParams);
            const params = new URLSearchParams();
            const { baseParams, filterAndSortParams } = filter;
            Object.entries({...baseParams, ...filterAndSortParams}).forEach(([key, value]) => {
                params.set(key, value);
            });
            params.set('objectid', currentParams.get('objectid'));
            params.set('pageid', currentParams.get('pageid'));
            window.location.href = `${window.location.pathname}?${params.toString()}`;
            event.preventDefault();
            return false;
        };
        const deleteFilter = event => {
            const filter = event.currentTarget.parentElement.filter;
            const newFilters = marketFilters.filter(f => f.name !== filter.name);
            window.localStorage.setItem('market-filters-saved', JSON.stringify(newFilters));
            event.currentTarget.parentElement.parentElement.removeChild(event.currentTarget.parentElement);
        };

        marketFilters.forEach(filter => {
            const li = sfdli.cloneNode(true);
            li.className += ' flex items-center justify-between';
            li.style.marginRight = '10px';
            li.firstElementChild.innerText = filter.name;
            li.filter = filter;
            li.firstElementChild.addEventListener('click', setFilter);
            const deleteFilterButton = document.createElement('span');
            deleteFilterButton.innerText = 'X ';
            deleteFilterButton.classList.add('px-4');
            deleteFilterButton.addEventListener('click', deleteFilter);
            li.appendChild(deleteFilterButton);
            sfdul.appendChild(li);
        });

        dropdown.parentElement.insertBefore(savedFiltersDropdown, dropdown);

        const clearButton = successButton.cloneNode(true);
        clearButton.innerText = 'Clear Filters';
        clearButton.removeAttribute('href');
        clearButton.addEventListener('click', event => {
            window.localStorage.removeItem('market-filters-default');
            const { baseParams } = separateParams(new URL(window.location.href).searchParams);
            const params = new URLSearchParams();
            Object.entries(baseParams).forEach(([key, value]) => {
                params.set(key, value);
            });
            window.location.href = `${window.location.pathname}?${params.toString()}`;
            event.preventDefault();
            return false;
        });
        clearButton.id = 'clear-filters-button';
        clearButton.classList.remove('btn-success');
        clearButton.classList.add('btn-warning');

        const saveFiltersButton = successButton.cloneNode(true);
        saveFiltersButton.id = 'save-filters-button';
        saveFiltersButton.innerText = 'Save View';
        saveFiltersButton.removeAttribute('href');
        saveFiltersButton.addEventListener('click', () => {
            const name = window.prompt('Enter filter name');
            if (!name) {
                return;
            }

            const marketFilters = JSON.parse(
                window.localStorage.getItem('market-filters-saved') ?? '[]'
            );
            const { baseParams: { objectid, pageid, ...baseParams }, filterAndSortParams } =
                separateParams(new URL(window.location.href).searchParams);
            const newFilter = { name, baseParams, filterAndSortParams };
            marketFilters.push(newFilter);
            window.localStorage.setItem('market-filters-saved', JSON.stringify(
                marketFilters
            ));
        });

        toolbar.appendChild(saveFiltersButton);
        toolbar.appendChild(clearButton);
    };

    const mo = new MutationObserver(addButtons);
    mo.observe(document.body, { subtree: true, childList: true });

    setTimeout(addButtons, 1000);
})();
