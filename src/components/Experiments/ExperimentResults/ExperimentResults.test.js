import React from 'react'
import {shallow} from 'enzyme'

import {ExperimentResults} from './ExperimentResults.component'

describe('Component: ExperimentResults', () => {
  let wrapper
  let props = {
    experiments: {
      labelsFilter: {},
    },
    activeExperiment: {
      metricsList: [],
      parametersList: [],
      xAxisMetric: 'cost',
      yAxisMetric: 'duration',
      zAxisMetric: 'throughput',
    },
  }

  it('should render ExperimentResults component', () => {
    wrapper = shallow(<ExperimentResults {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('shourld render 1D chart with right props if experiment has one metric', () => {
    const localProps = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        metricsList: ['cost'],
      },
    }
    wrapper = shallow(<ExperimentResults {...localProps} />)
    expect(wrapper.find('DotsChart1D')).toHaveLength(1)
    wrapper.unmount()
  })

  it('shourld render 2D chart with right props if experiment has 2 metrics', () => {
    const localProps = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        metricsList: ['cost', 'duration'],
      },
    }
    wrapper = shallow(<ExperimentResults {...localProps} />)
    expect(wrapper.find('DotsChart2D')).toHaveLength(1)
    wrapper.unmount()
  })

  it('shourld render 3D chart with right props if experiment has 3 metrics', () => {
    const localProps = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        metricsList: ['cost', 'duration', 'throughput'],
      },
    }
    wrapper = shallow(<ExperimentResults {...localProps} />)
    expect(wrapper.find('DotsChart3D')).toHaveLength(1)
    wrapper.unmount()
  })

  it('shourld render 3D chart with right props if experiment has more than 3 metrics', () => {
    const localProps = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        metricsList: ['cost', 'duration', 'throughput', 'anoth_metric'],
      },
    }
    wrapper = shallow(<ExperimentResults {...localProps} />)
    expect(wrapper.find('DotsChart3D')).toHaveLength(1)
    wrapper.unmount()
  })
})
