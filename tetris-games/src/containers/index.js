import React from 'react';
import {
  connect,
} from 'react-redux';
import classnames from 'classnames';

import style from './index.less';

import Matrix from '../components/matrix';
import Decorate from '../components/decorate';
import Number from '../components/number';
import Next from '../components/next';
import Music from '../components/music';
import Pause from '../components/pause';
import Point from '../components/point';
import Logo from '../components/logo';
import Keyboard from '../components/keyboard';
import Win from '../components/win';
import Load from '../components/load';
import listenState from '../unit/listenState';

import {
  transform,
  // lastRecord,
  // speeds,
  i18n,
  lan,
} from '../unit/const';
import {
  visibilityChangeEvent,
  isFocus,
} from '../unit/';
import states from '../control/states';
import { saveGameScore, sendMsgCard, buryBites } from '../http';


let sendMsgCardLock = false
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
      showBox: false,
      userConfig: window.fbObject.userConfig,
      showLoad: false,
      popDate: null,
      tips: false,
      myMaxScore: ''
    };
  }
  componentWillMount() {
    window.addEventListener('resize', this.resize.bind(this), true);

    listenState.on('gameEnd', (score) => {
      sendMsgCardLock = false;
      this.setState({
        showLoad: true
      })
      // 发送得分
      saveGameScore({
        score
      }).then(res => {
        // console.log(res)
        //结束游戏数据埋点
        buryBites({
          event_id: "tetris_game_over",
          event_sub_id: score,
          event_sub_param: res.rank,
          ext_json: {
            "top_score": res.myMaxScore
          }
        }).then(rest => {
          // 显示弹窗
          this.setState({
            showLoad: false,
            popDate: {
              maxScore: res.todayMaxScore,
              score,
              rank: res.rank
            },
            myMaxScore: res.myMaxScore, // 本人最高的人
            showBox: true
          })
          rest.data && console.log('数据埋点-----结束游戏');
        })
      })

    })

    //进入游戏界面数据埋点
    buryBites({
      event_id: "tetris_page_enter",
      event_sub_id: 1
    }).then(res => {
      res.data && console.log('数据埋点-----进入游戏界面');
    })
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this));
  }
  componentDidMount() {
    // console.log(this.props)
    // console.log(getQueryString('id'))
    if (visibilityChangeEvent) { // 将页面的焦点变换写入store
      document.addEventListener(visibilityChangeEvent, () => {
        states.focus(isFocus());
      }, false);
    }

    // if (lastRecord) { // 读取记录
    //   if (lastRecord.cur && !lastRecord.pause) { // 拿到上一次游戏的状态, 如果在游戏中且没有暂停, 游戏继续
    //     const speedRun = this.props.speedRun;
    //     let timeout = speeds[speedRun - 1] / 2; // 继续时, 给予当前下落速度一半的停留时间
    //     // 停留时间不小于最快速的速度
    //     timeout = speedRun < speeds[speeds.length - 1] ? speeds[speeds.length - 1] : speedRun;
    //     // states.auto(timeout);
    //   }
    //   if (!lastRecord.cur) {
    //     states.overStart();
    //   }
    // } else {
    //   states.overStart();
    // }
    states.start();
  }

  resize() {
    this.setState({
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
    });
  }
  close() {
    this.setState({
      showBox: false
    })
    fb.closeWindow();
  }
  goShow() {
    // console.log('goShow')
    if (sendMsgCardLock) return false
    // tips
    this.setState({
      tips: true
    })
    setTimeout(() => {
      this.setState({
        tips: false
      })
    }, 3000)
    sendMsgCardLock = true;
    sendMsgCard(this.state.popDate.score)
  }
  rePlay() {
    this.setState({
      showBox: false
    })
    // console.log(todo)
    // todo.r.down(store)
    setTimeout(() => {
      states.start();
    }, 1000)

  }
  render() {
    let filling = 0;
    const size = (() => {
      const w = this.state.w;
      const h = this.state.h;
      const ratio = h / w;
      let scale;
      let css = {};
      if (ratio < 1.5) {
        scale = h / 960;
      } else {
        scale = w / 640;
        filling = (h - (960 * scale)) / scale / 3;
        css = {
          paddingTop: Math.floor(filling) + 42,
          paddingBottom: Math.floor(filling),
          marginTop: Math.floor(-480 - (filling * 1.5)),
        };
      }
      css[transform] = `scale(${scale})`;
      return css;
    })();

    return (
      <div
        className={style.app}
        style={size}
      >
        <div className={classnames({ [style.rect]: true, [style.drop]: this.props.drop })}>
          <div className={style.userConfig}>
            <img src={this.state.userConfig && this.state.userConfig.avatar}></img>
            {this.state.userConfig && this.state.userConfig.nickname}
          </div>
          <Decorate />
          {
            this.state.tips && <div className={style.tip} >分享成功,请到频道查看</div>
          }
          <div className={style.screen}>
            <div className={style.panel}>
              <Matrix
                matrix={this.props.matrix}
                cur={this.props.cur}
                reset={this.props.reset}
              />
              <Logo cur={!!this.props.cur} reset={this.props.reset} />
              <div className={style.state}>
                {/*游戲得分*/}
                <Point cur={!!this.props.cur} point={this.props.points} max={this.state.myMaxScore} />
                <p>{this.props.cur ? i18n.cleans[lan] : i18n.startLine[lan]}</p>
                {/*消除行*/}
                <div style={{maxHeight: '48px', overflow: 'hidden'}}>
                  <Number number={this.props.cur ? this.props.clearLines : this.props.startLines} />
                </div>
                <p>{i18n.level[lan]}</p>
                {/*number级别设置*/}
                <Number
                  number={this.props.cur ? this.props.speedRun : this.props.speedStart}
                  length={1}
                />
                <p>{i18n.next[lan]}</p>
                <Next data={this.props.next} />
                <div className={style.bottom}>
                  <Music data={this.props.music} />
                  {/*暂停*/}
                  <Pause data={this.props.pause} />
                  <Number time />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Load show={this.state.showLoad}></Load>
        <Keyboard filling={filling} keyboard={this.props.keyboard} />
        {this.state.showBox && <Win show={this.goShow.bind(this)} rePlay={this.rePlay.bind(this)} close={this.close.bind(this)} popDate={this.state.popDate} data={this.state.userConfig}></Win>}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  pause: state.get('pause'),
  music: state.get('music'),
  matrix: state.get('matrix'),
  next: state.get('next'),
  cur: state.get('cur'),
  speedStart: state.get('speedStart'),
  speedRun: state.get('speedRun'),
  startLines: state.get('startLines'),
  clearLines: state.get('clearLines'),
  points: state.get('points'),
  max: state.get('max'),
  reset: state.get('reset'),
  drop: state.get('drop'),
  keyboard: state.get('keyboard'),
  all: state,
});

export default connect(mapStateToProps)(App);
