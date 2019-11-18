import React from 'react'
import {shallow} from 'enzyme'

import {Trials} from './Trials.component'
import trailsStub from '../../../services/_stubs/trials-data'

describe('Component: Trials', () => {
  let wrapper
  let props = {
    trials: trailsStub.trials,
    activeTrial: null,
    xAxisMetricName: 'cost',
    yAxisMetricName: 'duration',
    selectTrialHandler: jest.fn(),
  }

  beforeEach(() => {
    props.selectTrialHandler.mockClear()
  })

  it('should render Trials component', () => {
    wrapper = shallow(<Trials {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })
})
