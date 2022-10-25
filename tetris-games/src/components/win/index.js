import React from 'react';
import { buryBites } from '../../http';
import './index.scss';


const close = require("../../resource/image/close.png")
export default class Win extends React.Component {
    constructor() {
        super();
        this.state = {
            isSend: false
        }
        // this.show.bind(this)
        // this.rePlay.bind(this)
        // this.close.bind(this)
    }
    show() {
        //点击炫耀一下 数据埋点
        buryBites({
            event_id: "tetris_game_click",
            event_sub_id: 'click_share'
        }).then(res => {
            res.data && console.log('数据埋点-----点击炫耀一下');
        })
        this.setState({
            isSend: true
        })
        this.props.show()
    }
    rePlay() {
        // console.log(this)
         //再来一局 数据埋点
         buryBites({
            event_id: "tetris_game_start"
        }).then(res => {
            res.data && console.log('数据埋点-----再来一局');
        })
        this.props.rePlay();
    }
    close() {
        this.props.close();
    }
    // 结算窗口，点击跳转排名页面
    rank() {
        location.href = "/mp/138519745866498048/273383374205222914/v1/list"
    }
    componentDidMount() {
        document.querySelector(".show").addEventListener('touchstart', this.show.bind(this))
        document.querySelector(".rePlay").addEventListener('touchstart', this.rePlay.bind(this))
        document.querySelector(".win-close").addEventListener('touchstart', this.close.bind(this))
        document.querySelector(".rank").addEventListener('touchstart', this.rank)

        document.querySelector(".show").addEventListener('click', this.show.bind(this))
        document.querySelector(".rePlay").addEventListener('click', this.rePlay.bind(this))
        document.querySelector(".win-close").addEventListener('click', this.close.bind(this))
        document.querySelector(".rank").addEventListener('click', this.rank)
    }
    componentWillUnmount() {
        document.querySelector(".show").removeEventListener('touchstart', this.show.bind(this))
        document.querySelector(".rePlay").removeEventListener('touchstart', this.rePlay.bind(this))
        document.querySelector(".win-close").removeEventListener('touchstart', this.close.bind(this))
        document.querySelector(".rank").removeEventListener('touchstart', this.rank)

        document.querySelector(".show").removeEventListener('click', this.show.bind(this))
        document.querySelector(".rePlay").removeEventListener('click', this.rePlay.bind(this))
        document.querySelector(".win-close").removeEventListener('click', this.close.bind(this))
        document.querySelector(".rank").removeEventListener('click', this.rank)
    }
    rankLevel(num) {
        return num < 10000 ? '新手级别' : '高手'
    }
    render() {
        // const { nickName = '', avatar = '' } = this.props.data
        return (
            <div className='win_mark'>
                <div className="win-container">
                    <div className="win-box">
                        <div className="win-header">
                            <img className="win-img" src={this.props.data && this.props.data.avatar}></img>
                            <p className="win-name">{this.props.data && this.props.data.nickname}</p>
                            <div className="win-rank-level">{this.rankLevel(this.props.popDate && this.props.popDate.score)}</div>
                        </div>
                        <div className="win-context">
                            <div className="win-item">
                                <p className="win-item-h1">本轮得分</p>
                                <p className="win-item-h2">{this.props.popDate && this.props.popDate.score}<span className="new"></span></p>
                            </div>
                            <div className="win-item middle">
                                <p className="win-item-h1">今日最佳</p>
                                <p className="win-item-h2">{this.props.popDate && this.props.popDate.maxScore}</p>
                            </div>
                            <div className="win-item rank">
                                <p className="win-item-h1">当前排名 ></p>
                                <p className="win-item-h2">{this.props.popDate && this.props.popDate.rank}</p>
                            </div>
                        </div>
                        <div className="win-footer">
                            <div className={this.state.isSend ? 'grey btn show' : 'btn show'}>炫耀一下</div>
                            <div className="btn rePlay">再来一局</div>
                        </div>
                        <div className="win-close"><img src={close}></img></div>
                    </div>
                </div>
            </div>

        )
    }
}