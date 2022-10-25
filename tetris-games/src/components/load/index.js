import React from 'react';

import "./index.scss"


const load = (props)=>{
    return(
        <div className="load-container" style={{display: props.show ? 'block' : 'none' }}>
            <div className="load">
                <div className="loader">加载中...</div>
            </div>
        </div>
    )
}

export default load