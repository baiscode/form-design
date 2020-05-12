/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './index.css';
import { Form, Input, InputNumber, Checkbox, Radio, Select, TimePicker, Switch, DatePicker, Upload, Button } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import store from '../../store/store';
import { setActiveData, setInitDrag, setDragData } from '../../store/actionTypes';

class FormItem extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    const { fontSize, textAlign, fontStyle } = this.props.formItem
    this.state = {
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
      const formItem = newProps.formItem;
      return {
        formLabelStyle: {
          textAlign: formItem.textAlign,
          fontWeight: formItem.fontStyle.includes('bold') ? 'bold' : '',
          fontStyle: formItem.fontStyle.includes('italic') ? 'italic': '',
          fontSize: formItem.fontSize + 'px'
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
    const { activeItem, formLabelStyle } = this.state;
    const { type, name, isRequired, labelName, message, attrs, showTime } = formItem;
    return (
      <div className={isProd ? 'prod-form-item' : `dev-form-item ${formItem.formItemId === activeItem.formItemId ? 'active' : ''}`} draggable={!isProd} onDragStart={() => this.formItemDrag()} onClick={(e) => !isProd && this.setActiveFormItem(e)} onDrop={() => this.formItemDrop()}>
          <label className={`form-item-label ${isRequired ? 'required': ''}`} style={formLabelStyle} ref={this.labelRef}>{labelName}</label>
          <div className="form-item-box">
            <Form.Item name={name} rules={isProd ? [{ required: isRequired, message: message }] : []}>
              {(() => {
                switch(type) {
                  case 'TEXT':
                    return <Input {...attrs} />
                  case 'NUMBER':
                    return <InputNumber {...attrs} />
                  case 'TEXTAREA':
                    return <Input.TextArea {...attrs} />
                  case 'SELECT':
                    return  <Select style={{ width: 150 }} {...attrs}></Select>
                  case 'RADIO':
                    return  <Radio.Group {...attrs} />
                  case 'CHECKBOX':
                    return <Checkbox.Group {...attrs} />
                  case 'DATEPICKER':
                    return <DatePicker {...attrs} format={showTime ? 'YYYY-MM-DD HH:ii:ss' : 'YYYY-MM-DD'}/>
                  case 'TIMEPICKER':
                    return <TimePicker />
                  case 'SWITCH': 
                    return <Switch onClick={(checked, e) => e.stopPropagation(e)} {...attrs} />
                  case 'UPLOAD':
                    return <Upload fileList={[]} {...attrs}>
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
          {
            !isProd ? <i className="remove-icon">
                        <DeleteTwoTone twoToneColor="#DC143C" onClick={() => this.removeFormItem()} hidden={formItem.formItemId !== activeItem.formItemId} />
                      </i> : null
          }
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