import axios from 'axios';
import { CONFIG } from '../config'
import { getNowFormatString, getBigIntJSONStingify } from '../utils'
import JSONBigInt from 'json-bigint';
axios.defaults.headers['Content-type'] = 'application/json';
axios.defaults.transformResponse = [
  (data) => {
    const newData = JSONBigInt.parse(data);
    return newData;
  }
]

// 引入md5
import md5 from 'js-md5';

const host = CONFIG.api_host;
const url = host;

let md5key = CONFIG.md5_key;

const http = (type, name, params = {}, bigint = []) => {
  return new Promise((resolve, reject) => {
    if (type.toLocaleLowerCase() === 'post') {
      axios.post(
        `${url}/${name}`,
        bigint.length ? getBigIntJSONStingify(params, bigint) : params
      ).then(res => {
        if (res.status == 200 && res.data.code == 200) {
          resolve(res.data.data);
        } else {
          reject(res.data)
        }
      });
    } else {
      axios.get(`${url}/${name}`, params).then(res => {
        // console.log(res)
        if (res.status == 200 && res.data.code == 200) {
          resolve(res.data.data);
        } else {
          reject(res.data)
          console.log(res);
        }
      });
    }
  })
};

// 获得我的信息 
const getMe = () => {
  const token = CONFIG.bot_token;
  const host = 'https://www.xxx.xxx/api/bot/';
  const url = `${host}${token}/getMe`
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => {
      // console.log(res)
      // alert("getMe"+res.data.ok);

      if (res.status === 200 && res.data.ok == true) {
        resolve(res.data.result)
      } else {
        reject(res)
      }
    })
  })
}

// 存储授权用户信息
const saveUserInfo = (oauthCode) => {
  return new Promise((resolve, reject) => {
    http("POST", "oauth/saveUserInfo", {
      oauthCode,
      gameId: window.fbObject.gameId,
    },[window.fbObject.gameId]).then((res) => {
      resolve(res)
    }).catch(err=>{
      console.log('----err-----',err);
    });
  })
}

// 判断用户是否授权
// 返回用户信息
const judgeAuthorization = () => {
  // alert('judgeAuthorization')
  // md5加密钥
  let md = md5(String(`userId:${window.fbObject.userConfig.userId},gameId:${window.fbObject.gameId},nickName:${window.fbObject.userConfig.nickname},avatar:${window.fbObject.userConfig.avatar},gender:${window.fbObject.userConfig.gender},${md5key}`))

  return new Promise((resolve, reject) => {
    http('POST', "oauth/judgeAuthorization", {
      userId: window.fbObject.userConfig.userId,
      gameId: window.fbObject.gameId,
      nickName: window.fbObject.userConfig.nickname,
      avatar: window.fbObject.userConfig.avatar,
      gender: window.fbObject.userConfig.gender,
      md5: md
    },[window.fbObject.gameId]).then((res) => {
      // alert(`授权了，${window.fbObject.userConfig.userId}, ${window.fbObject.gameId}`)
      resolve(res)
    }).catch(res => {
      // alert(`XXXXX授权了，${window.fbObject.userConfig.userId}, ${window.fbObject.gameId}, ${JSON.stringify(res)}`)
      // location.href = res.data.requestUrl
      reject()
    })
  })
}

// 查询今日得分总榜
const queryTodayScoreRank = (currentPage) => {
  // alert('查询今日得分总榜')
  return new Promise((resolve, reject) => {
    http("post", "score/queryTodayScoreRank", {
      gameId: window.fbObject.gameId,
      userId: window.fbObject.userConfig.userId,
      serverId: window.fbObject.serverId,
      currentPage,
      pageSize: 10
    },[window.fbObject.gameId]).then((res) => {
      // alert(`${JSON.stringify(res)}`)
      resolve(res)
    }).catch(() => {
      reject()
    });
  })
}

// 查询历史得分总榜
const queryTotalScoreRank = (currentPage) => {
  return new Promise((resolve, reject) => {
    http("post", "score/queryTotalScoreRank", {
      gameId: window.fbObject.gameId,
      userId: window.fbObject.userConfig.userId,
      serverId: window.fbObject.serverId,
      currentPage,
      pageSize: 10
    },[window.fbObject.gameId]).then((res) => {
      resolve(res)
    }).catch(() => {
      reject()
    });
  })
}


// 保存用户游戏得分
const saveGameScore = ({ score }) => {
  // alert(`saveGameScore---${gameId}, ${window.fbObject.userConfig.userId}, ${score}, ${window.fbObject.serverId}`)

  // md5加密钥
  let md = md5(String(`chatId:${window.fbObject.chatId},gameId:${window.fbObject.gameId},userId:${window.fbObject.userConfig.userId},score:${score},serverId:${window.fbObject.serverId},${md5key}`))

  return new Promise((resolve, reject) => {
    http("post", "score/saveGameScore", {
      chatId: window.fbObject.chatId,
      gameId: window.fbObject.gameId,
      userId: window.fbObject.userConfig.userId,//'235048863717658624' || 
      score: score,
      serverId: window.fbObject.serverId,///'238577017241468928'||
      md5: md
    },[window.fbObject.gameId]).then((res) => {
      // alert(`saveGameScore---${gameId}, ${window.fbObject.userConfig.userId}, ${score}, ${window.fbObject.serverId}, ${JSON.stringify(res)}`)
      resolve(res)
    }).catch(e => {
      // alert(`${e}---${JSON.stringify(e)}`)

    });
  })
}

// 炫耀一下，发送消息卡片
const sendMsgCard = (score) => {
  // alert(`saveGameScore---${gameId}, ${window.fbObject.userConfig.userId}, ${score}, ${window.fbObject.serverId}`)
  return new Promise((resolve, reject) => {
    http("post", "msgcard/sendMsgCard", {
      chatId: window.fbObject.chatId,
      userId: window.fbObject.userConfig.userId,//'235048863717658624' || 
      score: score,
    }).then((res) => {
      resolve(res)
    }).catch(e => {
      // alert(`${e}---${JSON.stringify(e)}`)

    });
  })
}

//数据上报 埋点
const buryBites = (params = {}) => {
  const jdlog = CONFIG.jdlog;
  const url = `${jdlog}`
  const data =
    [
      Object.assign(
        {
          log_type: "dlog_app_bot_action_event_fb",
          client_time: getNowFormatString(new Date(), "yyyy-MM-dd HH:mm:ss"),
          user_id: window.fbObject.userConfig.userId, //fanbook 长的用户id，格式示例：166919620245065728
          guild_id: window.fbObject.serverId,
          channel_id: window.fbObject.chatId,  //bot机器人所在的频道的id
          bot_user_id: window.fbObject.gameId, //bot机器人 长id
          user_name: window.fbObject.userName   //用户短id
        },
        params
      )
    ]
    ;
  return new Promise((resolve, reject) => {
    axios.post(url, getBigIntJSONStingify(data,[window.fbObject.gameId])).then(res => {
      resolve(res);
    }).catch(e => {
      reject(e)
    });
  })
}

export {
  http,
  getMe,
  sendMsgCard,
  judgeAuthorization,
  queryTodayScoreRank,
  queryTotalScoreRank,
  saveGameScore,
  saveUserInfo,
  buryBites
}
