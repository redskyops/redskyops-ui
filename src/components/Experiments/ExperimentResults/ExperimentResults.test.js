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
      labelsList: [],
      labelsFilter: [],
      xAxisMetric: 'cost',
      yAxisMetric: 'duration',
      zAxisMetric: 'throughput',
    },
    selectTrialHandler: jest.fn(),
    filterChangeHandler: jest.fn(),
    updateState: jest.fn(),
  }

  beforeEach(() => {
    props.updateState.mockClear()
    props.selectTrialHandler.mockClear()
    props.filterChangeHandler.mockClear()
  })

  it('should render ExperimentResults component', () => {
    wrapper = shallow(<ExperimentResults {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render 1D chart with right props if experiment has one metric', () => {
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

  it('should render 2D chart with right props if experiment has 2 metrics', () => {
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

  it('should render 3D chart with right props if experiment has 3 metrics', () => {
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

  it('should render 3D chart with right props if experiment has more than 3 metrics', () => {
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

  it('should set right props for chart component', () => {
    const localProps = {
      ...props,
      trials: [{number: 12}],
      activeTrial: {index: 12},
      activeExperiment: {
        ...props.activeExperiment,
        metricsList: ['cost', 'duration'],
        labelsFilter: ['cost'],
      },
    }
    wrapper = shallow(<ExperimentResults {...localProps} />)
    expect(wrapper.find('DotsChart2D')).toHaveLength(1)
    const chartProps = wrapper.find('DotsChart2D').props()
    expect(chartProps).toHaveProperty('trials', localProps.trials)
    expect(chartProps).toHaveProperty('activeTrial', localProps.activeTrial)
    expect(chartProps).toHaveProperty(
      'selectTrialHandler',
      localProps.selectTrialHandler,
    )
    expect(chartProps).toHaveProperty('numOfMertics', 2)
    expect(chartProps).toHaveProperty('labelsFilter', ['cost'])
    expect(chartProps).toHaveProperty('xAxisMetricName', 'cost')
    expect(chartProps).toHaveProperty('yAxisMetricName', 'duration')
    expect(chartProps).toHaveProperty('xAxisMinValue', 0)
    wrapper.unmount()
  })

  it('should render dropdow for X axis metric selection', () => {
    const localProps = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        metricsList: ['cost', 'duration'],
      },
    }
    wrapper = shallow(<ExperimentResults {...localProps} />)
    expect(wrapper.find('ListSearch')).toHaveLength(2)
    const listProps = wrapper
      .find('ListSearch')
      .first()
      .props()
    expect(listProps.value).toBe(props.activeExperiment.xAxisMetric)
    expect(Array.isArray(listProps.itemsList)).toBe(true)
    expect(listProps.itemsList.map(i => i.value)).toMatchObject(
      localProps.activeExperiment.metricsList,
    )
    wrapper.unmount()
  })

  it('should update state when X axis metric change', () => {
    const localProps = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        metricsList: ['cost', 'duration'],
      },
    }
    wrapper = shallow(<ExperimentResults {...localProps} />)
    expect(wrapper.find('ListSearch')).toHaveLength(2)
    const listProps = wrapper
      .find('ListSearch')
      .first()
      .props()
    listProps.onSelect({index: 1, item: {value: 'duration'}})
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toMatchObject({
      activeExperiment: {
        ...localProps.activeExperiment,
        xAxisMetric: 'duration',
      },
    })
    wrapper.unmount()
  })

  it('should render dropdow for Y axis metric selection', () => {
    const localProps = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        metricsList: ['cost', 'duration'],
      },
    }
    wrapper = shallow(<ExperimentResults {...localProps} />)
    expect(wrapper.find('ListSearch')).toHaveLength(2)
    const listProps = wrapper
      .find('ListSearch')
      .last()
      .props()
    expect(listProps.value).toBe(props.activeExperiment.yAxisMetric)
    expect(Array.isArray(listProps.itemsList)).toBe(true)
    expect(listProps.itemsList.map(i => i.value)).toMatchObject(
      localProps.activeExperiment.metricsList,
    )
    wrapper.unmount()
  })

  it('should update state when Y axis metric change', () => {
    const localProps = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        metricsList: ['cost', 'duration'],
      },
    }
    wrapper = shallow(<ExperimentResults {...localProps} />)
    expect(wrapper.find('ListSearch')).toHaveLength(2)
    const listProps = wrapper
      .find('ListSearch')
      .last()
      .props()
    listProps.onSelect({index: 0, item: {value: 'cost'}})
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toMatchObject({
      activeExperiment: {
        ...localProps.activeExperiment,
        yAxisMetric: 'cost',
      },
    })
    wrapper.unmount()
  })

  it('should render dropdow for Z axis metric selection', () => {
    const localProps = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        metricsList: ['cost', 'duration', 'throuhput'],
      },
    }
    wrapper = shallow(<ExperimentResults {...localProps} />)
    expect(wrapper.find('ListSearch')).toHaveLength(3)
    const listProps = wrapper
      .find('ListSearch')
      .last()
      .props()
    expect(listProps.value).toBe(props.activeExperiment.zAxisMetric)
    expect(Array.isArray(listProps.itemsList)).toBe(true)
    expect(listProps.itemsList.map(i => i.value)).toMatchObject(
      localProps.activeExperiment.metricsList,
    )
    wrapper.unmount()
  })

  it('should update state when Z axis metric change', () => {
    const localProps = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        metricsList: ['cost', 'duration', 'throughput'],
      },
    }
    wrapper = shallow(<ExperimentResults {...localProps} />)
    expect(wrapper.find('ListSearch')).toHaveLength(3)
    const listProps = wrapper
      .find('ListSearch')
      .last()
      .props()
    listProps.onSelect({index: 0, item: {value: 'cost'}})
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toMatchObject({
      activeExperiment: {
        ...localProps.activeExperiment,
        zAxisMetric: 'cost',
      },
    })
    wrapper.unmount()
  })

  it('should render labels filter component with right props', () => {
    const localProps = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        labelsList: ['best', 'optimal', 'bad'],
        labelsFilter: ['optimal'],
      },
    }
    wrapper = shallow(<ExperimentResults {...localProps} />)
    expect(wrapper.find('LabelsFilter')).toHaveLength(1)
    const filterProps = wrapper.find('LabelsFilter').props()
    expect(filterProps.selectedValues).toBe(
      localProps.activeExperiment.labelsFilter,
    )
    expect(filterProps.labelsList).toBe(localProps.activeExperiment.labelsList)
    expect(filterProps.onChange).toBe(localProps.filterChangeHandler)
    wrapper.unmount()
  })
})
