import React from 'react';
import './list.scss';
import {queryTodayScoreRank, queryTotalScoreRank,buryBites} from '../http';
import Item from '../components/listItem';
import Load from '../components/load';

const img = require("../resource/image/top2.jpg")
let toydayLock = false;
let historyLock = false

class List extends React.Component {
  constructor() {
    super();
    this.state = {
      todayList : [{
        index:0,
        avatar: '',
        nickName: '的撒打算的撒多撒大大',
        score:'150',
        isMe: false
      },
        {
          index:0,
          avatar: '',
          nickName: '232432',
          score:'150',
          isMe: false
        },
        {
          index:0,
          avatar: '',
          nickName: '232432',
          score:'150',
          isMe: false
        }
      ],
      todayMe: true,


      // todayList : [],
      // todayMe: false,
      todayPage: 1,
      historyList: [],
      historyMe: false,
      historyPage: 1,
      tab: 'today',
      showLoad: true
    }
  }
  componentWillMount() {
    //进入排行榜 数据埋点
    buryBites({
      event_id:"tetris_page_enter",
      event_sub_id:2
    }).then(res=>{
      res.data && console.log('数据埋点-----进入排行榜');
    })
    this.getTodayData();
  } 
  scroll () {
    const clientHeight = document.querySelector(".list-container").clientHeight;
    const scrollHeight = document.querySelector(".list-container").scrollHeight;
    const scrollTop = document.querySelector(".list-container").scrollTop;
    if(scrollTop + clientHeight > scrollHeight - 200 && !this.state.showLoad){
     
      if(this.state.tab === 'today') {
        if(toydayLock) return false
        this.setState({
          showLoad: true
        })
        queryTodayScoreRank(this.state.todayPage + 1).then((res)=>{
          const todayList = [...this.state.todayList]
          const newtodayList = todayList.concat(res.list)
          this.setState({
            todayList: newtodayList,
            showLoad: false,
            todayPage: this.state.todayPage + 1
          })
          if(todayList.length === newtodayList.length) {
            toydayLock =true
          }
        });
      } else {
        if(historyLock) return false
        this.setState({
          showLoad: true
        })
        queryTotalScoreRank(this.state.historyPage+1).then((res)=>{
          const historyList = [...this.state.historyList]
          const newhistoryList = historyList.concat(res.list)
          this.setState({
            historyList: newhistoryList,
            showLoad: false,
            historyPage:  this.state.historyPage+ 1
          })
          if(historyList.length === newhistoryList.length) {
            historyLock =true
          }
        });
      }
　　}
  }

  componentDidMount() {
    // document.querySelector("list-container")
    document.querySelector(".list-container").addEventListener('scroll',this.scroll.bind(this), true)
  }
  componentWillUnmount () {
    document.querySelector(".list-container").removeEventListener('scroll',this.scroll.bind(this), true)
  }
  getTodayData() {
    queryTodayScoreRank(1).then((res)=>{
      // console.log(res)
      // alert(JSON.stringify(res))
      // 如果自己有分数
      if(res.myScore != null) {
        res.myScore.isMe = true;
      } else {
        // 如果自己没有分数
        // res.myScore = false
        res.myScore={
          index:undefined,
          avatar: window.fbObject.userConfig.avatar,
          nickName: window.fbObject.userConfig.nickname,
          score: '',
          gender:window.fbObject.userConfig.gender,
          isMe: true
        }
      }



        this.setState({
          todayList:res.list,
          todayMe: res.myScore,
          showLoad: false
        })


      this.getHistoryData()
    });
  }
  getHistoryData() {
    queryTotalScoreRank(1).then((res)=>{
      if(res.myScore != null) {
        res.myScore.isMe = true;
      } else {
        res.myScore = false
      }
      this.setState({
        historyList:res.list,
        historyMe: res.myScore
      })
    });
  }
  today() {
    // console.log('today')
    this.state.tab === 'history' && this.changeListBuryBites('today')
    this.setState({
      tab:'today'
    })
  }
  history () {
    this.state.tab === 'today' && this.changeListBuryBites('history')
    this.setState({
      tab:'history'
    })
  }

  //切换排行榜数据埋点
  changeListBuryBites(type){
    buryBites({
      event_id:"tetris_game_click",
      event_sub_id:"click_rank_page",
      event_sub_param:type
    }).then(res=>{
      res.data && console.log('数据埋点-----切换排行榜');
    })
  }

  render () {
    const {todayMe, tab, historyMe } = this.state
    // const isShowMe = Object.keys(todayMe).length > 0
    return (
      <div className="list-container">
        <Load show={this.state.showLoad}></Load>
      <img className="list-top-image" src={img}></img>
      <div className="list-box">
        <div className="list-header">
          <div className={tab === 'today' && 'active'} onClick={this.today.bind(this)}>今日排名</div>
          <div className={tab === 'history' && 'active'} onClick={this.history.bind(this)}>历史排名</div>
        </div>
        {
          tab === 'today' && <div className="list-context">
          { todayMe && <Item data={todayMe} ></Item> }
          {
            this.state.todayList.length > 0 && this.state.todayList.map((item, index)=>{
              const data = { 
                index,
                avatar: item.avatar,
                nickName: item.nickName,
                score: item.score,
                gender:item.gender,
                isMe: item.userId == todayMe.userId
              }
              // console.log(item.userId ,this.state.todayMe)
              return (
                <Item data={data} key={item.userId}></Item>
              )
            })
          }
          {
            this.state.todayList.length === 0 && <div className="nodata">暂无数据</div>
          }
      </div>
        }
                {
          tab === 'history' && <div className="list-context">
          { historyMe && <Item data={historyMe} ></Item>} 
          {
            this.state.historyList.length > 0 && this.state.historyList.map((item, index)=>{
              const data = { 
                index,
                avatar: item.avatar,
                nickName: item.nickName,
                gender:item.gender,
                score: item.score,
                isMe: item.userId == todayMe.userId
              }
              // console.log(item.userId ,this.state.todayMe)
              return (
                <Item data={data} key={item.userId}></Item>
              )
            })
          }
           {
            this.state.historyList.length === 0 && <div className="nodata">暂无数据</div>
          }
      </div>
        }
    </div>
  </div>
    )
  } 
}

export default List