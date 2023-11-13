// ==UserScript==
// @name         FuckEducoder
// @namespace    http://tampermonkey.net/
// @version      1.1
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

// 目前设置随机时间的方法出现严重Bug，请谨慎使用！
// 若仍想快速刷时间，请进入微信头歌小程序，在对应的实例界面左右滑动，可快速刷到int最大值
const setRandomTime = false;

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
                                if (setRandomTime) result.game.cost_time = Math.floor(Math.random() * (max - min + 1)) + min;
                                result.shixun.forbid_copy = false;
                                result.shixun.vip = true;
                                resolve(result);
                            });
                        });
                    };
                } else if (arguments[0].indexOf('rep_content') !== -1 && arguments[0].indexOf('tasks') !== -1) {
                    const oldJson = response.json;
                    response.json = function () {
                        return new Promise((resolve, reject) => {
                            oldJson.apply(this, arguments).then((result) => {
                                result.content.content = 'c3VjY2VzcyE=';
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