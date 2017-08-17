/**
 * create by lzsheng
 * 2017-08-017
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { data } from './ChinaAreaData/data2'
import Hammer from 'hammerjs'
import Swiper from './lib/swiper-3.4.2.min'
import './index.styl'
import './lib/swiper.css'

class ChinaAreaSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open || false
    }
    console.log(this.props.value)
    this.resetData()
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open && !this.state.open) {
      this.setState({
        open: nextProps.open
      });
      this.resetData()
    }
  }

  componentWillUnmount() {

  }

  //多次打开控件，重置数据和swiper的实例
  resetData = () => {

    //数据是否实时同步
    this.sync = this.props.sync || false
    //默认选中的数据
    this.ids = (this.props.value.ids && this.props.value.ids.length > 0) ? this.props.value.ids : ["440000", "440100", "440106"]

    //原始数据
    this.DATA = data
    //选中的省数据
    this.province = {}
    //选中的市数据
    this.city = {}
    //选中的区数据
    this.area = {}

    //swiper相关
    this.commonConfig = {
      direction: 'vertical',
      slidesPerView: 6,
      centeredSlides: true,
      spaceBetween: 0,
      grabCursor: true,
      observer: true
    }
    this.myrefs = {}
    this.swipers = {
      swiper_ChinaAreaSelectorProvince: undefined,
      swiper_ChinaAreaSelectorCity: undefined,
      swiper_ChinaAreaSelectorArea: undefined
    }
  }

  //初始化
  initSelector = () => {
    // return false //test
    // const { value, defaultValue } = this
    const _value = this.ids
    console.log("initSelector", _value)
    const pId = _value[0]
    const cId = _value[1]
    const aId = _value[2]
    let pIndex, cIndex, aIndex = 0
    const pData = this.DATA.filter((el, i) => {
      if (el.id == pId) {
        pIndex = i
        return true
      }
    })[0]
    const cData = pData.child.filter((el, i) => {
      if (el.id == cId) {
        cIndex = i
        return true
      }
    })[0]

    //区数据有可能为空
    let aData = undefined
    if (typeof cData.child != 'undefined') {
      aData = cData.child.filter((el, i) => {
        if (el.id == aId) {
          aIndex = i
          return true
        }
      })[0]
      if (typeof aData === 'undefined') {
        aData = cData.child[0]
      }
    }
    //设置数据
    this.toSetState('province', pData)
    this.toSetState('city', cData)
    this.toSetState('area', aData)

    //界面滚动
    this.swipers.swiper_ChinaAreaSelectorProvince.slideTo(pIndex, 0, false);
    this.swipers.swiper_ChinaAreaSelectorCity.slideTo(cIndex, 0, false);
    this.swipers.swiper_ChinaAreaSelectorArea.slideTo(aIndex, 0, false);

  }

  toSetState = (dataName, _obj) => {
    console.log('toSetState', dataName, _obj)
    this[dataName] = _obj
    this.forceUpdate()//更新视图
    if (this.sync) {
      this.outputValue()//选择时，实时同步数据
    }
  }

  /**
   *
   * 如果没有"区"数据，则返回值ids.length === 2
   *
   */
  outputValue = () => {
    const { province, city, area } = this
    let _outputValue = {
      ids: [province.id, city.id],
      names: [province.name, city.name]
    }
    if (area && area.id) {
      _outputValue.ids.push(area.id)
      _outputValue.names.push(area.name)
    }
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(_outputValue)
    }
  }

  handleChangeProvince = (id) => {
    // console.log('-----handleChangeProvince-----')
    // console.log('handleChangeProvince', id)
    const _value = this.DATA.filter((el, i) => (el.id == id))[0]
    // console.log('handleChangeProvince', _value)
    this.toSetState('province', _value)
    if (this.swipers.swiper_ChinaAreaSelectorCity) {
      this.swipers.swiper_ChinaAreaSelectorCity.slideTo(0, 100, false);
    }
    this.handleChangeCity(-1)
    this.handleChangeArea(-1)
  }

  handleChangeCity = (id) => {
    // console.log('-----handleChangeCity-----')
    // console.log('handleChangeCity', id)
    const { province } = this
    let _value = province.child.filter((el, i) => (el.id == id))[0]
    if (typeof _value === 'undefined') {
      _value = province.child[0]
    }
    // console.log('handleChangeCity', _value)
    this.toSetState('city', _value)
    //选择城市时，默认地区选择第一个
    if (this.swipers.swiper_ChinaAreaSelectorArea) {
      this.swipers.swiper_ChinaAreaSelectorArea.slideTo(0, 100, false);
    }
    this.handleChangeArea(-1)
  }

  handleChangeArea = (id) => {
    console.log('-----handleChangeArea-----')
    // console.log('handleChangeArea', id)
    const { city } = this
    if (typeof city.child === 'undefined') {
      this.toSetState('area', {})
      return
    }
    let _value = city.child.filter((el, i) => (el.id == id))[0]
    if (typeof _value === 'undefined') {
      _value = city.child[0]
    }
    // console.log('handleChangeArea', _value)
    this.toSetState('area', _value)
  }

  saveRef = (refName, ref) => {
    const _this = this
    if (typeof _this.myrefs[refName] === 'undefined') {
      _this.myrefs[refName] = ref
    }
    const keys = Object.keys(this.myrefs)

    if (!this.swipers.swiper_ChinaAreaSelectorProvince && keys.filter((el) => (el === 'ChinaAreaSelectorProvince')).length > 0) {
      new Swiper(_this.myrefs.ChinaAreaSelectorProvince, {
        ...this.commonConfig,
        onTransitionEnd: function (swiper) {
          const activeIndex = swiper.activeIndex
          const activeDom = swiper.slides[swiper.activeIndex]
          const activeDom_value = activeDom.dataset.value
          _this.handleChangeProvince(activeDom_value)
        },
        onInit: (swiper) => {
          this.bindSwiper('swiper_ChinaAreaSelectorProvince', swiper)
        }
      });

    }

    if (!this.swipers.swiper_ChinaAreaSelectorCity && keys.filter((el) => (el === 'ChinaAreaSelectorCity')).length > 0) {
      new Swiper(_this.myrefs.ChinaAreaSelectorCity, {
        ...this.commonConfig,
        onTransitionEnd: function (swiper) {
          const activeIndex = swiper.activeIndex
          const activeDom = swiper.slides[swiper.activeIndex]
          const activeDom_value = activeDom.dataset.value
          _this.handleChangeCity(activeDom_value)
        },
        onInit: (swiper) => {
          this.bindSwiper('swiper_ChinaAreaSelectorCity', swiper)
        }
      });
    }

    if (!this.swipers.swiper_ChinaAreaSelectorArea && keys.filter((el) => (el === 'ChinaAreaSelectorArea')).length > 0) {
      new Swiper(_this.myrefs.ChinaAreaSelectorArea, {
        ...this.commonConfig,
        onTransitionEnd: function (swiper) {
          const activeIndex = swiper.activeIndex
          const activeDom = swiper.slides[swiper.activeIndex]
          const activeDom_value = activeDom.dataset.value
          _this.handleChangeArea(activeDom_value)
        },
        onInit: (swiper) => {
          this.bindSwiper('swiper_ChinaAreaSelectorArea', swiper)
        }
      });
    }

  }

  bindSwiper = (name, swiper) => {
    this.swipers[name] = swiper
    this.isAllSwiperInitComplete()
  }

  isAllSwiperInitComplete = () => {
    const _keys = Object.keys(this.swipers)
    let initNum = 0
    _keys.forEach((el) => {
      if (typeof this.swipers[el] != 'undefined') {
        initNum++
      }
    })
    if (_keys.length === initNum) {
      this.initSelector()
    }
  }

  okBtnClick = () => {
    this.outputValue()
    this.toClose()
  }

  cancelBtnClick = () => {
    this.toClose()
  }

  toClose = () => {
    this.setState({
      open: false
    });
    this.props.close(true)
  }

  render() {
    const { province, city, area } = this
    const { open } = this.state
    console.log("------render------", open)
    if (!open) {
      return null
    }

    // console.log("province", province, "city", city, "area", area)
    return (
      <div className="ChinaAreaSelector">
        <div className="CAS_mask">
          <div className="CAS_container">
            <div className="CAS_topbar">
              <div className="CAS_topbar_btn" onClick={!this.sync && this.cancelBtnClick}>{!this.sync ? '取消' : ''}</div>
              <div className="CAS_topbar_title">选择地区</div>
              <div className="CAS_topbar_btn CAS_topbar_btn--right" onClick={this.okBtnClick}>确认</div>
            </div>
            <div className="CAS_content">
              <div className="swiper-container" ref={(ref) => { this.saveRef('ChinaAreaSelectorProvince', ref) }}>
                <div className="swiper-wrapper">
                  {this.DATA.map((el, i) => {
                    return (
                      <div className="swiper-slide" data-value={el.id} key={el.id}>{el.name}</div>
                    )
                  })}
                </div>
              </div>

              {province && province.id &&
                <div className="swiper-container" ref={(ref) => { this.saveRef('ChinaAreaSelectorCity', ref) }}>
                  <div className="swiper-wrapper">
                    {province.child.map((el, i) => {
                      return (
                        <div className="swiper-slide" data-value={el.id} key={el.id}>{el.name}</div>
                      )
                    })}
                  </div>
                </div>
              }

              {city &&
                <div className="swiper-container" ref={(ref) => { this.saveRef('ChinaAreaSelectorArea', ref) }}>
                  <div className="swiper-wrapper">
                    {city.child && city.child.map((el, i) => {
                      return (
                        <div className="swiper-slide" data-value={el.id} key={el.id}>{el.name}</div>
                      )
                    })}
                  </div>
                </div>
              }

            </div>
          </div>
        </div>

      </div>
    )

  }
}


ChinaAreaSelector.defaultProps = {
  value: {
    ids: ["440000", "440100", "440106"],
    name: ["广东省", "广州市", "天河区"]
  },//默认值的数据格式
  onChange: function () { },
  close: function () { },
  sync: false,
}

ChinaAreaSelector.propTypes = {
  open: PropTypes.bool.isRequired,//是否打开控件
  value: PropTypes.object,//值,格式如
  onChange: PropTypes.func,
  close: PropTypes.func,
  sync: PropTypes.bool,
};

export default ChinaAreaSelector;
