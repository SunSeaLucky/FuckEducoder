// ==UserScript==
// @name         FuckEducoder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This scipt is used for unfreezing educoder's copy restriction. Enjoy it!
// @author       SunSeaLucky
// @match        https://www.educoder.net/tasks/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// ==/UserScript==

const max = 30000;
const min = 5000;

(function () {
    'use strict';
    let oldFetch = fetch;
    function hookFetch(...args) {
        return new Promise((resolve, reject) => {
            oldFetch.apply(this, arguments).then((response) => {
                if (arguments[0].indexOf('homework_common_id') !== -1) {
                    const oldJson = response.json;
                    response.json = function () {
                        return new Promise((resolve, reject) => {
                            oldJson.apply(this, arguments).then((result) => {
                                result.game.cost_time = Math.floor(Math.random() * (max - min + 1)) + min;
                                result.shixun.forbid_copy = false;
                                result.shixun.vip = true;
                                resolve(result);
                            });
                        });
                    };
                }
                resolve(response);
            });
        });
    }

    window.fetch = hookFetch;
})();