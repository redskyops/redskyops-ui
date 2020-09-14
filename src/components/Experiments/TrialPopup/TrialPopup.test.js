import React from 'react'
import {shallow} from 'enzyme'

import {TrialPopup} from './TrialPopup.component'

describe('Component: TrialPopup', () => {
  const props = {
    hoveredTrial: {
      left: 10,
      top: 40,
      xData: {name: 'cost', value: 100},
      yData: {name: 'duration', value: 30},
      zData: {name: 'throughput', value: 120.39},
      trial: {
        labels: {
          one: 'true',
          two: 'true',
        },
      },
    },
    mouseOver: jest.fn(),
    mouseOut: jest.fn(),
    baselineClick: jest.fn(),
  }
  let wrapper

  beforeEach(() => {
    props.mouseOver.mockReset()
    props.mouseOut.mockReset()
    props.baselineClick.mockReset()
  })

  it('should render TrialPopup', () => {
    wrapper = shallow(<TrialPopup {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render nothing if hoveredTrial is not valid', () => {
    wrapper = shallow(<TrialPopup {...props} hoveredTrial={null} />)
    expect(wrapper).toHaveLength(1)
    expect(wrapper.html()).toBe(null)
    wrapper.unmount()
  })

  it('should show popup in right pisition', () => {
    const xScrollOriginal = window.scrollX
    const yScrollOriginal = window.scrollY
    window.scrollX = 15
    window.scrollY = 10
    wrapper = shallow(<TrialPopup {...props} />)
    expect(wrapper.prop('style').top).toBe(50)
    expect(wrapper.prop('style').left).toBe(25)
    wrapper.unmount()
    window.scrollX = xScrollOriginal
    window.scrollY = yScrollOriginal
  })

  it('should show popup to right side of mouse by default', () => {
    wrapper = shallow(<TrialPopup {...props} />)
    expect(wrapper.hasClass('toRightSide')).toBe(true)
    wrapper.unmount()
  })

  it('should show popup to left side of mouse if excceding screen width', () => {
    const widthOriginal = window.innerWidth
    window.innerWidth = 1000
    const localProps = {
      ...props,
      hoveredTrial: {
        ...props.hoveredTrial,
        left: 900,
      },
    }
    wrapper = shallow(<TrialPopup {...localProps} />)
    expect(wrapper.hasClass('toRightSide')).toBe(false)
    expect(wrapper.hasClass('toLeftSide')).toBe(true)
    wrapper.unmount()
    window.iinnerWidth = widthOriginal
  })

  it('should render list of trail labels', () => {
    wrapper = shallow(<TrialPopup {...props} />)
    expect(wrapper.find('h3.title')).toHaveLength(1)
    expect(wrapper.find('h3.title').text()).toBe('ONE, TWO')
    wrapper.unmount()
  })

  it("should NOT render list of trail if doesn't exists", () => {
    const localProps = {
      ...props,
      hoveredTrial: {
        ...props.hoveredTrial,
        trial: {
          labels: {},
        },
      },
    }
    wrapper = shallow(<TrialPopup {...localProps} />)
    expect(wrapper.find('.title')).toHaveLength(0)
    wrapper.unmount()
  })

  it('should render X axis details', () => {
    wrapper = shallow(<TrialPopup {...props} />)
    expect(wrapper.find('.metric')).toHaveLength(3)
    expect(
      wrapper
        .find('.metric')
        .at(0)
        .text(),
    ).toContain(props.hoveredTrial.xData.name.toUpperCase())
    expect(
      wrapper
        .find('.metric')
        .at(0)
        .text(),
    ).toContain(props.hoveredTrial.xData.value)
    wrapper.unmount()
  })

  it('should NOT render X axis details if not exists', () => {
    const localProps = {
      ...props,
      hoveredTrial: {
        ...props.hoveredTrial,
        xData: null,
      },
    }
    wrapper = shallow(<TrialPopup {...localProps} />)
    expect(wrapper.find('.metric')).toHaveLength(2)
    wrapper.unmount()
  })

  it('should render Y axis details', () => {
    wrapper = shallow(<TrialPopup {...props} />)
    expect(wrapper.find('.metric')).toHaveLength(3)
    expect(
      wrapper
        .find('.metric')
        .at(1)
        .text(),
    ).toContain(props.hoveredTrial.yData.name.toUpperCase())
    expect(
      wrapper
        .find('.metric')
        .at(1)
        .text(),
    ).toContain(props.hoveredTrial.yData.value)
    wrapper.unmount()
  })

  it('should NOT render Y axis details if not exists', () => {
    const localProps = {
      ...props,
      hoveredTrial: {
        ...props.hoveredTrial,
        yData: null,
      },
    }
    wrapper = shallow(<TrialPopup {...localProps} />)
    expect(wrapper.find('.metric')).toHaveLength(2)
    wrapper.unmount()
  })

  it('should render Z axis details', () => {
    wrapper = shallow(<TrialPopup {...props} />)
    expect(wrapper.find('.metric')).toHaveLength(3)
    expect(
      wrapper
        .find('.metric')
        .at(2)
        .text(),
    ).toContain(props.hoveredTrial.zData.name.toUpperCase())
    expect(
      wrapper
        .find('.metric')
        .at(2)
        .text(),
    ).toContain(props.hoveredTrial.zData.value)
    wrapper.unmount()
  })

  it('should NOT render Z axis details if not exists', () => {
    const localProps = {
      ...props,
      hoveredTrial: {
        ...props.hoveredTrial,
        zData: null,
      },
    }
    wrapper = shallow(<TrialPopup {...localProps} />)
    expect(wrapper.find('.metric')).toHaveLength(2)
    wrapper.unmount()
  })
})
