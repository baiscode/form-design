import './App.css';
import React, { useState } from 'react';
import './index.css';
import { connect } from 'react-redux';
import { Form, Input, InputNumber, Checkbox, Radio, Table, Switch, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import store from './store/store';
import Cell from './components/cell';

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

const randomId = function(){
  let randomId = '';
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'A', 'B', 'C', 'D', 'E', 'F'];
  for (let i = 1; i <= 10; i++){
    randomId += arr[Math.ceil(Math.random() * 15)] ;
  }
  return randomId;
}

const addIcon = (changeOption) => {
  return <PlusCircleOutlined onClick={() => changeOption()}/>
}

const TextItem = () => {
  return <section>
            <Form.Item label="占位文本" name="placeholder">
              <Input placeholder="请输入占位文本" />
            </Form.Item>
         </section>  
}

const NumberItem = () => {
  return  <section>
            <Form.Item label="最大值" name="max">
              <InputNumber />
            </Form.Item>
            <Form.Item label="最小值" name="min">
              <InputNumber />
            </Form.Item>
            <Form.Item label="精度" name="precision">
              <InputNumber min={0} max={3} />
            </Form.Item>
          </section>
}

const DatePickItem = () => {
  return <section>
          <Form.Item label="显示类型" name="dateType">
            <Radio.Group size="small" buttonStyle="solid">
              <Radio.Button value="date">日期</Radio.Button>
              <Radio.Button value="datetime">日期时间</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </section>
}

const SwitchItem = () => {
  return <section>
          <Form.Item label="打开值" name="activeVal">
            <Input />
          </Form.Item>
          <Form.Item label="关闭值" name="inactiveVal">
            <Input />
          </Form.Item>
        </section>
}
const UploadItem = () => {
  return <section>
          <Form.Item label="上传地址" name="action">
            <Input placeholder="请输入上传地址" />
          </Form.Item>
          <Form.Item label="提示" name="tip">
            <Input placeholder="请输入提示" />
          </Form.Item>
        </section>
}

const OptionTable = ({ modelOptions, setOptions }) => {
  const [options, setState] = useState(modelOptions);
  const changeOption = function(key, value, target) {
    const opts = objCopy(options);
    if(!key) {
      opts.push({label: '', value: '', key: String(randomId())});
    } else {
      const targetOp = opts.find(item => {
        return item.key === target;
      })
      if(!target) return;
      targetOp[key] = value;
    }
    setState(opts);
    setOptions(opts);
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'label',
      key: 'label',
      render(text, record, index) {
        return <Input defaultValue={text} size="mini" onChange={(e) => { changeOption('label', e.target.value, record.key )}} />
      }
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      render(text, record, index) {
        return <Input defaultValue={text} size="mini" onChange={(e) => { changeOption('value', e.target.value, record.key )}} />
      }
    },
    {
      title: addIcon(changeOption),
      dataIndex: 'addBtn',
      key: 'addBtn'
    }
  ]

  return <Table columns={columns} dataSource={options} pagination={false}></Table>
}

const CheckItem = ({ formData, setOptions }) => {
  return <section>
            <Form.Item label="选项">
              <OptionTable modelOptions={formData.options} setOptions={setOptions}></OptionTable>
            </Form.Item>
         </section>
}


