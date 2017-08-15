import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { data } from './ChinaAreaData/data'
import Hammer from 'hammerjs'
import Swiper from './lib/swiper-3.4.2.min'
import './index.styl'
import './lib/swiper-3.4.2.min.css'

class ChinaAreaSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allSwiperInitComplete: false
    }

    this.defaultValue = (this.props.defaultValue && this.props.defaultValue.length > 0) ? this.props.defaultValue : ["440000", "440100", "440106"]//默认数据

    //原始数据
    this.DATA = data
    //选中的省数据
    this.province = {}
    //选中的市数据
    this.city = {}
    //选中的区数据
    this.area = {}

    //计时器
    this.outputValueTimer = null


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

  componentDidMount() {
    window.kk = this;
  }

  componentWillReceiveProps(nextProps) {
    //默认值动态改变时（hack 父组件的初始化数据为异步数据时)
    if (nextProps.defaultValue && nextProps.defaultValue.length > 0) {
      if (nextProps.defaultValue.length != this.defaultValue.length) {
        this.initSelector(nextProps.defaultValue)
      } else {
        let isDifferent = false
        nextProps.defaultValue.forEach((el, i) => {
          if (el != this.defaultValue[i]) {
            isDifferent = true
          }
        })
        if (isDifferent) {
          this.defaultValue = nextProps.defaultValue
          this.initSelector(nextProps.defaultValue)
        }
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.outputValueTimer)
  }

  //初始化
  initSelector = (value) => {
    // return false //test
    console.log("initSelector", value)
    const pId = value[0]
    const cId = value[1]
    const aId = value[2]
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

    let aData = cData.child.filter((el, i) => {
      if (el.id == aId) {
        aIndex = i
        return true
      }
    })[0]
    if (typeof aData === 'undefined') {
      aData = cData.child[0]
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
    this.outputValue()
  }

  outputValue = () => {
    clearTimeout(this.outputValueTimer)
    this.outputValueTimer = setTimeout(() => {
      const { province, city, area } = this
      const _outputValue = {
        ids: [province.id, city.id, area.id],
        names: [province.name, city.name, area.name]
      }
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(_outputValue)
      }
    }, 150)
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
      new Swiper('#ChinaAreaSelectorProvince', {
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
      new Swiper('#ChinaAreaSelectorCity', {
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
      new Swiper('#ChinaAreaSelectorArea', {
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
      this.initSelector(this.defaultValue)
      this.setState({
        allSwiperInitComplete: true
      });
    }
  }

  render() {
    const { province, city, area } = this
    // if (!province.id) {
    //   return null
    // } else {
    console.log("------render------")
    // console.log("province", province, "city", city, "area", area)
    return (
      <div>
        <div className="mask">
          <div className="mask-wrap">
            <div className="swiper-container" id="ChinaAreaSelectorProvince" ref={(ref) => { this.saveRef('ChinaAreaSelectorProvince', ref) }}>
              <div className="swiper-wrapper">
                {this.DATA.map((el, i) => {
                  return (
                    <div className="swiper-slide" data-value={el.id} key={el.id}>{el.name}</div>
                  )
                })}
              </div>
            </div>

            {province && province.id &&
              <div className="swiper-container" id="ChinaAreaSelectorCity" ref={(ref) => { this.saveRef('ChinaAreaSelectorCity', ref) }}>
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
              <div className="swiper-container" id="ChinaAreaSelectorArea" ref={(ref) => { this.saveRef('ChinaAreaSelectorArea', ref) }}>
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
    );
    // }

  }
}

ChinaAreaSelector.propTypes = {

};

export default ChinaAreaSelector;
