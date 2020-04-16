import React, { useState } from 'react';
import './index.css';
import Cell from '../cell';
import { connect } from 'react-redux';
import { Form, Input, InputNumber, Checkbox, Radio, Table, Switch, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import store from '../store/store';

const objCopy = function(target) {
  if(typeof target === 'object') {
    const copyTarget = Array.isArray(target) ? [] : {};
    for(let i in target) {
      copyTarget[i] = objCopy(target[i]);
    }
    return copyTarget;
  }else {
    return target;
  }
}

const addIcon = (addRow) => {
  return <PlusCircleOutlined onClick={() => addRow()}/>
}

const TextFormItem = () => {
  return <section>
            <Form.Item label="占位文本" name="placeholder">
              <Input placeholder="请输入占位文本" />
            </Form.Item>
         </section>  
}

const NumberFormItem = () => {
  return  <section>
            <Form.Item label="最大值" name="max">
              <InputNumber />
            </Form.Item>
            <Form.Item label="最小值" name="min">
              <InputNumber />
            </Form.Item>
          </section>
}

const DatePickerFormItem = () => {
  return <section>
          <Form.Item label="显示类型" name="dateType">
            <Radio.Group size="small">
              <Radio.Button label="date">日期</Radio.Button>
              <Radio.Button label="datetime">日期时间</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="日期格式" name="format">
            <Input />
          </Form.Item>
        </section>
}

const SwitchFormItem = () => {
  return <section>
          <Form.Item label="打开值" name="activeVal">
            <Input />
          </Form.Item>
          <Form.Item label="关闭值" name="inactiveVal">
            <Input />
          </Form.Item>
        </section>
}
const UploadFormItem = () => {
  return <section>
          <Form.Item label="上传地址" name="action">
            <Input placeholder="请输入上传地址" />
          </Form.Item>
          <Form.Item label="提示" name="tip">
            <Input placeholder="请输入提示" />
          </Form.Item>
        </section>
}

const CheckFormItem = ({ formModel }) => {
  const addRow = () => {
    console.log(formModel);
  }
  const columns = [
    {
      title: '名称',
      dataIndex: 'label'
    },
    {
      title: '值',
      dataIndex: 'value'
    },
    {
      title: addIcon(addRow)
    }
  ]
  return <section>
            <Form.Item label="选项">
              <Table columns={columns}></Table>
            </Form.Item>
         </section>
}


const SelectFormItem = ({ formModel, addOption }) => {
  const [options, setOptions] = useState([]);
  const addRow = async function() {
    await addOption();
    const options = objCopy(formModel.options);
    options.forEach((item, index) => {
      item.key = String(index);
    })
    setOptions(options);
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'label',
      key: 'label',
      render(text, record, index) {
        return <Input defaultValue={text} size="mini"/>
      }
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      render(text, record, index) {
        return <Input defaultValue={text} size="mini"/>
      }
    },
    {
      title: addIcon(addRow),
      dataIndex: 'addBtn',
      key: 'addBtn'
    }
  ]

  return <section>
          <Form.Item label="占位文本" name="placeholder">
            <Input placeholder="请输入占位文本"></Input>
          </Form.Item>
          <Form.Item label="选项">
            <Table columns={columns} dataSource={options} pagination={false}></Table>
          </Form.Item>
        </section>
}


const FormItem = ({ formItemType, formModel, addOption }) => {
  switch (formItemType) {
    case 'TEXT':
    case 'TEXTAREA':
      return  <TextFormItem formModel={formModel}></TextFormItem>
    case 'NUMBER':
      return  <NumberFormItem formModel={formModel}></NumberFormItem>
    case 'DATEPICKER':
      return  <DatePickerFormItem formModel={formModel}></DatePickerFormItem>
    case 'SWITCH':
      return  <SwitchFormItem formModel={formModel}></SwitchFormItem>
    case 'UPLOAD':
      return  <UploadFormItem formModel={formModel}></UploadFormItem>
    case 'CHECKBOX':
    case 'RADIO':
      return  <CheckFormItem formModel={formModel} addOption={addOption}></CheckFormItem>
    case 'SELECT':
      return <SelectFormItem formModel={formModel} addOption={addOption}></SelectFormItem>
    default:
      return null
  }
}

