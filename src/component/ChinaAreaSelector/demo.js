import React, { Component } from 'react';
import ChinaAreaSelector from './index'

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ChinaAreaSelectorShow: false,
      ChinaAreaSelectorValue: {
        ids: ["440000", "440100", "440105"],
        names: ["广东省", "广州市", "海珠区"]
      },
    }
  }
  componentDidMount() {

  }
  ChinaAreaSelectorChange = (value) => {
    console.info('value', value)
    this.setState({
      ChinaAreaSelectorValue: value
    });
  }
  openChinaAreaSelector = () => {
    this.setState({
      ChinaAreaSelectorShow: true
    })
  }
  render() {
    const { ChinaAreaSelectorValue } = this.state
    const btnStyle = { fontSize: '16px', border: '1px solid #555' }
    return (

      <div>

        <br />
        <br />
        <h3>按钮开关</h3>
        <button onClick={this.openChinaAreaSelector} style={btnStyle}> 打开地区选择</button>

        <h3>类input开关</h3>
        <span>地区：</span>
        <span onClick={this.openChinaAreaSelector} style={{ fontSize: '16px', borderBottom: '1px solid #555' }}>{(ChinaAreaSelectorValue.names && ChinaAreaSelectorValue.names[0]) ? `${ChinaAreaSelectorValue.names[0]} ${ChinaAreaSelectorValue.names[1]} ${ChinaAreaSelectorValue.names[2] || ""}` : '请选择地区'}</span>

        <ChinaAreaSelector
          open={this.state.ChinaAreaSelectorShow}
          close={() => this.setState({ ChinaAreaSelectorShow: false })}
          value={ChinaAreaSelectorValue}
          onChange={(value) => { this.ChinaAreaSelectorChange(value) }}
          sync={false}
        />

        <h3>获取值的显示区域</h3>

        {ChinaAreaSelectorValue && ChinaAreaSelectorValue.ids &&
          <div>
            <div>
              {`省id:${ChinaAreaSelectorValue.ids[0]} 城市id:${ChinaAreaSelectorValue.ids[1]} 地区id:${ChinaAreaSelectorValue.ids[2] || ""}`}
            </div>
            <div>
              {`省name:${ChinaAreaSelectorValue.names[0]} 城市name:${ChinaAreaSelectorValue.names[1]} 地区name:${ChinaAreaSelectorValue.names[2] || ""}`}
            </div>
          </div>
        }

        <h3>操作</h3>
        <button onClick={() => {
          this.setState({
            ChinaAreaSelectorValue: {}
          });
        }} style={btnStyle}>设置空值</button>
        &nbsp;&nbsp;
        <button onClick={() => {
          this.setState({
            ChinaAreaSelectorValue: {
              ids: ["110000", "110101"],
              names: ["北京市", "东城区"]
            }
          });
        }} style={btnStyle}>设置 北京 东城区</button>

      </div>
    );
  }
}

export default Demo;
