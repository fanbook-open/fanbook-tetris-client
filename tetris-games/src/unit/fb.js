import { saveUserInfo, judgeAuthorization, getMe, http } from '../http';
import { CONFIG } from "../config"


window.fbObject = {};
const btn = document.querySelector(".power-box");
let lock = true
const fbUnit = {
    init: () => {
        return new Promise((reject, resolve) => {
            fb.init({
                success: () => {
                    // 初始化逻辑
                    //alert("初始化调用成功");
                    // sdk 获取服务器ID
                    // sdk 获取APP用户信息  getCurrentGuild 服务器信息   getUserInfo用户信息   getCurrentChannel频道的信息
                    //
                    Promise.all([fb.getCurrentGuild(), fb.getUserInfo(), fb.getCurrentChannel(), getMe()]).then(res => {
                        // alert("服务器："+v.id+",   服务器名称："+v.name);
                        window.fbObject.serverId = res[0].id;
                        // alert("userId"+ v.userId+",  avatar:"+v.avatar+",     nickname:"+v.nickname);
                        window.fbObject.userConfig = res[1];
                        window.fbObject.chatId = res[2].id
                        window.fbObject.gameId = String(res[3].id)
                        // 获取游戏服务后台接口是否授权
                        judgeAuthorization().then((res) => {
                            window.fbObject.userName = res.userName;
                            reject();
                        }).catch(() => {
                            // 没有授权需要调用如下示例方法
                            fbUnit.toOAuth(reject)
                            // btn.style.display = 'block';
                        })
                    })


                    // // 待会删除
                    // Promise.all([getMe()]).then(res=>{
                    //
                    //     // alert("服务器："+v.id+",   服务器名称："+v.name);
                    //     window.fbObject.serverId = res[0].id;
                    //     // alert("userId"+ v.userId+",  avatar:"+v.avatar+",     nickname:"+v.nickname);
                    //     // window.fbObject.userConfig = res[1];
                    //     // window.fbObject.chatId = res[2].id
                    //     // window.fbObject.gameId = res[3].id
                    //     // 获取游戏服务后台接口是否授权
                    //     judgeAuthorization().then(()=>{
                    //         reject();
                    //     }).catch(()=>{
                    //         // 没有授权需要调用如下示例方法
                    //         fbUnit.toOAuth(reject)
                    //         // btn.style.display = 'block';
                    //     })
                    // })


                }
            });
        });
    },
    // 鉴权
    toOAuth: (cb) => {

        return new Promise((reject, resolve) => {
            fb.oAuth({ 'oAuthUrl': CONFIG.web_host }).then(function (res) { // 不能判断客户端ID
                // 待会删除
                // cb();
                // reject();
                //
                //
                //
                // alert("code: "+res.data.code);
                // setTimeout(function(){


                if (res.data && res.data.code) {
                    // alert("鉴权成功："+res.data.code);
                    // 调用后台保存用户信息接口
                    // /oauth/saveUserInfo
                    // 结束
                    lock = false;
                    saveUserInfo(res.data.code)
                    cb();
                    reject();

                } else if (res.data.code == undefined) {
                    //alert("鉴权失败: "+res.data.code);
                    // 递归强制授权
                    // fbUnit.toOAuth(cb);
                    // resolve()
                    btn.style.display = 'block';
                    lock = false;
                } else {
                    // alert("error code："+res.data.code);
                    // alert(res['errMsg']);
                    // fbUnit.toOAuth(cb);
                    btn.style.display = 'block';
                    resolve(cb)
                    lock = false;
                }

                btn.onclick = () => {
                    if (lock) return false
                    fbUnit.toOAuth(cb);
                    reject();
                }
                //     // },500);
            });
        })

    }
}


export default fbUnit