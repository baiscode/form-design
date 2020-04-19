import {
  SET_ACTIVE_DATA,
  SET_INIT_DRAG,
  SET_DRAG_DATA,
  SET_DROP_DATA
} from './actionTypes';

const defaultState = {
  activeItem: {},
  initDrag: true,
  dragData: null,
  dropData: null
}

const reducer = (state = defaultState, action) => {
  switch(action.type) {
    case SET_ACTIVE_DATA: 
      return {
        ...state,
        activeItem: action.payload
      }
    case SET_INIT_DRAG:
      return {
        ...state,
        initDrag: action.payload
      }
    case SET_DRAG_DATA:
      return {
        ...state,
        dragData: action.payload
      }
    case SET_DROP_DATA:
      return {
        ...state,
        dropData: action.payload
      }
    default:
      return state;
  }
}

export default reducer;