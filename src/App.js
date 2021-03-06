import './App.css';
import React, { useState } from 'react';
import './index.css';
import { connect } from 'react-redux';
import { Form, Input, InputNumber, Checkbox, Radio, Table, Switch, Button } from 'antd';
import { PlusCircleOutlined, DeleteTwoTone } from '@ant-design/icons';
import store from './store/store';
import MainForm from './components/MainForm';
import Preview from './components/Preview';
import { setActiveData, setInitDrag, setDragData } from './store/actionTypes'
import { objCopy, randomId } from './utils';
import { formItems, getConf } from './attrs';

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
          <Form.Item label="显示类型" name="showTime">
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
  console.log(options, modelOptions);
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

const RadioItem = ({ formData, setOptions }) => {
  return <section>
            <Form.Item label="选项">
              <OptionTable modelOptions={formData.options} setOptions={setOptions}></OptionTable>
            </Form.Item>
         </section>
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
      mainData: [],
      confForm: {},
      attrForm: {},
      hidden: true
    }
    this.formItemData = {};
    this.formModel = {};
    this.dragData = {};
    this.dropData = {};
    this.dragType = '';
  
    this.confFormRef = React.createRef();
    this.attrFormRef = React.createRef();
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      const { activeItem, dragData, dropData } = store.getState();
      if(activeItem !== this.props.activeItem) {
        this.setState({ confForm: activeItem, attrForm: activeItem.attrs });
        this.confFormRef.current.setFieldsValue(activeItem);
        this.attrFormRef.current.setFieldsValue(activeItem.attrs);
      }
      this.dragData = dragData;
      this.dropData = dropData;
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
   * 左侧列表拖拽开始事件
   * @param {string} type 拖拽的类别
   */
  formItemDrag(type) {
    this.dragType = type;
    this.formItemData = {
      type,
      formItemId: randomId(),
      ...getConf(type),
    }
    this.props.changeDragData(this.formItemData);
    this.props.changeInit(true);
  }

  /**
   * 表单区域drop事件
   */
  mainDrop() {
    if(!this.props.initDrag) return;
    const cellId = randomId();
    this.setState((state) => {
      const mainData = state.mainData;
      mainData.push({
        cellId,
        children: [{...this.formItemData, pCellId: cellId }]
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
  removeCell(cell) {
    this.setState((state) => {
      const cellIndex = state.mainData.indexOf(cell);
      if(cellIndex === -1) return {};
      state.mainData.splice(cellIndex, 1)
      return { mainData: state.mainData }
    })
  }

  confFormChange(changeVal) {
    const key = Object.keys(changeVal)[0];
    this.setState((state) => {
      state.confForm[key] = changeVal[key];
      return {
        confForm: state.confForm
      }
    })
  }

  attrFormChange(changeVal) {
    const key = Object.keys(changeVal)[0];
    this.setState((state) => {
      state.attrForm[key] = changeVal[key];
      return {
        attrForm: state.attrForm
      }
    })
  }

  /**
   * 设置下拉/单选/多选的options
   * @param {array} param: 选项数组
   */
  setOptions(options) {
    this.setState((state) => {
      state.attrForm.options = options;
      return { attrForm: state.attrForm };
    })
  }

  /**
   * 删除option
   * @param {object} option 
   */
  removeOption(option) {
    const { attrForm } = this.state;
    const optionIndex = attrForm.options.indexOf(option);
    if(optionIndex > -1) attrForm.options.splice(optionIndex, 1);
  }

  getFormData() {
    
  }

  render() {
    const { mainData, confForm, hidden, attrForm } = this.state;
    const confOptions = [
      { label: '加粗', value: 'bold' },
      { label: '倾斜', value: 'italic' }
    ];
    return (
      <div className="main">
        <div className="layout-left">
          {
            Object.values(formItems).map(formItem => {
              return (
                <div className="formitem-item" key={formItem.type} draggable onDragStart={ () => this.formItemDrag(formItem.type)}>
                  {formItem.labelName}
                </div>
              )
            })
          }
        </div>
        <div className="layout-center">
          <div className="form-container" onDragOver={(e) => this.mainDragOver(e) } onDrop={() => this.mainDrop()} onClick={() => this.props.changeActiveItem({})}>
            <MainForm mainData={[...mainData]} removeCell={(...args) => this.removeCell(...args) } isProd={false}></MainForm>
          </div>
          {
            mainData.length > 0 ? <Button className="preview-btn" onClick={() => this.setState({ hidden: false }) }>预览</Button> : null
          }
        </div>
        <div className='layout-right'>
          <div className="conf-form" hidden={confForm.formItemId ? false : true}>
            <Form name="confForm" ref={this.confFormRef} onValuesChange={(changeVal, allVal) => this.confFormChange(changeVal, allVal)} labelCol={{ span: 8, offset: 0 }}>
              <Form.Item label="字段名" name="name" rules={[{required: true, message: '字段名不能为空'}]}>
                <Input placeholder="请输入字段名" />
              </Form.Item>
              <Form.Item label="标签名" name="labelName" rules={[{required: true, message: '标签名不能为空'}]}>
                <Input placeholder="请输入标签名" />
              </Form.Item>
              <Form.Item label="标签字号" name="fontSize">
                <InputNumber />
              </Form.Item>
              <Form.Item label="标签字体" name="fontStyle">
                <Checkbox.Group options={confOptions} size="small"></Checkbox.Group>
              </Form.Item>
              <Form.Item label="标签对齐" name="textAlign">
                <Radio.Group size="small">
                  <Radio.Button value="left">左对齐</Radio.Button>
                  <Radio.Button value="center">居中</Radio.Button>
                  <Radio.Button value="right">右对齐</Radio.Button>
                </Radio.Group>
              </Form.Item>
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
            <Form name="attrForm" ref={this.attrFormRef} onValuesChange={(changeVal, allVal) => this.attrFormChange(changeVal, allVal)} labelCol={{ span: 8, offset: 0 }}>
              {(() => {
                    switch (confForm.type) {
                      case 'TEXT':
                      case 'TEXTAREA':
                        return  <TextItem formData={attrForm}></TextItem>
                      case 'NUMBER':
                        return  <NumberItem formData={attrForm}></NumberItem>
                      case 'DATEPICKER':
                        return  <DatePickItem formData={attrForm}></DatePickItem>
                      case 'SWITCH':
                        return  <SwitchItem formData={attrForm}></SwitchItem>
                      case 'UPLOAD':
                        return  <UploadItem formData={attrForm}></UploadItem>
                      case 'CHECKBOX':
                        return  <CheckItem formData={attrForm} setOptions={(...args) => this.setOptions(...args)}></CheckItem>
                      case 'RADIO':
                        return  <RadioItem formData={attrForm} setOptions={(...args) => this.setOptions(...args)}></RadioItem>
                      case 'SELECT':
                        return <SelectItem formData={attrForm} setOptions={(...args) => this.setOptions(...args)}></SelectItem>
                      default:
                        return null
                    }
                  }
                )()}
            </Form>
          </div>
        </div>
        <section className={hidden ? 'hidden' : ''}>
          <Preview mainData={[...mainData]} hidePreview={ () => this.setState({ hidden: true }) }></Preview>
        </section>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    dragData: state.dragData,
    dropData: state.dropData,
    activeItem: state.activeItem,
    initDrag: state.initDrag
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

