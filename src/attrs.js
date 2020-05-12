
import { randomId } from './utils';
const TEXT = 'TEXT';
const NUMBER = 'NUMBER';
const SELECT = 'SELECT';
const RADIO = 'RADIO';
const CHECKBOX = 'CHECKBOX';
const TEXTAREA = 'TEXTEXTAREAT';
const DATEPICKER = 'DATEPICKER';
const TIMEPICKER = 'TIMEPICKER';
const SWITCH = 'SWITCH';
const UPLOAD = 'UPLOAD';

const formItems = {
  TEXT: { type: TEXT, labelName: 'Input输入框' }, 
  NUMBER: { type: NUMBER, labelName: 'InputNumber数字框' }, 
  SELECT: { type: SELECT, labelName: 'Select下拉框' },
  RADIO: { type: RADIO, labelName: 'Radio单选框' },
  CHECKBOX: { type: CHECKBOX, labelName: 'Checkbox多选框' },
  TEXTAREA: { type: TEXTAREA, labelName: 'Textarea文本框' },
  DATEPICKER: { type: DATEPICKER, labelName: 'DatePicker日期' },
  TIMEPICKER: { type: TIMEPICKER, labelName: 'TimePicker时间' },
  SWITCH: { type: SWITCH, labelName: 'Switch开关' },
  UPLOAD: { type: UPLOAD, labelName: 'Upload文件' }
};

for(let i in formItems) {
  const value = formItems[i];
  const defConf = {
    isRequired: true,
    fontSize: 14,
    textAlign: 'center',
    fontStyle: [],
    message: `${value.labelName}不能为空`
  };

  Object.assign(value, defConf);
}

const getConf = function(type) {
  let attrs = {};
  switch(type) {
    case TEXT:
      attrs.placeholder = '请输入';
      attrs.maxLength = 50;
      break;
    case NUMBER:
      attrs.max = 1000;
      attrs.min = 0;
      attrs.precision = 0;
      break;
    case SELECT:
      attrs.placeholder = '';
      attrs.options = [];
      break;
    case CHECKBOX:
    case RADIO:
      attrs.options = [];
      break;
    case TEXTAREA:
      attrs.placeholder = '请输入';
      attrs.maxLength = 500;
      break;
    case DATEPICKER:
      attrs.showTime = false;
      break;
    case SWITCH:
      attrs.activeVal = 1;
      attrs.inactiveVal = 0;
      break;
    case UPLOAD:
      attrs.action = '';
      break;
    default:
      break;
  }
  formItems[type].attrs = attrs;
  formItems[type].name = `${type}_${randomId()}`;
  return formItems[type];
}

export {
  formItems,
  getConf
}

