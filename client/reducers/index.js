
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import actions from './actions'

export default combineReducers({
  routing,
  actions,
})
