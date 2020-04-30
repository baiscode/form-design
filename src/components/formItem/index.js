/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './index.css';
import { Form, Input, InputNumber, Checkbox, Radio, Select, TimePicker, Switch, DatePicker, Upload, Button } from 'antd';
import { DeleteTwoTone  } from '@ant-design/icons';
import store from '../../store/store';
import { setActiveData, setInitDrag, setDragData } from '../../store/actionTypes';

class FormItem extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    const { fontSize, textAlign, fontStyle } = this.props.formItem.config
    this.state = {
      boxWidth: '',
      activeItem: this.props.activeItem,
      formLabelStyle:  {
        textAlign: textAlign,
        fontWeight: fontStyle.includes('bold') ? 'bold' : '',
        fontStyle: fontStyle.includes('italic') ? 'italic': '',
        fontSize: fontSize + 'px'
      }
    }
    this.labelRef = React.createRef();
  }

  componentDidMount() {
    const { formItem, activeItem } = this.props;
    document.onkeydown = (e) => {
      if(e.code === 'Delete' && formItem.formItemId === activeItem.formItemId) {
        this.removeFormItem();
      }
    }

    this.unsubscribe = store.subscribe(() => {
      const { activeItem } = store.getState();
      if(activeItem !== this.state.activeItem) {
        this.setState({ activeItem: activeItem })
      }
    })
  }

  componentWillUnmount() {
    document.onkeydown = null;
    this.unsubscribe();
  }

  static getDerivedStateFromProps(newProps, curState) {
    if(newProps.formItem !== curState.formItem) {
      const config = newProps.formItem.config;
      return {
        formLabelStyle: {
          textAlign: config.textAlign,
          fontWeight: config.fontStyle.includes('bold') ? 'bold' : '',
          fontStyle: config.fontStyle.includes('italic') ? 'italic': '',
          fontSize: config.fontSize + 'px'
        }
      }
    }
    return null;
  }

  formItemDrag() {
    this.props.changeDragData(this.props.formItem);
    this.props.changeInit(false);
  }

  formItemDrop() {
    this.props.formItemDrop(this.props.formItem);
  }

  removeFormItem() {
    this.props.remove(this.props.formItem);
  }

  setActiveFormItem(e) {
    e.stopPropagation();
    this.props.changeActiveItem(this.props.formItem);
  }

  render() {
    const { formItem, isProd } = this.props;
    const { activeItem, boxWidth, formLabelStyle } = this.state;
    const config = formItem.config;
    return (
      <div className={`form-item ${formItem.formItemId === activeItem.formItemId ? 'active' : ''}`} draggable onDragStart={() => this.formItemDrag()} onClick={(e) => this.setActiveFormItem(e)} onDrop={() => this.formItemDrop()}>
          <label className={`form-item-label ${formItem.config.isRequired ? 'required': ''}`} style={formLabelStyle} ref={this.labelRef}>{formItem.config.labelName || ''}</label>
          <div className="form-item-box" style={{ width: boxWidth }}>
            <Form.Item name={config.bindCode} rules={isProd ? [{ required: config.isRequired, message: config.message }] : []}>
              {(() => {
                switch(formItem.type) {
                  case 'TEXT':
                    return <Input placeholder={config.placeholder}  />
                  case 'NUMBER':
                    return <InputNumber min={config.min} max={config.max} precision={config.precision} />
                  case 'TEXTAREA':
                    return <Input.TextArea placeholder={config.placeholder} />
                  case 'SELECT':
                    return  <Select style={{ width: 150 }} placeholder={config.placeholder}>
                              {config.options.map(option => {
                                return <Select.Option value={option.value} key={option.value}>{option.label}</Select.Option>
                              })}
                            </Select>
                    
                  case 'RADIO':
                    return  <Radio.Group>
                              {config.options.map(option => {
                                return <Radio value={option.value} key={option.value}>{option.label}</Radio>
                              })}
                            </Radio.Group>
                  case 'CHECKBOX':
                    return <Checkbox.Group options={config.options} />
                  case 'DATEPICKER':
                    return <DatePicker showTime={config.dateType === 'datetime'} format={config.dateType === 'datetime' ? 'YYYY-MM-DD HH:ii:ss' : 'YYYY-MM-DD'}/>
                  case 'TIMEPICKER':
                    return <TimePicker />
                  case 'SWITCH': 
                    return <Switch onClick={(checked, e) => e.stopPropagation(e)} />
                  case 'UPLOAD':
                    return <Upload action={config.action} fileList={[]}>
                      <Button>
                        点击上传
                      </Button>
                    </Upload>
                  default:
                    return null;
                }
              })()}
            </Form.Item>
          </div>
          <i className="remove-icon">
            <DeleteTwoTone twoToneColor="#DC143C" onClick={() => this.removeFormItem()} hidden={formItem.formItemId !== activeItem.formItemId} />
          </i>
      </div>
    )
  }
}

FormItem.propTypes = {
  formItem: PropTypes.object.isRequired,
  formItemDrop: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  isProd: PropTypes.bool.isRequired
}

const mapStateToProps = function(state) {
  return {
    activeItem: state.activeItem,
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    changeActiveItem(activeItem) {
      dispatch(setActiveData(activeItem))
    },
    changeDragData(formItem) {
      dispatch(setDragData(formItem))
    },
    changeInit(initDrag) {
      dispatch(setInitDrag(initDrag))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormItem);