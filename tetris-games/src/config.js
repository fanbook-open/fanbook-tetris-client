var api_host = "";
var md5key = '';
var bot_token = '';
var env = "development";
var web_host = "";
var jdlog = "";

if (location.host == "xxx.xxx.xxx") {
    api_host = "https://xxx.xxx.xxx:9000";
    env = "production";
    bot_token = 'bot_token_production';
    md5key = 'md5key_production';
    web_host = "https://xxx.xxx.xxx/mp/v1/redirect";
    jdlog = 'https://jdlog-h5.uu.cc';
} else if(~(window.location.host.indexOf('192.168.110.51'))){
    api_host = "http://192.168.110.205:9000";
    env = "development";
    bot_token = "bot_token_development";
    md5key = 'md5key_development';
    web_host = "http://xxx.xxx.xxx.xxx/mp/v1/redirect";
    jdlog = 'https://jdlog-h5.uu.cc';
}else{
    api_host = "http://xxx.xxx.xxx.xxx:9000";
    env = "development";
    bot_token = "bot_token_development";
    md5key = 'md5key_development';
    web_host = "http://xxx.xxx.x.xxx/mp/v1/redirect";
    jdlog = 'https://xx.xx.xx';  
}

export const CONFIG = {
    "api_host": api_host,
    "bot_token": bot_token,
    "md5_key": md5key,
    "env": env,
    "web_host": web_host,
    "jdlog": jdlog
}