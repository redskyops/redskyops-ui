import React from 'react'
import {shallow} from 'enzyme'

import {ExperimentResults} from './ExperimentResults.component'

describe('Component: ExperimentResults', () => {
  let wrapper
  let props = {
    numOfMertics: 1,
    otherProp: 'test',
  }

  it('should render ExperimentResults component', () => {
    wrapper = shallow(<ExperimentResults {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('shourld render 1D chart with right props if experiment has one metric', () => {
    wrapper = shallow(<ExperimentResults {...props} />)
    expect(wrapper.find('DotsChart1D')).toHaveLength(1)
    expect(wrapper.find('DotsChart1D').props()).toHaveProperty(
      'otherProp',
      'test',
    )
    wrapper.unmount()
  })

  it('shourld render 2D chart with right props if experiment has 2 metrics', () => {
    wrapper = shallow(<ExperimentResults {...props} numOfMertics={2} />)
    expect(wrapper.find('DotsChart2D')).toHaveLength(1)
    expect(wrapper.find('DotsChart2D').props()).toHaveProperty(
      'otherProp',
      'test',
    )
    wrapper.unmount()
  })

  it('shourld render 3D chart with right props if experiment has 3 metrics', () => {
    wrapper = shallow(<ExperimentResults {...props} numOfMertics={3} />)
    expect(wrapper.find('DotsChart3D')).toHaveLength(1)
    expect(wrapper.find('DotsChart3D').props()).toHaveProperty(
      'otherProp',
      'test',
    )
    wrapper.unmount()
  })

  it('shourld render 3D chart with right props if experiment has more than 3 metrics', () => {
    wrapper = shallow(<ExperimentResults {...props} numOfMertics={5} />)
    expect(wrapper.find('DotsChart3D')).toHaveLength(1)
    expect(wrapper.find('DotsChart3D').props()).toHaveProperty(
      'otherProp',
      'test',
    )
    wrapper.unmount()
  })
})
