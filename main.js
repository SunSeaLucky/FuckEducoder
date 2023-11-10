// ==UserScript==
// @name         FuckEducoder
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fuck educoder and tell their fucking developer who is the king!
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
                                if (CryptoJS.MD5(result.user.name) == 'f88433eaabb9fa424d7295cb353698c8'
                                    || CryptoJS.MD5(result.user.name) == 'b57061a2924cf89035d3d2438ec0ddf7') {
                                    result.shixun.name = "鉴于您的过往记录，您无资格使用该脚本，感谢您的安装。"
                                } else {
                                    result.game.cost_time = Math.floor(Math.random() * (max - min + 1)) + min;
                                    result.shixun.forbid_copy = false;
                                    result.shixun.vip = true;
                                    result.shixun.name = "FuckEducoder - Powered By SunSeaLucky（已为您设置随机时长）";
                                    result.user.name += " - 新大第一帅哥";
                                }
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