answerApi: {
    cx_icodef_com: data => {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://f53bbf39bd884316a6774655cf7130bb.apig.cn-north-4.huaweicloudapis.com/triggerApigMessage",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                data: "topic[0]=" + encodeURIComponent(data.question),
                onload: function (r) {
                    try {
                        const res = JSON.parse(r.responseText);
                        resolve([res[0].result[0].correct.map(item => {
                            return String(item.content).toString();
                        })]);
                    } catch (e) {
                        resolve([]);
                    }
                },
                onerror: function (e) {
                    resolve([]);
                }
            });
        });
    }
}