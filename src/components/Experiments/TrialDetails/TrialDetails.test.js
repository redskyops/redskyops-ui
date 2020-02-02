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
  }

  beforeEach(() => {})

  it('should render TrialDetails component', () => {
    wrapper = shallow(<TrialDetails {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render DisplayValue component for values', () => {
    wrapper = shallow(<TrialDetails {...props} />)
    expect(wrapper.find('.metricsCol ValueDisplay')).toHaveLength(2)
    wrapper.find('.metricsCol ValueDisplay').forEach((comp, i) => {
      const compProps = comp.props()
      expect(compProps.name).toBe(props.trial.values[i].metricName)
      expect(compProps.value).toBe(props.trial.values[i].value)
    })
    wrapper.unmount()
  })

  it('should render DisplayValue component for parameters ', () => {
    wrapper = shallow(<TrialDetails {...props} />)
    expect(wrapper.find('.parametersCol ValueDisplay')).toHaveLength(2)
    wrapper.find('.parametersCol ValueDisplay').forEach((comp, i) => {
      const compProps = comp.props()
      expect(compProps.name).toBe(props.trial.assignments[i].parameterName)
      expect(compProps.value).toBe(props.trial.assignments[i].value)
      expect(compProps.min).toBe(
        props.parameters.find(p => p.name === compProps.name).bounds.min,
      )
      expect(compProps.max).toBe(
        props.parameters.find(p => p.name === compProps.name).bounds.max,
      )
    })
    wrapper.unmount()
  })

  it('should render best icon if trial is optimal', () => {
    const localProps = {
      ...props,
      trial: {
        ...props.trial,
        labels: {best: 'true'},
      },
    }
    wrapper = shallow(<TrialDetails {...localProps} />)
    expect(wrapper.find('Icon[icon="circleCheck"]')).toHaveLength(2)
    wrapper.setProps(props)
    expect(wrapper.find('Icon[icon="circleCheck"]')).toHaveLength(0)
    wrapper.unmount()
  })
})
