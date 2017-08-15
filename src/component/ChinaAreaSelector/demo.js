import React, { Component } from 'react';
import ChinaAreaSelector from './index'

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ChinaAreaSelectorDefaultValue: ["440000", "440100", "440105"],
      ChinaAreaSelectorValue: undefined
    }
  }
  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({
    //     ChinaAreaSelectorDefaultValue: ["440000", "440100", "440103"]
    //   });
    // }, 3000)
  }
  ChinaAreaSelectorChange = (value) => {
    console.info('demo', value)
    this.setState({
      ChinaAreaSelectorValue: value
    });
  }
  render() {
    const { ChinaAreaSelectorValue } = this.state
    return (

      <div>

        <ChinaAreaSelector
          defaultValue={this.state.ChinaAreaSelectorDefaultValue}
          onChange={(value) => { this.ChinaAreaSelectorChange(value) }}
        />

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

      </div>
    );
  }
}

export default Demo;
