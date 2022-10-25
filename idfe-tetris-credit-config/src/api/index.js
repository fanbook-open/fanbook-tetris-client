import axios from 'axios'
import http from './http'
import md5 from 'js-md5'

let $http = document.location.protocol + "//";
let $host = window.location.host;
let basePath = '/'
basePath = $http + $host + basePath

//获取用户信息
export const judgeAuthorization = (userId, gameId, nickname, avatar, gender, md5key) => {
    // md5加密钥
    let md = md5(String(`userId:${userId},gameId:${gameId},nickName:${nickname},avatar:${avatar},gender:${gender},${md5key}`))
    return new Promise((resolve, reject) => {
        http('POST', "oauth/judgeAuthorization", {
            userId: userId,
            gameId: gameId,
            nickName: nickname,
            avatar: avatar,
            gender: gender,
            md5: md
        },[userId]).then((res) => {
            resolve(res)
        }).catch(res => {
            reject()
        })
    })
}

// 获得我的信息 
export const getMe = (token) => {
    const host = 'https://www.xxx.xxx/api/bot/';
    const url = `${host}${token}/getMe`
    return new Promise((resolve, reject) => {
        axios.get(url).then(res => {
            if (res.status === 200 && res.data.ok == true) {
                resolve(res.data.result)
            } else {
                reject(res)
            }
        })
    })
}

//添加积分配置
export const addConfig = (guildId, type, dataJson, id) => {
    let conf = {
        guildId,
        type,
        dataJson: dataJson,
    }
    //有id是则为修改配置
    if (id || id !== undefined) {
        conf.id = id
    }
    return new Promise((resolve, reject) => {
        http('POST', "config/add", conf).then((res) => {
            resolve(res);
        }).catch(res => {
            reject(res);
        })
    })
}

//查询积分配置
export const searchConfig = (guildId) => {
    return new Promise((resolve, reject) => {
        http('POST', "config/query", {
            guildId: guildId
        }).then((res) => {
            resolve(res);
        }).catch(res => {
            reject(res);
        })
    })
}

//关闭开启积分配置
export const isOpenConfig = (guildId, status, id) => {
    return new Promise((resolve, reject) => {
        http('POST', "config/update", {
            guildId,
            status,
            id
        }).then((res) => {
            resolve(res);
        }).catch(res => {
            reject(res);
        })
    })
}

//测试定时器
export const testConfig = () => {
    return new Promise((resolve, reject) => {
        http('GET', "config/test", {
        }).then((res) => {
            resolve(res);
        }).catch(res => {
            reject(res);
        })
    })
}
