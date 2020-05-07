import React from 'react';
import MainForm from '../MainForm';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import './index.css';
class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      formModel: {}
    }
  }

  submit(values) {
    this.setState({ formModel: values });
  }

  render() {
    const { mainData } = this.props;
    return <div className="preview">
              <div className="left-box">
                <MainForm isProd={true} mainData={mainData} submit={ (...args) => { this.submit(...args) } }></MainForm>
                <Button onClick={() => { this.props.hidePreview() }} className="close-btn">关闭</Button>
              </div>
              <div className="right-box">
                <h4>表单数据</h4>
                <code>{JSON.stringify(this.state.formModel)}</code>
              </div>
           </div>
  }
}

Preview.propTypes = {
  mainData: PropTypes.array.isRequired,
  hidePreview: PropTypes.func.isRequired
}

export default Preview;