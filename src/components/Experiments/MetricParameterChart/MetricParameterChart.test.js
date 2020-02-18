import React from 'react'
import {shallow} from 'enzyme'

import {MetricParameterChart} from './MetricParameterChart.component'
import trialsStub from '../../../services/_stubs/trials-data'

describe('Component: MetricParameterChart', () => {
  let wrapper
  const props = {
    trials: trialsStub,
    metricsList: ['duration', 'cost'],
    parametersList: ['cpu', 'memory'],
    labelsList: ['best'],
    onMetricChange: jest.fn(),
    onParameterChange: jest.fn(),
    selectTrialHandler: jest.fn(),
    filterChangeHandler: jest.fn(),
  }

  beforeEach(() => {
    props.onParameterChange.mockClear()
    props.onMetricChange.mockClear()
    props.selectTrialHandler.mockClear()
    props.filterChangeHandler.mockClear()
  })

  it('should render MetricParameterChart', () => {
    wrapper = shallow(<MetricParameterChart {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render dropdowns for metrics and parameters', () => {
    wrapper = shallow(<MetricParameterChart {...props} />)
    expect(wrapper.find('ListSearch')).toHaveLength(2)
    wrapper.unmount()
  })

  it('should set right props for metrics dropdown', () => {
    wrapper = shallow(<MetricParameterChart {...props} />)
    expect(
      wrapper
        .find('ListSearch')
        .first()
        .prop('value'),
    ).toBeFalsy()
    expect(
      Array.isArray(
        wrapper
          .find('ListSearch')
          .first()
          .prop('itemsList'),
      ),
    ).toBe(true)
    wrapper
      .find('ListSearch')
      .first()
      .prop('itemsList')
      .forEach((item, i) => {
        expect(item).toMatchObject({
          label: props.metricsList[i].toUpperCase().replace(/_/g, ' '),
          value: props.metricsList[i],
        })
      })
    wrapper.setProps({metric: 'cost'})
    expect(
      wrapper
        .find('ListSearch')
        .first()
        .prop('value'),
    ).toBe('cost')
    wrapper.unmount()
  })

  it('should set right props for prameters dropdown', () => {
    wrapper = shallow(<MetricParameterChart {...props} />)
    expect(
      wrapper
        .find('ListSearch')
        .last()
        .prop('value'),
    ).toBeFalsy()
    expect(
      Array.isArray(
        wrapper
          .find('ListSearch')
          .first()
          .prop('itemsList'),
      ),
    ).toBe(true)
    wrapper
      .find('ListSearch')
      .last()
      .prop('itemsList')
      .forEach((item, i) => {
        expect(item).toMatchObject({
          label: props.parametersList[i].toUpperCase().replace(/_/g, ' '),
          value: props.parametersList[i],
        })
      })
    wrapper.setProps({metric: 'cpu'})
    expect(
      wrapper
        .find('ListSearch')
        .first()
        .prop('value'),
    ).toBe('cpu')
    wrapper.unmount()
  })

  it('should render DotsChart2D only if metric and parameter props are set', () => {
    wrapper = shallow(<MetricParameterChart {...props} />)
    expect(wrapper.find('DotsChart2D')).toHaveLength(0)
    wrapper.setProps({metric: 'cost', parameter: 'cpu'})
    expect(wrapper.find('DotsChart2D')).toHaveLength(1)
    wrapper.unmount()
  })

  it('should set right props for DotsChart2D', () => {
    wrapper = shallow(
      <MetricParameterChart
        {...props}
        metric="cost"
        parameter="memory"
        activeTrial={{index: 1}}
      />,
    )
    const chartProps = wrapper.find('DotsChart2D').props()
    expect(chartProps).toHaveProperty('trials', props.trials)
    expect(chartProps).toHaveProperty('xAxisValueType', 'parameter')
    expect(chartProps).toHaveProperty('xAxisMetricName', 'memory')
    expect(chartProps).toHaveProperty('yAxisMetricName', 'cost')
    expect(chartProps).toHaveProperty(
      'selectTrialHandler',
      props.selectTrialHandler,
    )
    expect(chartProps.activeTrial).toMatchObject({index: 1})
    wrapper.unmount()
  })

  it('should render clear button if metric and parameter are selected', () => {
    wrapper = shallow(
      <MetricParameterChart
        {...props}
        metric="cost"
        parameter="memory"
        activeTrial={{index: 1}}
      />,
    )
    expect(
      wrapper.find('button[data-dom-id="metric-param-clear"]'),
    ).toHaveLength(1)
    wrapper.unmount()
  })

  it('should call right props when clear button clicked', () => {
    wrapper = shallow(
      <MetricParameterChart
        {...props}
        metric="cost"
        parameter="memory"
        activeTrial={{index: 1}}
      />,
    )
    wrapper.find('button[data-dom-id="metric-param-clear"]').simulate('click')
    expect(props.onMetricChange).toHaveBeenCalledTimes(1)
    expect(props.onMetricChange.mock.calls[0][0]).toBeFalsy()
    expect(props.onParameterChange).toHaveBeenCalledTimes(1)
    expect(props.onParameterChange.mock.calls[0][0]).toBeFalsy()
    wrapper.unmount()
  })
})
