export const SET_ACTIVE_DATA = 'SET_ACTIVE_DATA';
export const SET_INIT_DRAG = 'SET_INIT_DRAG';
export const SET_DRAG_DATA = 'SET_DRAG_DATA';
export const SET_DROP_DATA = 'SET_DROP_DATA';

export function setActiveData(payload) {
  return {
    type: SET_ACTIVE_DATA,
    payload: payload
  }
}

export function setInitDrag(payload) {
  return {
    type: SET_INIT_DRAG,
    payload: payload
  }
}

export function setDragData(payload) {
  return {
    type: SET_DRAG_DATA,
    payload: payload
  }
}

export function setDropData(payload) {
  return {
    type: SET_DROP_DATA,
    payload: payload
  }
}