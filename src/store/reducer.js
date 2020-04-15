import {
  SET_ACTIVE_FORMITEM,
  // FORM_ITEM_DATA,
  INIT_DRAG,
  DRAG_FORMITEM_DATA,
  DROP_FORMITEM_DATA
} from './actions';

const defaultState = {
  activeItem: {},
  formItemData: null,
  initDrag: true,
  dragData: null,
  dropData: null
}

const reducer = (state = defaultState, action) => {
  switch(action.type) {
    case SET_ACTIVE_FORMITEM: 
      state.activeItem = action.payload;
      break;
    // case FORM_ITEM_DATA:
    //   state.formItemData = action.payload;
    //   break;
    case INIT_DRAG:
      state.initDrag = action.payload;
      break;
    case DRAG_FORMITEM_DATA:
      state.dragData = action.payload;
      break;
    case DROP_FORMITEM_DATA:
      state.dropData = action.payload;
      break;
    default:
      return state;
  }
  return state;
}

export default reducer;