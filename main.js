// ==UserScript==
// @name         FuckEducoder
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  This scipt is used for unfreezing educoder's copy restriction. Enjoy it!
// @author       SunSeaLucky
// @match        https://www.educoder.net/tasks/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require       https://cdn.jsdelivr.net/npm/js-base64@3.7.5/base64.min.js
// @connect      service-q3vdttin-1301163996.bj.apigw.tencentcs.com
// @run-at       document-start
// @license      MIT
// ==/UserScript==

const max = 30000;
const min = 5000;

const requestError = "//RequestError: May this time serve is closed! Try again at another time.";

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
                                var pattern = /uva(.*)\./,
                                    str = result.filename;
                                requsets("https://6k7f936939.yicp.fun/index.php?codeNumber=" + pattern.exec(str)[1])
                                    .then(answer => {
                                        result.content.content = answer;
                                        resolve(result);
                                    })
                            });
                        });
                    };
                }
                resolve(response);
            });
        });
    }

    window.fetch = hookFetch;

    async function requsets(url) {
        try {
            const response = await fetch(url);
            return await response.text();
        } catch (error) {
            return Base64.encode(requestError);
        }
    }
})();

