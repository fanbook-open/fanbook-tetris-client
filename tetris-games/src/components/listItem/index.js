import React from 'react';

const Item = (props)=>{
    const {index, rank, avatar, nickName, score, isMe, gender} = props.data


    const couponMap = {
        1:require("../../resource/image/coup1.png"),
        2:require("../../resource/image/coup2.png"),
        3:require("../../resource/image/coup3.png"),
    }
    const rankImage = (n) =>{
        if(!n||!score) {
            return '-'
        }
        return couponMap[n] ? <img src={couponMap[n]}></img> : n
    }

    // 性别过滤,显示性别图像
    const sexfilter=((gender)=>{
        if(gender==0){
            return <div style={{width:'100%',height:'100%',textAlign:'center'}}>--</div>
        }else if(gender==1){
            let man=require("../../resource/image/man.png")
            return  <img  style={{width:'100%',height:'100%'}} src={man}></img>
        }else if(gender==2){
            let woman=require("../../resource/image/woman.png")
            return  <img style={{width:'100%',height:'100%'}} src={woman}></img>
        }
    })

    return (
            <div className={index==undefined?'margin_bto':''}>
                <div className={index==undefined?'item_one':'list-item'}>
                    <div className="list-item-num">{ rankImage(index+1 || rank)}</div>
                    <div className={ isMe ? 'list-item-config me' : 'list-item-config' } >
                        <img className="list-item-img" src={avatar}></img>
                        <div className='sexImg'>{sexfilter(gender)}</div>
                        <span  className="list-item-name">{nickName || '-'}</span>
                    </div>

                    <div className="list-item-up">{score || '-'}</div>
                </div>
            </div>
    )

}
export default Item