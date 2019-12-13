import React from 'react'
import {shallow} from 'enzyme'

import {TrialDetails} from './TrialDetails.component'
import expStub from '../../../services/_stubs/exp-data'
import trialsStub from '../../../services/_stubs/trials-data'

describe('Component: TrialDetails', () => {
  let wrapper
  const props = {
    parameters: expStub.experiments[0].parameters,
    trial: trialsStub.trials[2],
    closeHandler: jest.fn(),
  }

  beforeEach(() => {
    props.closeHandler.mockClear()
  })

  it('should render TrialDetails component', () => {
    wrapper = shallow(<TrialDetails {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render close button', () => {
    wrapper = shallow(<TrialDetails {...props} />)
    expect(wrapper.find('[data-dom-id="trial-close"]')).toHaveLength(1)
    wrapper.unmount()
  })

  it('should call closeHandler on close click', () => {
    wrapper = shallow(<TrialDetails {...props} />)
    wrapper.find('[data-dom-id="trial-close"]').simulate('click')
    expect(props.closeHandler).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('should render values', () => {
    wrapper = shallow(<TrialDetails {...props} />)

    expect(wrapper.find('[data-dom-id="trial-value-1"]')).toHaveLength(1)
    expect(wrapper.find('[data-dom-id="trial-value-1"]').text()).toBe(
      `${props.trial.values[0].metricName}: ${props.trial.values[0].value}`,
    )
    expect(wrapper.find('[data-dom-id="trial-value-2"]')).toHaveLength(1)
    expect(wrapper.find('[data-dom-id="trial-value-2"]').text()).toBe(
      `${props.trial.values[1].metricName}: ${props.trial.values[1].value}`,
    )
    wrapper.unmount()
  })

  it('should render parameters with their names and values', () => {
    wrapper = shallow(<TrialDetails {...props} />)
    props.trial.assignments.forEach(para => {
      const paraDom = wrapper.find(
        `[data-dom-id="trial-para-${para.parameterName}"]`,
      )
      expect(paraDom).toHaveLength(1)
      expect(paraDom.text()).toContain(para.parameterName)
      expect(paraDom.text()).toContain(para.value)
    })
    wrapper.unmount()
  })

  it('should render parameters with RangeIndicator', () => {
    wrapper = shallow(<TrialDetails {...props} />)
    props.trial.assignments.forEach(para => {
      const paraDom = wrapper.find(
        `[data-dom-id="trial-para-${para.parameterName}"]`,
      )
      expect(paraDom).toHaveLength(1)
      expect(paraDom.find('RangeIndicator')).toHaveLength(1)
      const indicatorProps = paraDom.find('RangeIndicator').props()
      const {bounds} = props.parameters.find(p => p.name === para.parameterName)
      expect(indicatorProps).toHaveProperty('value', para.value)
      expect(indicatorProps).toHaveProperty('min', bounds.min)
    })
    wrapper.unmount()
  })

  it('should render nothing if trial is not sent with props', () => {
    wrapper = shallow(<TrialDetails {...props} trial={null} />)
    expect(wrapper.html()).toBe(null)
    wrapper.unmount()
  })
})
