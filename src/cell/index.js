import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FormItem from '../formItem';
import './index.css';
import store from '../store/store';

class CellComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      initDrag: true,
      dragData: {}
    }
  }

  componentDidMount() {
    store.subscribe(() => {
      const { initDrag, dragData } = store.getState();
      if(initDrag !== this.state.initDrag) {
        this.setState({ initDrag: initDrag });
      }
      if(dragData !== this.state.dragData) {
        this.setState({ dragData: dragData });
      }
    })
  }

  cellDragOver(e) {
    e.preventDefault();
  }

  cellDrop(e) {
    e.stopPropagation();
    const { cellData } = this.props;
    const { initDrag, dragData } = this.state;
    
    const data = Object.assign({}, dragData, { pCellId: cellData.cellId });
    if(initDrag || dragData.pCellId !== cellData.cellId) {
      cellData.children.push(data);
      this.setState({ cellData: cellData });
    }
    if(dragData.pCellId !== cellData.cellId) this.props.removeOriFormItem();
  }

  formItemDrop(args) {
    const [dropItemData] = args;
    const { cellData } = this.props;
    const { dragData } = this.state;
    if(dragData.pCellId !== cellData.cellId) return;
    this.props.changeDropFormData(dropItemData);
    this.props.changeFormItemPos();
  }

  // 删除formItem方法
  removeFormItem(formItem) {
    const cellChildren = this.cellData.children;
    const itemIndex = cellChildren.indexOf(formItem);
    if(itemIndex > -1) {
      cellChildren.splice(itemIndex, 1);
    }
    if(this.cellData.children.length === 0) {
      this.props.removeCell(this.cellData);
    }
  }

  render() {
    const children = this.props.cellData.children || [];
    return (
      <div className="cell"
        onDragOver={(e) => this.cellDragOver(e)}
        onDrop={(e) => this.cellDrop(e)}>
          {children.map(formItem => {
            return <FormItem 
              key={formItem.formItemId} 
              formItemConfig={formItem}
              formModel={this.props.formModel}
              formItemDrop={(...args) => this.formItemDrop(args)}
              remove={() => this.removeFormItem()}
            ></FormItem>
            })
          }
      </div>
    )
  }
}

CellComponent.propTypes = {
  cellData: PropTypes.object.isRequired,
  formModel: PropTypes.object.isRequired,
  removeCell: PropTypes.func.isRequired,
  changeFormItemPos: PropTypes.func.isRequired,
  removeOriFormItem: PropTypes.func.isRequired
}

const mapStateToProps = function(state) {
  return {
    formItemData: state.formItemData,
    initDrag: state.initDrag,
    dragData: state.dragData
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    changeDropFormData(payload) {
      dispatch({
        type: 'DROP_FORMITEM_DATA',
        payload: payload
      })
    }
  }
}

const Cell = connect(
  mapStateToProps,
  mapDispatchToProps
)(CellComponent);
export default Cell;