class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      layoutData: null,
      mainData: [],
      cellConfig: null,
      formModel: {},
      confForm: {},
      formItemType: '',
      formRules: {},
      activeItem: {}
    }
    this.dragData = {};
    this.dropData = {};
    this.defaultConfig = {
      'labelName': '',
      'fontSize': 14,
      'textAlign': 'center',
      'bindCode': '',
      'fontStyle': [],
    }
    this.confFormRef = React.createRef();
  }

  componentDidMount() {
    store.subscribe(() => {
      const newState = store.getState();
      const { activeItem, dragData, dropData } = newState;
      if(activeItem !== this.props.activeItem) {
        const config = activeItem.config || this.defaultConfig;
        this.setState({ confForm: config, formItemType: activeItem.type  });
        this.confFormRef.current.setFieldsValue(config);
      }
      if(dragData !== this.dragData) this.dragData = newState.dragData;
      if(dropData !== this.dropData) this.dropData = newState.dropData;
    })
  }

  randomId(){
    let randomId = '';
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'A', 'B', 'C', 'D', 'E', 'F'];
    for (let i = 1; i <= 10; i++){
      randomId += arr[Math.ceil(Math.random() * 15)] ;
    }
    return randomId;
  }
    
  formItemDrag(type) {
    this.setState({ dragType: 'formItem' });
    const config = {
      bindCode: 'name_' + this.randomId(),
      isRequired: true,
      message: ''
    }
    switch(type) {
      case 'TEXT': 
        config.labelName = '输入框';
        config.placeholder = '';
        break;
      case 'NUMBER': 
        config.max = 1000;
        config.min = 0;
        config.labelName = '数字框';
        break;
      case 'SELECT': 
        config.options = [];
        config.labelName = '下拉框';
        config.placeholder = '';
        break;
      case 'RADIO': 
        config.options = [];
        config.labelName = '单选框';
        break;
      case 'CHECKBOX': 
        config.options = [];
        config.labelName = '多选框';
        break;
      case 'TEXTAREA': 
        config.maxLength = 100;
        config.labelName = '文本框';
        config.placeholder = '';
        break;
      case 'DATEPICKER': 
        config.dateType = 'date';
        config.labelName = '日期选择';
        break;
      case 'TIMEPICKER':
        config.labelName = '时间选择';
        break;
      case 'SWITCH': 
        config.labelName = '开关';
        config.activeVal = 1;
        config.inactiveVal = 0;
        break;
      case 'UPLOAD':
        config.action = '';
        config.labelName = '文件上传';
        config.tip = '';
        break;
      default:
        break;
    };
    const rule = {
      [config.bindCode]: { required: true, message: config.message }
    }
    const formItemConfig = {
      type: type,
      formItemId: this.randomId(),
      config: Object.assign({}, this.defaultConfig, config)
    }
    this.setState({
      formItemConfig: formItemConfig,
      formRules: Object.assign({}, this.state.formRules, rule)
    })
    this.props.changeDragData(formItemConfig);
    // this.props.changeFormItemData(formItemConfig);
    this.props.changeInit(true);
  }

  mainDrop() {
    const cellId = this.randomId();
    const mainData = this.state.mainData;
    mainData.push({
      cellId: cellId,
      children: [Object.assign({}, this.state.formItemConfig, { pCellId: cellId })]
    })
    this.setState({ mainData: mainData })
  }

  mainDragOver(e) {
    e.preventDefault();
  }

  // 删除原先cell中的formItem
  removeOriFormItem() {
    const { mainData } = this.state;
    const oriCell = mainData.find(cell => {
      return cell.cellId === this.dragData.pCellId;
    })
    if(!oriCell) return false;
    oriCell.children.forEach((formItem, index) => {
      if(formItem.formItemId === this.dragData.formItemId) {
        oriCell.children.splice(index, 1);
      }
    })
    // 如果当前行中没有任何表单元素，则删除当前行
    if(!oriCell.children.length) {
      setTimeout(() => {
        this.removeCell(oriCell);
      }, 300)
    }
  }

  changeFormItemPos() {
    const { mainData } = this.state;
    const oriCell = mainData.find(cell => {
      return cell.cellId === this.dragData.pCellId;
    })
    if(!oriCell) return false;
    const oriChildren = oriCell.children;
    const dragIndex = oriChildren.indexOf(this.dragData);
    const dropIndex = oriChildren.indexOf(this.dropData);
    if(dragIndex > -1 && dropIndex > -1) {
      [ oriChildren[dragIndex], oriChildren[dropIndex] ] = [ oriChildren[dropIndex], oriChildren[dragIndex] ]
    }
  }

  requireChange(value) {
    const { activeItem, formRules } = this.state;
    const config = activeItem.config;
    if(value) {
      const rule = {
        [config.bindCode]: { required: true, message: config.message }
      }
      this.setState({
        formRules: Object.assign({}, formRules, rule)
      })
    }else {
      // this.setState((state, props) => {
      //   delete state.formRules[config.bindCode];
      //   return state;
      // })
    }
  }

  // 设置formModel
  setFormModel() {
    const { mainData, formModel } = this.state;
    const formItems = [];
    mainData.forEach(data => {
      formItems.push(...data.children);
    })
    formItems.forEach((item) => {
      if(item.config.bindCode) {
        let defaultVal;
        switch(item.type) {
          case 'NUMBER': defaultVal = 0; break;
          case 'SWITCH':  defaultVal = 1; break;
          case 'CHECKBOX': defaultVal = []; break;
          case 'UPLOAD': defaultVal = []; break;
          default: defaultVal = '';
        } 
        this.setState({
          formModel: Object.assign({}, formModel, { [item.config.bindCode]: defaultVal})
        })
      }
    })
  }

  confFormChange(changeVal) {
    const key = Object.keys(changeVal);
    const confForm = this.state.confForm;
    if(!(key in confForm)) return;
    confForm[key] = changeVal[key];
    this.setState({ confForm: confForm });
  }

  addOption() {
    const { confForm } = this.state;
    if(!confForm.bindCode.length) {
      message({ message: '请先填写字段名', type: 'warning' });
      return false;
    }
    confForm.options.push({ label: '', value: '' });
    this.setState({ confForm: confForm });
  }

  removeOption(row) {
    const { confForm } = this.state;
    const optionIndex = confForm.options.indexOf(row);
    if(optionIndex > -1) confForm.options.splice(optionIndex, 1);
  }

  removeCell(cell) {
    const mainData = this.state.mainData;
    const cellIndex = mainData.indexOf(cell);
    mainData.splice(cellIndex, 1)
    this.setState({ mainData: mainData });
  }

  clearActive() {
    this.props.changeActiveItem({});
  }

  msgChange() {
    const { formRules, confForm } = this.state;
    const targetRule = Object.entries(formRules).find(([key]) => {
      return key === confForm.bindCode;
    })
    // 修改非空提示信息
    if(!targetRule) return;
    formRules[targetRule[0]].message = confForm.message;
  }

  getFormModel() {
    return {
      formModel: this.state.formModel,
      formRules: this.state.formRules
    }
  }

  render() {
    const state = this.state;
    const confCheckboxOptions = [
      { label: '加粗', value: 'bold' },
      { label: '倾斜', value: 'italic' }
    ];
    const formItems = [
      {type: 'TEXT', name: 'Input输入框'}, 
      {type: 'NUMBER', name: 'InputNumber数字框'}, 
      {type: 'SELECT', name: 'Select下拉框'},
      {type: 'RADIO', name: 'Radio单选框'},
      {type: 'CHECKBOX', name: 'Checkbox多选框'},
      {type: 'TEXTAREA', name: 'Textarea文本框'},
      {type: 'DATEPICKER', name: 'DatePicker日期选择'},
      {type: 'TIMEPICKER', name: 'TimePicker时间选择'},
      {type: 'SWITCH', name: 'Switch开关'},
      {type: 'UPLOAD', name: 'Upload文件上传'}
    ];

    return (
      <div className="main">
        <div className="layout-left">
          {
            formItems.map(formItem => {
              return (
                <div className="formitem-item" key={formItem.type} draggable onDragStart={ () => this.formItemDrag(formItem.type)}>
                  {formItem.name}
                </div>
              )
            })
          }
        </div>
        <div className="layout-center">
          <div className="form-container" onDragOver={(e) => this.mainDragOver(e) } onDrop={() => this.mainDrop()} onClick={() => this.clearActive()}>
            <Form name="mainForm">              
              {
                state.mainData.map(cellData => {
                  return <Cell 
                          key={cellData.cellId}
                          cellData={cellData}
                          formModel={state.formModel}
                          removeOriFormItem={() => this.removeOriFormItem() }
                          changeFormItemPos={() => this.changeFormItemPos() }
                          removeCell={this.removeCell.bind(this)}
                        ></Cell>
                })
              }
            </Form>
          </div>
        </div>
        <div className="layout-right">
          <div className="conf-form">
            <Form name="confForm" ref={this.confFormRef} onValuesChange={(changeVal, allVal) => this.confFormChange(changeVal, allVal)}>
              <Form.Item label="字段名" name="bindCode">
                <Input placeholder="请输入字段名" onBlur={() => this.setFormModel()} />
              </Form.Item>
              <Form.Item label="标签名" name="labelName">
                <Input placeholder="请输入标签名" />
              </Form.Item>
              <Form.Item label="标签字号" name="fontSize">
                <InputNumber />
              </Form.Item>
              <Form.Item label="标签字体" name="fontStyle">
                <Checkbox.Group options={confCheckboxOptions} size="small"></Checkbox.Group>
              </Form.Item>
              <Form.Item label="标签对齐" name="textAlign">
                <Radio.Group size="small">
                  <Radio.Button value="left">左对齐</Radio.Button>
                  <Radio.Button value="center">居中</Radio.Button>
                  <Radio.Button value="right">右对齐</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <FormItem 
                formItemType={state.formItemType} 
                formModel={state.confForm}
                addOption={() => this.addOption()}
              ></FormItem>

              <Form.Item label="是否必填" name="isRequired" shouldUpdate>
                <Switch checked={state.confForm.isRequired} onChange={() => this.requireChange()}></Switch>
              </Form.Item>
              {
                state.confForm.isRequired ? 
                  <Form.Item label="非空提示" name="message" shouldUpdate>
                    <Input placeholder="请输入字段为空时的提示" onBlur={() => this.msgChange()} />
                  </Form.Item> : null
              }
              
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    dragData: state.dragData,
    dropData: state.dropData,
    activeItem: state.activeItem,
  }
}

const mapDispathToProps = function(dispatch) {
  return {
    changeDragData(formItemConfig) {
      dispatch({
        type: 'DRAG_FORMITEM_DATA',
        payload: formItemConfig
      })
    },
    // changeFormItemData(formItemData) {
    //   dispatch({
    //     type: 'FORM_ITEM_DATA',
    //     payload: formItemData
    //   })
    // },
    changeInit(initDrag) {
      dispatch({
        type: 'INIT_DRAG',
        payload: initDrag
      })
    },
    changeActiveItem(activeItem) {
      dispatch({
        type: 'SET_ACTIVE_FORMITEM',
        payload: activeItem
      })
    }
  }
}

const Main = connect(
  mapStateToProps,
  mapDispathToProps
)(MainComponent);
export default Main;

