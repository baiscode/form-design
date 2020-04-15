/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './index.css';
import { Form, Input, InputNumber, Checkbox, Radio, Select, TimePicker, Switch, DatePicker } from 'antd';
import store from '../store/store';

const DiffFormItem = ({ formItem, bindCode, formModel }) => {
  const { TextArea } = Input;
  const { Option } = Select;
  const config = formItem.config;
  switch(formItem.type) {
    case 'TEXT':
      return <Input placeholder={config.placeholder} />
    case 'NUMBER':
      return <InputNumber min={config.min} max={config.max}/>
    case 'TEXTAREA':
      return <TextArea  placeholder={config.placeholder} />
    case 'SELECT':
      return  <Select>
                {config.options.map(option => {
                  return <Option key={option.value}>{option.label}</Option>
                })}
              </Select>
    case 'RADIO':
      return  <Radio.Group>
                {config.options.map(option => {
                  return <Radio value={option.value} key={option.value}>{option.label}</Radio>
                })}
              </Radio.Group>
    case 'CHECKBOX':
      return <Checkbox.Group options={config.options}></Checkbox.Group>
    case 'DATEPICKER':
      return <DatePicker></DatePicker>
    case 'TIMEPICKER':
      return <TimePicker></TimePicker>
    case 'SWITCH':
      return <Switch></Switch>
    case 'UPLOAD':
      return <div></div>
    default:
      return null;
  }
}

class FormItemComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    const { formItemConfig } = this.props;
    const { fontSize, textAlign, fontStyle } = formItemConfig.config
    this.state = {
      boxWidth: '',
      bindCode: formItemConfig.config.bindCode,
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
    const { formItemConfig, activeItem } = this.props;
    document.onkeydown = (e) => {
      if(e.code === 'Delete' && formItemConfig.formItemId === activeItem.formItemId) {
        this.removeFormItem();
      }
    }
    const label = this.labelRef.current;
    this.setState({ boxWidth: `calc(100% - ${label.offsetWidth + 25}px)` });

    const observer = new MutationObserver(() => {
      this.setState({ boxWidth: `calc(100% - ${label.offsetWidth + 25}px)` });
    })
    observer.observe(label, {
      attributes: true,
      subtree: true,
      characterData: true,
    });
    store.subscribe(() => {
      const newState = store.getState();
      this.setState({
        activeItem: newState.activeItem
      })
    })
  }

  componentWillUnmount() {
    document.onkeydown = null;
  }

  static getDerivedStateFromProps(newProps, curState) {
    if(newProps.formItemConfig !== curState.formItemConfig) {
      const config = newProps.formItemConfig.config;
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
    this.props.changeDragData(this.props.formItemConfig);
    this.props.changeInit(false);
  }

  formItemDrop() {
    this.props.formItemDrop(this.props.formItemConfig);
  }

  removeFormItem() {
    this.props.remove(this.props.formItemConfig);
  }

  setActiveFormItem(e) {
    e.stopPropagation();
    this.props.changeActiveItem(this.props.formItemConfig);
  }

  render() {
    const { formItemConfig, formModel } = this.props;
    const { activeItem, boxWidth, bindCode, formLabelStyle } = this.state;
    return (
      <div className={`form-item ${formItemConfig.formItemId === activeItem.formItemId ? 'active' : ''}`} draggable onDragStart={() => this.formItemDrag()} onClick={(e) => this.setActiveFormItem(e)} onDrop={() => this.formItemDrop()}>
        <Form.Item>
          <div className="flex-box">
            <label className={`form-item-label ${formItemConfig.config.isRequired ? 'required': ''}`} style={formLabelStyle} ref={this.labelRef}>{formItemConfig.config.labelName || ''}</label>
            <div className="form-item-box" style={{ width: boxWidth }}>
              <DiffFormItem formItem={formItemConfig} bindCode={bindCode} formModel={formModel}></DiffFormItem>
              <i className={`el-icon-delete remove-icon ${formItemConfig.formItemId !== activeItem.formItemId ? 'hidden-icon': ''}`} onClick={() => this.removeFormItem()}></i>
            </div>
          </div>
        </Form.Item>
      </div>
    )
  }
}

FormItemComponent.propTypes = {
  formItemConfig: PropTypes.object.isRequired,
  formModel: PropTypes.object.isRequired,
  formItemDrop: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired
}

const mapStateToProps = function(state) {
  return {
    activeItem: state.activeItem,
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    changeActiveItem(activeItem) {
      dispatch({
        type: 'SET_ACTIVE_FORMITEM',
        payload: activeItem
      })
    },
    changeDragData(formItemConfig) {
      dispatch({
        type: 'DRAG_FORMITEM_DATA',
        payload: formItemConfig
      })
    },
    changeInit(initDrag) {
      dispatch({
        type: 'INIT_DRAG',
        payload: initDrag
      })
    },
  }
}

const FormItem = connect(
  mapStateToProps,
  mapDispatchToProps
)(FormItemComponent);
export default FormItem;