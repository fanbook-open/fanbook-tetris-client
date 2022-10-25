import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { CONFIG } from './config'

import List from './pages/list'
import Game from './pages/game'
import fbUnit from './unit/fb'
import vconsole from 'vconsole'
import "./utils/rem.js";

if (CONFIG.env == 'development') {
  new vconsole()
}

fbUnit.init().then(() => {
  ReactDOM.render(
    <BrowserRouter basename='/mp/138519745866498048/273383374205222914/v1/'>
      <Switch>
        <Route exact path='/' component={Game} />
        <Route exact path='/game' component={Game} />
        <Route exact path='/list' component={List} />
      </Switch>
    </BrowserRouter>,
    document.body
  )
})
