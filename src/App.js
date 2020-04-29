import './App.css';
import React, { useState } from 'react';
import './index.css';
import { connect } from 'react-redux';
import { Form, Input, InputNumber, Checkbox, Radio, Table, Switch, message } from 'antd';
import { PlusCircleOutlined, DeleteTwoTone } from '@ant-design/icons';
import store from './store/store';
import MainForm from './components/cell';
import { setActiveData, setInitDrag, setDragData } from './store/actionTypes'

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
  let i = 10;
  while(i) {
    randomId += arr[Math.ceil(Math.random() * 15)] ;
    i --;
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
          <Form.Item label="上传地址" name="action" rules={[{ required: true, message: '上传地址不能为空'} ]}>
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
      if(!targetOp) return;
      targetOp[key] = value;
    }
    setState(opts);
    setOptions(opts);
  }

  const deleteOption = function(key){
    const opts = options.filter(opt => {
      return opt.key !== key;
    })
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
      render(text, record) {
        return <Input defaultValue={text} size="mini" onChange={(e) => { changeOption('value', e.target.value, record.key )}} />
      }
    },
    {
      title: addIcon(changeOption),
      dataIndex: 'addBtn',
      key: 'addBtn',
      render(text, record) {
        return <DeleteTwoTone twoToneColor="#DC143C" onClick={(e) => { deleteOption(record.key) }} />
      }
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
      activeItem: {}
    }
    this.formItemData = {};
    this.formModel = {};
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
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      const newState = store.getState();
      const { activeItem, dragData, dropData } = newState;
      if(activeItem !== this.props.activeItem) {
        const config = activeItem.config || this.defaultConfig;
        this.setState({ confForm: config, activeItem: activeItem  });
        this.confFormRef.current.setFieldsValue(config);
      }
      if(dragData !== this.dragData) this.dragData = newState.dragData;
      if(dropData !== this.dropData) this.dropData = newState.dropData;
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
   * 左侧列表拖拽开始事件
   * @param {*} type 拖拽的类别
   */
  formItemDrag(type) {
    this.dragType = type;
    const config = {
      bindCode: 'name_' + randomId(),
      isRequired: true,
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
        config.labelName = '日期';
        break;
      case 'TIMEPICKER':
        config.labelName = '时间';
        break;
      case 'SWITCH': 
        config.labelName = '开关';
        config.activeVal = 1;
        config.inactiveVal = 0;
        break;
      case 'UPLOAD':
        config.action = '';
        config.labelName = '文件';
        config.tip = '';
        break;
      default:
        break;
    };
    config.message = `${config.labelName}不能为空`;
    this.formItemData = {
      type: type,
      formItemId: randomId(),
      config: Object.assign({}, this.defaultConfig, config)
    }
    this.props.changeDragData(this.formItemData);
    this.props.changeInit(true);
  }

  /**
   * 表单区域drop事件
   */
  mainDrop() {
    const cellId = randomId();
    this.setState((prevState) => {
      const mainData = prevState.mainData;
      mainData.push({
        cellId: cellId,
        children: [Object.assign({}, this.formItemData, { pCellId: cellId })]
      })
      return { mainData: mainData }; 
    });
  }

  mainDragOver(e) {
    e.preventDefault();
  }

    /**
   * 删除行
   * @param {object} cell 
   */
  removeCell([cell]) {
    const mainData = this.state.mainData;
    const cellIndex = mainData.indexOf(cell);
    mainData.splice(cellIndex, 1)
    this.setState({ mainData: mainData });
  }

  confFormChange(changeVal) {
    const key = Object.keys(changeVal)[0];
    const confForm = this.state.confForm;
    if(!(key in confForm)) return;
    confForm[key] = changeVal[key];
    this.setState({ confForm: confForm });
  }

  /**
   * 设置下拉/单选/多选的options
   * @param {object} param0 
   */
  setOptions([options]) {
    const { confForm } = this.state;
    if(!confForm.bindCode.length) {
      message.warn('请先填写字段名');
      return false;
    }
    confForm.options = options;
    this.setState({ confForm: confForm });
  }

  /**
   * 删除option
   * @param {object} option 
   */
  removeOption(option) {
    const { confForm } = this.state;
    const optionIndex = confForm.options.indexOf(option);
    if(optionIndex > -1) confForm.options.splice(optionIndex, 1);
  }

  formSubmit(fieldsValue) {
    alert(fieldsValue);
  }

  getFormData() {
    
  }

  render() {
    const { activeItem, mainData, confForm } = this.state;
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
      {type: 'DATEPICKER', name: 'DatePicker日期'},
      {type: 'TIMEPICKER', name: 'TimePicker时间'},
      {type: 'SWITCH', name: 'Switch开关'},
      {type: 'UPLOAD', name: 'Upload文件'}
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
          <div className="form-container" onDragOver={(e) => this.mainDragOver(e) } onDrop={() => this.mainDrop()} onClick={() => this.props.changeActiveItem({})}>
            <MainForm mainData={[...mainData]} formSubmit={this.formSubmit} removeCell={(...args) => { this.removeCell(args) }}></MainForm>
          </div>
        </div>
        <div className='layout-right'>
          <div className="conf-form" hidden={activeItem.formItemId ? false : true}>
            <Form name="confForm" ref={this.confFormRef} onValuesChange={(changeVal, allVal) => this.confFormChange(changeVal, allVal)} labelCol={{ span: 8, offset: 0 }}>
              <Form.Item label="字段名" name="bindCode" rules={[{required: true, message: '字段名不能为空'}]}>
                <Input placeholder="请输入字段名" />
              </Form.Item>
              <Form.Item label="标签名" name="labelName" rules={[{required: true, message: '标签名不能为空'}]}>
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
                  switch (activeItem.type) {
                    case 'TEXT':
                    case 'TEXTAREA':
                      return  <TextItem formData={confForm}></TextItem>
                    case 'NUMBER':
                      return  <NumberItem formData={confForm}></NumberItem>
                    case 'DATEPICKER':
                      return  <DatePickItem formData={confForm}></DatePickItem>
                    case 'SWITCH':
                      return  <SwitchItem formData={confForm}></SwitchItem>
                    case 'UPLOAD':
                      return  <UploadItem formData={confForm}></UploadItem>
                    case 'CHECKBOX':
                    case 'RADIO':
                      return  <CheckItem formData={confForm} setOptions={(...args) => this.setOptions(args)}></CheckItem>
                    case 'SELECT':
                      return <SelectItem formData={confForm} setOptions={(...args) => this.setOptions(args)}></SelectItem>
                    default:
                      return null
                  }
                }
              )()}

              <Form.Item label="是否必填" name="isRequired" shouldUpdate>
                <Switch checked={confForm.isRequired}></Switch>
              </Form.Item>
              {
                confForm.isRequired ? 
                  <Form.Item label="非空提示" name="message" shouldUpdate>
                    <Input placeholder="请输入字段为空时的提示" />
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
    changeDragData(dragData) {
      dispatch(setDragData(dragData));
    },
    changeInit(initDrag) {
      dispatch(setInitDrag(initDrag));
    },
    changeActiveItem(activeItem) {
      dispatch(setActiveData(activeItem));
    }
  }
}

const App = connect(
  mapStateToProps,
  mapDispathToProps
)(AppComponent);
export default App;

