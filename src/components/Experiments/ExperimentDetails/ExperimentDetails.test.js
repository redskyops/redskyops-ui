import React from 'react'
import {mount} from 'enzyme'

import {ExperimentDetails} from './ExperimentDetails.component'
import expStub from '../../../services/_stubs/exp-data'
import trialsStub from '../../../services/_stubs/trials-data'
import {ExperimentsService} from '../../../services/ExperimentsService'

jest.mock('../../../services/ExperimentsService', () =>
  jest.requireActual('../../../services/__mocks__/ExperimentsService'),
)

jest.mock('../ExperimentResults/ExperimentResults.component')
jest.mock('../../Tabs/Tabs.component')
jest.mock('../MetricParameterChart/MetricParameterChart.component')
jest.mock('../Labels/Labels.component')

describe('Component: ExperimentsDetails', () => {
  const expService = new ExperimentsService()
  let wrapper
  let props = {
    activeExperiment: {
      index: 0,
    },
    experiments: {
      list: expService.addIdsToExperiments(expStub).experiments,
      labelsFilter: [],
    },
    trials: trialsStub.trials,
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
    wrapper.unmount()
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
    wrapper.unmount()
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
    wrapper.unmount()
  })

  it('should ExperimentResults component with right props', () => {
    const localProps = {
      ...props,
    }
    wrapper = mount(<ExperimentDetails {...localProps} />)
    const resultComp = wrapper.find('ExperimentResults')
    expect(resultComp).toHaveLength(1)
    const resultsProps = resultComp.props()
    expect(typeof resultsProps.selectTrialHandler).toBe('function')
    wrapper.unmount()
  })

  it('should render trials statistics', () => {
    const localProps = {
      ...props,
    }
    wrapper = mount(<ExperimentDetails {...localProps} />)
    expect(wrapper.find('TrialsStatistics')).toHaveLength(1)
    expect(wrapper.find('TrialsStatistics').props()).toHaveProperty(
      'trials',
      props.trials,
    )
    wrapper.unmount()
  })

  it('should load trials data if active experiments', () => {
    expService.getTrialsFactory.mockImplementationOnce(() => [
      () => Promise.resolve(trialsStub),
      () => {},
    ])
    const localProps = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        isLoading: true,
      },
    }
    wrapper = mount(<ExperimentDetails {...localProps} />)
    expect(expService.getTrialsFactory).toHaveBeenCalledTimes(1)
    expect(expService.getTrialsFactory).toHaveBeenCalledWith({
      name: localProps.experiments.list[0].id,
    })
    wrapper.unmount()
  })

  it('should update state when trials are loaded', async done => {
    expService.getTrialsFactory.mockImplementationOnce(() => [
      () => Promise.resolve(trialsStub),
      () => {},
    ])
    const localProps = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        isLoading: true,
      },
    }
    wrapper = await mount(<ExperimentDetails {...localProps} />)
    setImmediate(() => {
      expect(localProps.updateState).toHaveBeenCalledTimes(1)
      expect(localProps.updateState.mock.calls[0][0]).toMatchObject({
        trials: trialsStub.trials,
        activeExperiment: {
          ...props.activeExperiment,
          isLoading: false,
        },
      })
      wrapper.unmount()
      done()
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
    wrapper.unmount()
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

    wrapper.setProps({
      activeExperiment: {
        ...props.activeExperiment,
        metricParameterChart: {
          parameter: 'cpu',
        },
      },
    })

    wrapper.find('MetricParameterChart').prop('onMetricChange')({
      item: {value: 'duration'},
    })
    expect(props.updateState).toHaveBeenCalledTimes(2)
    expect(props.updateState.mock.calls[1][0]).toMatchObject({
      activeExperiment: {
        ...props.activeExperiment,
        metricParameterChart: {
          metric: 'duration',
          parameter: 'cpu',
        },
      },
    })

    wrapper.unmount()
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

    wrapper.setProps({
      activeExperiment: {
        ...props.activeExperiment,
        metricParameterChart: {
          metric: 'duration',
        },
      },
    })
    wrapper.find('MetricParameterChart').prop('onParameterChange')({
      item: {value: 'cpu'},
    })
    expect(props.updateState).toHaveBeenCalledTimes(2)
    expect(props.updateState.mock.calls[1][0]).toMatchObject({
      activeExperiment: {
        ...props.activeExperiment,
        metricParameterChart: {
          metric: 'duration',
          parameter: 'cpu',
        },
      },
    })
    expect(
      props.updateState.mock.calls[1][0].activeExperiment.metricParameterChart,
    ).toHaveProperty('metric', 'duration')
    wrapper.unmount()
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
    wrapper.unmount()
  })

  it('should render trial detail if active trial is selected', async () => {
    const activeTrial = {
      index: 2,
      trial: trialsStub.trials[2],
    }
    wrapper = await mount(
      <ExperimentDetails {...props} activeTrial={activeTrial} />,
    )
    expect(wrapper.find('TrialDetails')).toHaveLength(1)
    expect(wrapper.find('TrialDetails').prop('trial')).toMatchObject(
      activeTrial.trial,
    )
    expect(wrapper.find('TrialDetails').prop('parameters')).toMatchObject(
      expStub.experiments[props.activeExperiment.index].parameters,
    )
    wrapper.unmount()
  })

  it('should update state to clear active trial', async () => {
    const activeTrial = {
      index: 2,
      trial: trialsStub.trials[2],
    }
    wrapper = await mount(
      <ExperimentDetails {...props} activeTrial={activeTrial} />,
    )
    expect(wrapper.find('TrialDetails')).toHaveLength(1)
    wrapper.find('TrialDetails').prop('closeHandler')()
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toMatchObject({
      activeTrial: null,
    })
    wrapper.unmount()
  })
})
