import { useEffect, useState } from 'react'
import { DailyChallenges, DailyList } from '@/pages'
import { CONFIG } from '@/utils'
import http from '@/api/http'
import { judgeAuthorization, getMe, searchConfig } from '@/api'
import { Tabs, Dialog,Toast } from 'antd-mobile'
import './App.less';

function App() {
  const [isLogin, setIsLogin] = useState(false)
  const [config, setConfig] = useState([])
  const [guildId, setGuildId] = useState('')
  const [isFinish, setIsFinish] = useState(false)

  useEffect(() => {
    initOAuth();
  }, [])

  //初始化
  const initOAuth = () => {
    const fb = window.fb;
    Promise.all([fb.getCurrentGuild(), fb.getUserInfo(), fb.getCurrentChannel(), getMe(CONFIG.bot_token)]).then(res => {
      setGuildId(res[0].id);//存储服务器id
      // 获取游戏服务后台接口是否授权

      //判断服务器拥有者是否与配置者一直
      if (res[0].ownerId !== res[1].userId) {
        Dialog.alert({
          content: '无权限',
          onConfirm: () => {
            try {
              //关闭小程序
              fb.closeWindow();
            } catch {
              return
            }
          }
        })
        return;
      }
      judgeAuthorization(
        res[1].userId,
        String(res[3].id),
        res[1].nickname,
        res[1].avatar,
        res[1].gender,
        CONFIG.md5_key
      ).then(() => {
        setIsLogin(true);//授权成功
        getConfig(res[0].id);//获取配置信息
      }).catch(() => {
        //拉取授权
        toOAuth(String(res[3].id), res[0].id);
      })
    })
  }

  //授权方法
  const toOAuth = (gameid, serverId) => {
    const fb = window.fb;
    fb.oAuth({ 'oAuthUrl': CONFIG.web_host }).then(function (res) {
      if (res.data && res.data.code) {
        http("POST", "oauth/saveUserInfo", {
          oauthCode: res.data.code,
          gameId: gameid,
        }, [gameid]).then((res) => {
          setIsLogin(true)
          getConfig(serverId)//获取配置信息
        })
      } else {
        try {
          //关闭小程序
          fb.closeWindow();
        } catch {
          Toast.show({
            icon: 'fail',
            content: '授权失败'
          })
        }
      }
    });
  }

  //查询积分配置
  const getConfig = id => {
    searchConfig(id).then(res => {
      setConfig(res ?? []);
      setIsFinish(true);
    })
  }

  return (
    <div className="App">
      {
        isLogin &&
        <Tabs
          activeLineMode='fixed'
          style={{
            '--fixed-active-line-width': '49vw',
          }}
          onChange={key => {
            getConfig(guildId)
          }}
        >
          <Tabs.Tab title='每日挑战' key='dailyChallenges' >
            {
              isFinish &&
              <DailyChallenges guildId={guildId} config={config} getConfig={getConfig} />
            }
          </Tabs.Tab>
          <Tabs.Tab title='每日排行榜' key='dailyList'>
            {
              isFinish &&
              <DailyList guildId={guildId} config={config} getConfig={getConfig} />
            }
          </Tabs.Tab>
        </Tabs>
      }
    </div>
  );
}

export default App;
