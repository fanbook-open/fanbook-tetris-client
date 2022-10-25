// 是否为fb小程序
export function isFBMP() {
    const fb = window.fb
    if (fb.getPlatform) {
        return fb.getPlatform() == 1
    }
    const u = navigator.userAgent;
    return u.indexOf('FBMP') !== -1;
}

var api_host = "";
var md5key = '';
var bot_token = '';
var env = "development";
var web_host = "";
if (window.location.host == "www.xxx.xxx") {
    api_host = "https://fanbot.xxx.xxx:9000";
    env = "production";
    bot_token = 'bot_token_production';
    md5key = 'md5key_production';
    web_host = "https://www.xxx.xxx/mp/138519745866498048/273383374205222914/v1/redirect";

} else if (~(window.location.host.indexOf("xxx.xxx.xxx.51"))) {
    api_host = "http://xxx.xxx.xxx.205:9000";
    env = "development";
    bot_token = "bot_token_development";
    md5key = 'md5key_development';
    web_host = "http://xxx.xxx.xxx.xxx/mp/138519745866498048/273383374205222914/v1/redirect";
} else {
    api_host = "http://xxx.xxx.xxx.xxx:9000";
    env = "development";
    bot_token = "bot_token_development";
    md5key = 'md5key_development';
    web_host = "http://10.100.1.39/mp/138519745866498048/273383374205222914/v1/redirect";
}

export const CONFIG = {
    "api_host": api_host,
    "bot_token": bot_token,
    "md5_key": md5key,
    "env": env,
    "web_host": web_host
}

export function isIOS() {
    var u = navigator.userAgent;
    // var isAndroid = u.indexOf('Android') > -1 ||u.indexOf('Adr') > -1; //android终端
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}


//请求处理精度丢失问题
export function getBigIntJSONStingify(json, bigInt = []) {
    let params = JSON.stringify(json);

    bigInt.forEach(item => {
        params = params.replace(`"${item}"`, item);
    })

    return params;
}

//获取uuid
export function getUuid(len, prefix = "") {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    var radix = chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return prefix + uuid.join('');
}