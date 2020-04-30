import React from 'react';
import MainForm from '../MainForm';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import './index.css';
class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    const { mainData } = this.props;
    console.log(mainData);
    return <div className="preview">
              <div className="center">
                <MainForm isProd={true} mainData={mainData}></MainForm>
                <Button onClick={() => { this.props.hidePreview() }} className="close-btn">关闭</Button>
              </div>
           </div>
  }
}

Preview.propTypes = {
  mainData: PropTypes.array.isRequired,
  hidePreview: PropTypes.array.isRequired
}

export default Preview;