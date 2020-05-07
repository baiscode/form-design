import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import store from '../../store/store';
import './index.css';
import FormItem from '../FormItem';
import { setDropData } from '../../store/actionTypes';
import { Form, Button } from 'antd';

class MainForm extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.initDrag = true;
    this.dragData = {};
    this.dropData = {};
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      const { initDrag, dragData, dropData } = store.getState();
      if(initDrag !== this.initDrag) this.initDrag = initDrag
      if(dragData !== this.dragData) this.dragData = dragData
      if(dropData !== this.dropData) this.dropData = dropData;
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  cellDragOver(e) {
    e.preventDefault();
  }

  cellDrop(e, cellData) {
    e.stopPropagation();
    const { initDrag, dragData } = this;
    const data = {...dragData, pCellId: cellData.cellId};
    if(initDrag || dragData.pCellId !== cellData.cellId) {
      cellData.children.push(data);
      this.setState({ cellData: cellData });
    }
    if(dragData.pCellId !== cellData.cellId) this.removeOriFormItem();
  }

  formItemDrop([dropItemData], cellData) {
    if(this.dragData.pCellId !== cellData.cellId) return;
    this.props.changeDropFormData(dropItemData);
    this.changeFormItemPos();
  }

  /**
 * 删除formItem方法
 */
  removeFormItem([formItem], cellData) {
    const cellChildren = cellData.children;
    const itemIndex = cellChildren.indexOf(formItem);
    if(itemIndex > -1) {
      cellChildren.splice(itemIndex, 1);
    }
    if(!cellData.children.length) {
      this.props.removeCell(cellData);
    }
  }

  /**
 * 相同行中的表单元素互换位置
 */
  changeFormItemPos() {
    const { mainData } = this.props;
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

  /**
   * 删除原先行中的表单元素
   */
  removeOriFormItem() {
    const { mainData } = this.props;
    const oriCell = mainData.find(cell => {
      return cell.cellId === this.dragData.pCellId;
    })
    if(!oriCell) return false;
    const targetI = oriCell.children.indexOf(this.dragData)
    if(targetI === -1) return;
    oriCell.children.splice(targetI, 1)
    // 如果当前行中没有任何表单元素，则删除当前行
    if(!oriCell.children.length) {
      setTimeout(() => {
        this.props.removeCell(oriCell);
      }, 300)
    }
  }

  formSubmit(values) {
    this.props.submit(values);
  }

  render() {
    const { mainData, isProd } = this.props;
    return (
      <Form 
        name="mainForm" 
        ref={this.mainForm} 
        onFinish={ (...args) => this.formSubmit(...args) }
      >  
        {
          mainData.length > 0 && mainData.map(cellData => {
            return <div className={isProd ? 'prod-cell' : 'dev-cell'} onDragOver={(e) => this.cellDragOver(e)} onDrop={(e) => this.cellDrop(e, cellData)} key={cellData.cellId}>
                      {
                        cellData.children.map(formItem => {
                          return <FormItem 
                            key={formItem.formItemId} 
                            formItem={formItem}
                            formItemDrop={(...args) => this.formItemDrop(args, cellData)}
                            remove={(...args) => this.removeFormItem(args, cellData)}
                            isProd={isProd}
                          ></FormItem>
                        })
                      }
                  </div>
          })
        }
        {
          isProd ? <Button type="primary" className="submit-btn" htmlType="submit">提交</Button> : null
        }
        </Form>
     
    )
  }
}

MainForm.propTypes = {
  mainData: PropTypes.array.isRequired,
  submit: PropTypes.func,
  removeCell: PropTypes.func,
  isProd: PropTypes.bool
}

const mapStateToProps = function(state) {
  return {
    initDrag: state.initDrag,
    dragData: state.dragData
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    changeDropFormData(dropData) {
      dispatch(setDropData(dropData))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainForm);

