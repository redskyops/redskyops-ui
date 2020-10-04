import React from 'react'
import {shallow} from 'enzyme'

import {TrialPopup} from './TrialPopup.component'
import {BASELINE_LABEL} from '../../../constants'

describe('Component: TrialPopup', () => {
  const props = {
    hoveredTrial: {
      left: 10,
      top: 40,
      xData: {name: 'cost', value: 100},
      yData: {name: 'duration', value: 30},
      zData: {name: 'throughput', value: 120.39},
      trial: {
        number: 120,
        labels: {
          one: 'true',
          two: 'true',
        },
      },
    },
    activeExperiment: {index: 0},
    experiments: {
      list: [{displayName: 'test-experiment'}],
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

  it('should render set baseline button', () => {
    wrapper = shallow(<TrialPopup {...props} />)
    expect(
      wrapper.find('button[data-dom-id="popup-set-baseline"]'),
    ).toHaveLength(1)
    expect(
      wrapper.find('button[data-dom-id="popup-set-baseline"]').text(),
    ).toBe('SET BASELINE')
    expect(props.baselineClick).toHaveBeenCalledTimes(1)
    expect(props.baselineClick.mock.calls[0][0]).toEqual(true)
    expect(props.baselineClick.mock.calls[0][1]).toEqual(
      props.hoveredTrial.trial,
    )
    wrapper.find('button[data-dom-id="popup-set-baseline"]').simulate('click')
    wrapper.unmount()
  })

  it('should render remove baseline button', () => {
    const localProps = {
      ...props,
      hoveredTrial: {
        ...props.hoveredTrial,
        trial: {
          ...props.hoveredTrial.trial,
          labels: {[BASELINE_LABEL]: 'true'},
        },
      },
    }
    wrapper = shallow(<TrialPopup {...localProps} />)
    expect(
      wrapper.find('button[data-dom-id="popup-remove-baseline"]'),
    ).toHaveLength(1)
    expect(
      wrapper.find('button[data-dom-id="popup-remove-baseline"]').text(),
    ).toBe('REMOVE BASELINE')
    expect(props.baselineClick).toHaveBeenCalledTimes(1)
    expect(props.baselineClick.mock.calls[0][0]).toEqual(false)
    expect(props.baselineClick.mock.calls[0][1]).toEqual(
      localProps.hoveredTrial.trial,
    )
    wrapper
      .find('button[data-dom-id="popup-remove-baseline"]')
      .simulate('click')
    wrapper.unmount()
  })

  it('should trigger mouseOut and mouseOver', () => {
    wrapper = shallow(<TrialPopup {...props} />)
    wrapper
      .find('div')
      .first()
      .simulate('mouseOver')
    expect(props.mouseOver).toHaveBeenCalledTimes(1)
    wrapper
      .find('div')
      .first()
      .simulate('mouseOut')
    expect(props.mouseOut).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('should render tiral name with external link', () => {
    wrapper = shallow(<TrialPopup {...props} />)
    expect(wrapper.find('h5')).toHaveLength(1)
    expect(wrapper.find('h5').text()).toContain('test-experiment-120')
    expect(wrapper.find('h5 Icon')).toHaveLength(1)
    expect(wrapper.find('h5 a')).toHaveLength(1)
    expect(wrapper.find('h5 a').prop('target')).toBe('_blank')
    expect(wrapper.find('h5 a').prop('href')).toBeTruthy()
    wrapper.unmount()
  })

  it('should NOT render tiral name if no active experiment', () => {
    const localProps1 = {...props}
    delete localProps1.activeExperiment
    wrapper = shallow(<TrialPopup {...localProps1} />)
    expect(wrapper.find('h5')).toHaveLength(0)

    const localProps2 = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        index: 100000,
      },
    }
    wrapper = shallow(<TrialPopup {...localProps2} />)
    expect(wrapper.find('h5')).toHaveLength(0)
    wrapper.unmount()
  })
})
