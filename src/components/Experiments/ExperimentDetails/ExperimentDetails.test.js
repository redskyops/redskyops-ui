import React from 'react'
import {mount} from 'enzyme'

import {ExperimentDetails} from './ExperimentDetails.component'
import expStub from '../../../services/_stubs/exp-data'
import trialStub from '../../../services/_stubs/trials-data'
import {ExperimentsService} from '../../../services/ExperimentsService'

jest.mock('../../../services/ExperimentsService', () =>
  jest.requireActual('../../../services/__mocks__/ExperimentsService'),
)

describe('Component: ExperimentsDetails', () => {
  const expService = new ExperimentsService()
  let wrapper
  let props = {
    activeExperiment: {
      index: 0,
    },
    experiments: {
      list: expService.addIdsToExperments(expStub).experiments,
    },
    trials: trialStub.trials,
    activeTrial: null,
    updateState: jest.fn(),
  }

  beforeEach(() => {
    props.updateState.mockClear()
    expService.getTrialsFactory.mockReset()
  })

  it('should render ExperimentDetails', () => {
    wrapper = mount(<ExperimentDetails {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render select experiments statement', () => {
    const localProps = {
      ...props,
      activeExperiment: null,
    }
    wrapper = mount(<ExperimentDetails {...localProps} />)
    expect(wrapper.find('[data-dom-id="exp-details-select"]')).toHaveLength(1)
  })

  it('should render no valid metrics statement', () => {
    const localProps = {
      ...props,
      experiments: {
        ...props.experiments,
        list: [...props.experiments.list],
      },
      activeExperiment: {
        index: props.experiments.list.length,
      },
    }
    localProps.experiments.list.push({...props.experiments.list[0]})
    localProps.experiments.list[localProps.activeExperiment.index].metrics = []
    wrapper = mount(<ExperimentDetails {...localProps} />)
    expect(wrapper.find('[data-dom-id="exp-details-no-metrics"]')).toHaveLength(
      1,
    )
  })

  it('should render no trials statement', () => {
    const localProps = {
      ...props,
      trials: [],
    }
    wrapper = mount(<ExperimentDetails {...localProps} />)
    expect(wrapper.find('[data-dom-id="exp-details-no-trials"]')).toHaveLength(
      1,
    )
  })

  it('should Trials component with right props', () => {
    const localProps = {
      ...props,
    }
    wrapper = mount(<ExperimentDetails {...localProps} />)
    const trialsComp = wrapper.find('Trials')
    expect(trialsComp).toHaveLength(1)
    const trialsProps = trialsComp.props()
    expect(trialsProps).toHaveProperty('trials', localProps.trials)
    expect(trialsProps).toHaveProperty('xAxisMetricName', 'cost')
    expect(trialsProps).toHaveProperty('yAxisMetricName', 'duration')
    expect(typeof trialsProps.selectTrialHandler).toBe('function')
  })

  it('should render trials statistics', () => {
    const localProps = {
      ...props,
    }
    wrapper = mount(<ExperimentDetails {...localProps} />)
    expect(
      wrapper.find('[data-dom-id="exp-details-trials-total"]'),
    ).toHaveLength(1)
    expect(
      wrapper.find('[data-dom-id="exp-details-trials-total"]').text(),
    ).toBe(`${localProps.trials.length}`)
    expect(
      wrapper.find('[data-dom-id="exp-details-trials-completed"]'),
    ).toHaveLength(1)
    expect(
      wrapper.find('[data-dom-id="exp-details-trials-completed"]').text(),
    ).toBe('38')
    expect(
      wrapper.find('[data-dom-id="exp-details-trials-failed"]'),
    ).toHaveLength(1)
    expect(
      wrapper.find('[data-dom-id="exp-details-trials-failed"]').text(),
    ).toBe('2')
  })

  it('should load trials data if active experiments', () => {
    expService.getTrialsFactory.mockImplementationOnce(() => [
      () => Promise.resolve(trialStub),
      () => {},
    ])
    const localProps = {
      ...props,
    }
    wrapper = mount(<ExperimentDetails {...localProps} />)
    expect(expService.getTrialsFactory).toHaveBeenCalledTimes(1)
    expect(expService.getTrialsFactory).toHaveBeenCalledWith({
      name: localProps.experiments.list[0].id,
    })
  })

  it('should update state when trials are loaded', async () => {
    expService.getTrialsFactory.mockImplementationOnce(() => [
      () => Promise.resolve(trialStub),
      () => {},
    ])
    const localProps = {
      ...props,
    }
    wrapper = await mount(<ExperimentDetails {...localProps} />)
    expect(localProps.updateState).toHaveBeenCalledTimes(1)
    expect(localProps.updateState.mock.calls[0][0]).toMatchObject({
      trials: trialStub.trials,
    })
  })

  it('should render MetricParameterChart component', async () => {
    wrapper = await mount(<ExperimentDetails {...props} />)
    expect(wrapper.find('MetricParameterChart')).toHaveLength(1)
    let chartProps = wrapper.find('MetricParameterChart').props()
    expect(chartProps).toHaveProperty('trials', props.trials)
    expect(chartProps).toHaveProperty('activeTrial', props.activeTrial)
    expect(chartProps).toHaveProperty('metricsList', ['cost', 'duration'])
    expect(chartProps).toHaveProperty('parametersList', ['cpu', 'memory'])
    expect(chartProps).toHaveProperty('metric', null)
    expect(chartProps).toHaveProperty('parameter', null)
    wrapper.setProps({
      activeExperiment: {
        ...props.activeExperiment,
        metricParameterChart: {
          metric: 'cost',
          parameter: 'memory',
        },
      },
    })
    chartProps = wrapper.find('MetricParameterChart').props()
    expect(chartProps).toHaveProperty('metric', 'cost')
    expect(chartProps).toHaveProperty('parameter', 'memory')
  })

  it('should update change when metric changed in MetricParameterChart', async () => {
    wrapper = await mount(<ExperimentDetails {...props} />)
    expect(wrapper.find('MetricParameterChart')).toHaveLength(1)
    wrapper.find('MetricParameterChart').prop('onMetricChange')({
      item: {value: 'duration'},
    })
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toMatchObject({
      activeExperiment: {
        ...props.activeExperiment,
        metricParameterChart: {
          metric: 'duration',
        },
      },
    })
  })

  it('should update change when parameter changed in MetricParameterChart', async () => {
    wrapper = await mount(<ExperimentDetails {...props} />)
    expect(wrapper.find('MetricParameterChart')).toHaveLength(1)
    wrapper.find('MetricParameterChart').prop('onParameterChange')({
      item: {value: 'cpu'},
    })
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toMatchObject({
      activeExperiment: {
        ...props.activeExperiment,
        metricParameterChart: {
          parameter: 'cpu',
        },
      },
    })
  })

  it('should update when trial is selected in MetricParameterChart', async () => {
    wrapper = await mount(<ExperimentDetails {...props} />)
    expect(wrapper.find('MetricParameterChart')).toHaveLength(1)
    wrapper.find('MetricParameterChart').prop('selectTrialHandler')({
      index: 1,
      trial: {name: 'trial'},
    })
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toMatchObject({
      activeTrial: {
        index: 1,
        trial: {name: 'trial'},
      },
    })
    wrapper.setProps({
      activeTrial: {
        index: 1,
      },
    })
    wrapper.find('MetricParameterChart').prop('selectTrialHandler')({
      index: 1,
      trial: {name: 'trial'},
    })
    expect(props.updateState).toHaveBeenCalledTimes(2)
    expect(props.updateState.mock.calls[1][0]).toMatchObject({
      activeTrial: null,
    })
  })
})
