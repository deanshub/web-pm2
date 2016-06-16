
import { handleActions } from 'redux-actions'

// TODO: replace this with actual ajax
const initialState = require('./initialData')

export default handleActions({
  'add todo' (state, action) {
    return [{
      id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
      completed: false,
      text: action.payload,
    }, ...state]
  },

  'delete todo' (state, action) {
    return state.filter(todo => todo.id !== action.payload )
  },

  'edit todo' (state, action) {
    return state.map(todo => {
      return todo.id === action.payload.id
        ? { ...todo, text: action.payload.text }
        : todo
    })
  },
}, initialState)
