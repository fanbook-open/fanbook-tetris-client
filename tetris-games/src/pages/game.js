import React from 'react';
// import { render } from 'react-dom';
import { Provider } from 'react-redux'
import store from '../store/index.js'
import App from '../containers/index.js'
import '../unit/const.js'
import '../control/index.js'
import { subscribeRecord } from '../unit'

subscribeRecord(store) // 将更新的状态记录到localStorage

class Game extends React.Component {
  componentWillMount () {
    // console.log(this)

  }
  render() {
    return (
      <Provider store={store}>
      <App />
    </Provider>
    )

  }
}

export default Game
