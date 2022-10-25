import React from 'react';
import Load from '../components/load';
// import { judgeAuthorization } from '../http';
// import { useHistory } from "react-router-dom";
import fbUnit from '../unit/fb';

// const history = useHistory();
class Index extends React.Component {
    componentWillMount () {
        // console.log(this.props)
        // fbUnit.toOAuth().then(()=>{
        //     this.props.history.push("/game")
        // })
        // judgeAuthorization().then(res=>{
        //     localStorage.setItem('userConfig', JSON.stringify(res))
        //     setTimeout(()=>{
        //         this.props.history.push("/game")
        //     })
        // })

    }
    render () {
        return (
            <Load show={true}></Load>
        )
    }
}

export default Index