const SelectItem = ({ formData, setOptions }) => {
  return <section>
          <Form.Item label="占位文本" name="placeholder">
            <Input placeholder="请输入占位文本"></Input>
          </Form.Item>
          <Form.Item label="选项">
            <OptionTable modelOptions={formData.options} setOptions={setOptions}></OptionTable>
          </Form.Item>
        </section>
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      layoutData: null,
      mainData: [],
      cellConfig: null,
      confForm: {},
      formItemType: '',
      activeItem: {}
    }
    this.formModel = {};
    this.formRules = {};
    this.dragData = {};
    this.dropData = {};
    this.dragType = '';
    this.defaultConfig = {
      'labelName': '',
      'fontSize': 14,
      'textAlign': 'center',
      'bindCode': '',
      'fontStyle': [],
    }
    this.confFormRef = React.createRef();
    this.mainForm = React.createRef();
    this.cacheCode = '';
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

  componentWillUnmount() {
    store.subscribe(() => {});
  }

    
  formItemDrag(type) {
    this.dragType = type;
    const config = {
      bindCode: 'name_' + randomId(),
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
        config.precision = 0;
        break;
      case 'SELECT': 
        config.options = [];
        config.labelName = '下拉框';
        config.placeholder = '';
        break;
      case 'RADIO': 
      case 'CHECKBOX': 
        config.options = [];
        config.labelName = '单选框';
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
      formItemId: randomId(),
      config: Object.assign({}, this.defaultConfig, config)
    }
    this.setState({ formItemConfig: formItemConfig });
    this.formRules = Object.assign({}, this.formRules, rule)
    this.props.changeDragData(formItemConfig);
    this.props.changeInit(true);
  }

  mainDrop() {
    const cellId = randomId();
    const mainData = this.state.mainData;
    mainData.push({
      cellId: cellId,
      children: [Object.assign({}, this.state.formItemConfig, { pCellId: cellId })]
    })
    this.setState({ mainData: mainData })
    this.setFormKey();
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
    if(!oriCell) return;
    const oriChildren = oriCell.children;
    const dragIndex = oriChildren.indexOf(this.dragData);
    const dropIndex = oriChildren.indexOf(this.dropData);
    if(dragIndex === -1 || dropIndex === -1) return;
    [ oriChildren[dragIndex], oriChildren[dropIndex] ] = [ oriChildren[dropIndex], oriChildren[dragIndex] ]
  }

  requireChange(value) {
    const { activeItem } = this.state;
    const config = activeItem.config;
    if(value) {
      const rule = {
        [config.bindCode]: { required: true, message: config.message }
      }
      this.formRules = Object.assign({}, this.formRules, rule);
    }else {
      delete this.formRules[config.bindCode];
    }
  }

  cacheBindCode() {
    const { confForm } = this.state;
    this.cacheCode = confForm.bindCode;
  }

  changeBindCode() {
    if(this.cacheCode in this.formModel) {
      delete this.formModel[this.cacheCode];
    }
    this.setFormKey();
  }

  // 设置formModel
  setFormKey() {
    const { formItemConfig } = this.state;
    if(!formItemConfig) return;
    const config = formItemConfig.config;
    if(!config.bindCode) {
      message({ message: '请填写字段名', type: 'warning' });
      return;
    }
    let defaultVal;
    switch(this.dragType) {
      case 'NUMBER': defaultVal = 0; break;
      case 'SWITCH':  defaultVal = 1; break;
      case 'CHECKBOX': defaultVal = []; break;
      case 'UPLOAD': defaultVal = []; break;
      default: defaultVal = '';
    }
    this.formModel[config.bindCode] = defaultVal;
  }

  confFormChange(changeVal) {
    const key = Object.keys(changeVal)[0];
    const confForm = this.state.confForm;
    if(!(key in confForm)) return;
    confForm[key] = changeVal[key];
    this.setState({ confForm: confForm });
  }

  mainFormChange(changeVal) {
    const key = Object.keys(changeVal)[0];
    if(!(key in this.formModel)) return;
    this.formModel[key] = changeVal[key];
  }

  setOptions([options]) {
    const { confForm } = this.state;
    if(!confForm.bindCode.length) {
      message({ message: '请先填写字段名', type: 'warning' });
      return false;
    }
    confForm.options = options;
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
    const { confForm } = this.state;
    const targetRule = Object.entries(this.formRules).find(([key]) => {
      return key === confForm.bindCode;
    })
    // 修改非空提示信息
    if(!targetRule) return;
    this.formRules[targetRule[0]].message = confForm.message;
  }

  getFormData() {
    return {
      formModel: this.formModel,
      formRules: this.formRules
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
            <Form name="mainForm" ref={this.mainForm} onValuesChange={(changeVal, allVal) => this.mainFormChange(changeVal, allVal)}>  
              {
                state.mainData.length > 0 && state.mainData.map(cellData => {
                  return <Cell 
                          key={cellData.cellId}
                          cellData={cellData}
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
                <Input placeholder="请输入字段名" onFocus={() => this.cacheBindCode()} onBlur={(e) => this.changeBindCode(e.target.value)} />
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
              {(() => {
                  switch (state.formItemType) {
                    case 'TEXT':
                    case 'TEXTAREA':
                      return  <TextItem formData={state.confForm}></TextItem>
                    case 'NUMBER':
                      return  <NumberItem formData={state.confForm}></NumberItem>
                    case 'DATEPICKER':
                      return  <DatePickItem formData={state.confForm}></DatePickItem>
                    case 'SWITCH':
                      return  <SwitchItem formData={state.confForm}></SwitchItem>
                    case 'UPLOAD':
                      return  <UploadItem formData={state.confForm}></UploadItem>
                    case 'CHECKBOX':
                    case 'RADIO':
                      return  <CheckItem formData={state.confForm} setOptions={(...args) => this.setOptions(args)}></CheckItem>
                    case 'SELECT':
                      return <SelectItem formData={state.confForm} setOptions={(...args) => this.setOptions(args)}></SelectItem>
                    default:
                      return null
                  }
                }
              )()}

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

const App = connect(
  mapStateToProps,
  mapDispathToProps
)(AppComponent);
export default App;

