import React from 'react'
import { render } from 'react-dom'
import { Router, hashHistory } from 'react-router'
import routes from './routes/index'

render(
  <Router history={hashHistory} routes={routes}></Router>,
  document.getElementById('app')
)
