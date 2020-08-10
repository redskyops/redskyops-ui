import React from 'react'
import {shallow} from 'enzyme'

import {TrialDetails} from './TrialDetails.component'
import expStub from '../../../services/_stubs/exp-data'
import trialsStub from '../../../services/_stubs/trials-data'

jest.mock('../Labels/Labels.component.js')

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
      expect(parseInt(compProps.value)).toBe(props.trial.values[i].value)
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

  it('should set right css class if trial is optimal', () => {
    const localProps = {
      ...props,
      trial: {
        ...props.trial,
        labels: {best: 'true'},
      },
    }
    wrapper = shallow(<TrialDetails {...localProps} />)
    expect(wrapper.hasClass('best')).toBe(true)
    wrapper.unmount()
  })

  it('should not set best css class if lables object is missing', () => {
    const localProps = {
      ...props,
      trial: {
        ...props.trial,
      },
    }
    delete localProps.trial.labels
    wrapper = shallow(<TrialDetails {...localProps} />)
    expect(wrapper.hasClass('best')).toBe(false)
    wrapper.unmount()
  })

  it('should render Labels component', () => {
    wrapper = shallow(<TrialDetails {...props} />)
    expect(wrapper.find('Labels')).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render with empty parameters array if missing', () => {
    const localProps = {...props}
    delete localProps.parameters
    wrapper = shallow(<TrialDetails {...localProps} />)
    expect(wrapper.find('ValueDisplay')).toHaveLength(4)
    wrapper.find('ValueDisplay').forEach(vd => {
      expect(vd.prop('min')).toBeFalsy()
      expect(vd.prop('max')).toBeFalsy()
      expect(vd.prop('value')).toBeTruthy()
      expect(vd.prop('name')).toBeTruthy()
    })
    wrapper.unmount()
  })
})
