import React from 'react'
import {shallow, mount} from 'enzyme'

import {ExperimentDetails} from './ExperimentDetails.component'
import expStub from '../../../services/_stubs/exp-data'
import trialsStub from '../../../services/_stubs/trials-data'
import {ExperimentsService} from '../../../services/ExperimentsService'
import {BASELINE_LABEL, DEFAULT_LABEL_VALUE} from '../../../constants'

jest.mock('../../../services/ExperimentsService', () =>
  jest.requireActual('../../../services/__mocks__/ExperimentsService'),
)

jest.mock('../ExperimentResults/ExperimentResults.component')
jest.mock('../../Tabs/Tabs.component')
jest.mock('../MetricParameterChart/MetricParameterChart.component')
jest.mock('../Labels/Labels.component')
jest.mock('../TrialPopup/TrialPopup.component')
jest.mock('../TrialsStatistics/TrialsStatistics.component')

describe('Component: ExperimentsDetails', () => {
  const expService = new ExperimentsService()
  let wrapper
  let props = {
    activeExperiment: {
      index: 0,
      metricsList: ['cost', 'duration'],
      parametersList: ['cpu', 'memory'],
      labelsList: ['best'],
      metricsRanges: {
        cost: {min: 0, max: 100, rangeMin: 0, rangeMax: 100},
        duration: {min: 0, max: 200, rangeMin: 0, rangeMax: 200},
        cpu: {min: 0, max: 500, rangeMin: 0, rangeMax: 400},
        memory: {min: 0, max: 100, rangeMin: 0, rangeMax: 1000},
      },
    },
    experiments: {
      list: expService.addIdsToExperiments(expStub).experiments,
      labelsFilter: [],
    },
    trials: trialsStub.trials,
    activeTrial: null,
    labels: {
      postingNewLabel: false,
      postingDelLabel: false,
      newLabel: '',
      labelToDelete: '',
      baselineAddNumber: -1,
      baselineDelNumber: -1,
      error: '',
    },
    updateState: jest.fn(),
  }

  beforeEach(() => {
    props.updateState.mockClear()
    expService.getTrialsFactory.mockReset()
    expService.postLabelToTrialFactory.mockReset()
  })

  it('should render ExperimentDetails', () => {
    wrapper = shallow(<ExperimentDetails {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render select experiments statement', () => {
    const localProps = {
      ...props,
      activeExperiment: null,
    }
    wrapper = shallow(<ExperimentDetails {...localProps} />)
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
    wrapper = shallow(<ExperimentDetails {...localProps} />)
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
    wrapper = shallow(<ExperimentDetails {...localProps} />)
    expect(wrapper.find('[data-dom-id="exp-details-no-trials"]')).toHaveLength(
      1,
    )
    wrapper.unmount()
  })

  it('should ExperimentResults component with right props', () => {
    wrapper = shallow(<ExperimentDetails {...props} />)
    const resultComp = wrapper.find('ExperimentResults')
    expect(resultComp).toHaveLength(1)
    const resultsProps = resultComp.props()
    expect(typeof resultsProps.selectTrialHandler).toBe('function')
    expect(typeof resultsProps.filterChangeHandler).toBe('function')
    wrapper.unmount()
  })

  it('should render trials statistics', () => {
    wrapper = shallow(<ExperimentDetails {...props} />)
    expect(wrapper.find('TrialsStatistics')).toHaveLength(2)
    const statisticsProps = wrapper
      .find('TrialsStatistics')
      .first()
      .props()
    expect(statisticsProps).toHaveProperty('trials', props.trials)
    expect(statisticsProps).toHaveProperty(
      'activeExperiment',
      props.activeExperiment,
    )
    expect(typeof statisticsProps.onSliderChange).toBe('function')
    wrapper.unmount()
  })

  it('should update state on slider change', () => {
    wrapper = shallow(<ExperimentDetails {...props} />)
    expect(wrapper.find('TrialsStatistics')).toHaveLength(2)
    const statisticsProps = wrapper
      .find('TrialsStatistics')
      .first()
      .props()
    statisticsProps.onSliderChange({metric: 'cost', range: {min: 5, max: 20}})
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toEqual({
      activeExperiment: {
        ...props.activeExperiment,
        metricsRanges: {
          ...props.activeExperiment.metricsRanges,
          cost: {
            ...props.activeExperiment.metricsRanges.cost,
            min: 5,
            max: 20,
          },
        },
      },
    })
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
    wrapper = shallow(<ExperimentDetails {...localProps} />)
    expect(expService.getTrialsFactory).toHaveBeenCalledTimes(1)
    expect(expService.getTrialsFactory).toHaveBeenCalledWith({
      name: localProps.experiments.list[0].id,
    })
    wrapper.unmount()
  })

  it('should update state and set metrics ranges when trials are loaded', async done => {
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
      expect(localProps.updateState.mock.calls[0][0]).toEqual({
        trials: trialsStub.trials,
        activeExperiment: {
          ...props.activeExperiment,
          isLoading: false,
          metricsRanges: {
            cost: {
              max: 96,
              min: 0,
              rangeMax: 96,
              rangeMin: 3,
            },
            cpu: {
              max: 3935,
              min: 0,
              rangeMax: 3935,
              rangeMin: 100,
            },
            duration: {
              max: 131,
              min: 0,
              rangeMax: 131,
              rangeMin: 1,
            },
            memory: {
              max: 4000,
              min: 0,
              rangeMax: 4000,
              rangeMin: 500,
            },
          },
        },
      })
      wrapper.unmount()
      done()
    })
  })

  it('should render MetricParameterChart component', () => {
    wrapper = shallow(<ExperimentDetails {...props} />)
    expect(wrapper.find('MetricParameterChart')).toHaveLength(1)
    let chartProps = wrapper.find('MetricParameterChart').props()
    expect(chartProps).toHaveProperty('trials', props.trials)
    expect(chartProps).toHaveProperty('activeTrial', props.activeTrial)
    expect(chartProps).toHaveProperty('metricsList', ['cost', 'duration'])
    expect(chartProps).toHaveProperty('parametersList', ['cpu', 'memory'])
    expect(chartProps).toHaveProperty('labelsList', ['best'])
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

  it('should update change when metric changed in MetricParameterChart', () => {
    wrapper = shallow(<ExperimentDetails {...props} />)
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

  it('should update state when parameter changed in MetricParameterChart', () => {
    wrapper = shallow(<ExperimentDetails {...props} />)
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

  it('should update state when trial is selected in MetricParameterChart', () => {
    wrapper = shallow(<ExperimentDetails {...props} />)
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

  it('should update state filter if change in one of chart components', () => {
    wrapper = shallow(<ExperimentDetails {...props} />)
    expect(wrapper.find('MetricParameterChart')).toHaveLength(1)
    wrapper.find('MetricParameterChart').prop('filterChangeHandler')({
      indexs: [0],
      items: [{value: 'best'}],
    })
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toMatchObject({
      activeExperiment: {
        ...props.activeExperiment,
        labelsFilter: ['best'],
      },
    })

    wrapper.unmount()
  })

  it('should render trial detail if active trial is selected', () => {
    const activeTrial = {
      index: 2,
      trial: trialsStub.trials[2],
    }
    wrapper = shallow(
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

  it('should update state to clear active trial', () => {
    const activeTrial = {
      index: 2,
      trial: trialsStub.trials[2],
    }
    wrapper = shallow(
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

  it('should render TrialPopup component', () => {
    wrapper = shallow(<ExperimentDetails {...props} />)
    expect(wrapper.find('TrialPopup')).toHaveLength(1)
    expect(typeof wrapper.find('TrialPopup').prop('mouseOver')).toBe('function')
    expect(typeof wrapper.find('TrialPopup').prop('mouseOut')).toBe('function')
    expect(typeof wrapper.find('TrialPopup').prop('baselineClick')).toBe(
      'function',
    )
    wrapper.unmount()
  })

  it('should hide trial popup after delay for mouse sensitivity', () => {
    jest.useFakeTimers()
    wrapper = shallow(<ExperimentDetails {...props} />)
    wrapper.find('ExperimentResults').prop('hoverTrialHandler')({
      trial: null,
    })
    jest.runAllTimers()
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toEqual({
      hoveredTrial: null,
    })
    wrapper.unmount()
    jest.useRealTimers()
  })

  it('should top hiding trial popup if it hovered', () => {
    const clearIntMock = jest.spyOn(window, 'clearInterval')
    wrapper = shallow(<ExperimentDetails {...props} />)
    expect(wrapper.find('TrialPopup')).toHaveLength(1)
    wrapper.find('TrialPopup').prop('mouseOver')()
    expect(clearIntMock).toHaveBeenCalledTimes(1)
    wrapper.unmount()
    clearIntMock.mockRestore()
  })

  it('should trigger hiding of popup if popup mouse out', () => {
    const setTimeMock = jest.spyOn(window, 'setTimeout')
    wrapper = shallow(<ExperimentDetails {...props} />)
    expect(wrapper.find('TrialPopup')).toHaveLength(1)
    wrapper.find('TrialPopup').prop('mouseOut')()
    expect(setTimeMock).toHaveBeenCalledTimes(1)
    wrapper.unmount()
    setTimeMock.mockRestore()
  })

  it('should update state and set ADD new label flag if set baseline clicked in trial popup', () => {
    wrapper = shallow(<ExperimentDetails {...props} />)
    expect(wrapper.find('TrialPopup')).toHaveLength(1)
    wrapper.find('TrialPopup').prop('baselineClick')(true, props.trials[3])()
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toEqual({
      labels: {
        ...props.labels,
        postingNewLabel: true,
        newLabel: BASELINE_LABEL,
        baselineAddNumber: props.trials[3].number,
      },
    })
    wrapper.unmount()
  })

  it('should update state and set REMOVE label flag if set baseline clicked in trial popup', () => {
    const localProps = {
      ...props,
      trials: [...props.trials],
    }
    localProps.trials[5] = {
      ...localProps.trials[5],
      labels: {[BASELINE_LABEL]: true},
    }

    wrapper = shallow(<ExperimentDetails {...localProps} />)
    expect(wrapper.find('TrialPopup')).toHaveLength(1)
    wrapper.find('TrialPopup').prop('baselineClick')(true, props.trials[3])()
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toEqual({
      labels: {
        ...props.labels,
        postingNewLabel: true,
        newLabel: BASELINE_LABEL,
        baselineAddNumber: props.trials[3].number,
        postingDelLabel: true,
        labelToDelete: BASELINE_LABEL,
        baselineDelNumber: localProps.trials[5].number,
      },
    })
    wrapper.unmount()
  })

  it('should call back end to remove current baseline trial if new one selected', () => {
    expService.postLabelToTrialFactory.mockImplementationOnce(() => [
      () => Promise.resolve({}),
      () => {},
    ])
    const localProps = {
      ...props,
      labels: {
        ...props.labels,
        postingNewLabel: true,
        newLabel: BASELINE_LABEL,
        baselineAddNumber: props.trials[3].number,
        postingDelLabel: true,
        labelToDelete: BASELINE_LABEL,
        baselineDelNumber: props.trials[5].number,
      },
    }
    wrapper = shallow(<ExperimentDetails {...localProps} />)
    expect(expService.postLabelToTrialFactory).toHaveBeenCalledTimes(1)
    expect(expService.postLabelToTrialFactory.mock.calls[0][0]).toEqual({
      experimentId: props.experiments.list[props.activeExperiment.index].id,
      trialId: localProps.labels.baselineDelNumber,
      labels: {[BASELINE_LABEL]: ''},
    })
    wrapper.unmount()
  })

  it('should update state on successful baseline label delete', done => {
    expService.postLabelToTrialFactory.mockImplementationOnce(() => [
      () => Promise.resolve({}),
      () => {},
    ])
    const localProps = {
      ...props,
      labels: {
        ...props.labels,
        postingNewLabel: true,
        newLabel: BASELINE_LABEL,
        baselineAddNumber: props.trials[3].number,
        postingDelLabel: true,
        labelToDelete: BASELINE_LABEL,
        baselineDelNumber: props.trials[5].number,
      },
    }
    wrapper = mount(<ExperimentDetails {...localProps} />)
    expect(expService.postLabelToTrialFactory).toHaveBeenCalledTimes(1)
    setImmediate(() => {
      expect(props.updateState).toHaveBeenCalledTimes(1)
      expect(props.updateState.mock.calls[0][0].labels).toEqual({
        ...localProps.labels,
        postingDelLabel: false,
        labelToDelete: '',
        baselineDelNumber: -1,
      })
      expect(props.updateState.mock.calls[0][0]).not.toHaveProperty(
        'hoveredTrial',
      )
      wrapper.unmount()
      done()
    })
  })

  it('should update state and remove popup on successful baseline label delete', done => {
    expService.postLabelToTrialFactory.mockImplementationOnce(() => [
      () => Promise.resolve({}),
      () => {},
    ])
    const localProps = {
      ...props,
      labels: {
        ...props.labels,
        postingNewLabel: false,
        newLabel: '',
        baselineAddNumber: -1,
        postingDelLabel: true,
        labelToDelete: BASELINE_LABEL,
        baselineDelNumber: props.trials[5].number,
      },
    }
    wrapper = mount(<ExperimentDetails {...localProps} />)
    expect(expService.postLabelToTrialFactory).toHaveBeenCalledTimes(1)
    setImmediate(() => {
      expect(props.updateState).toHaveBeenCalledTimes(1)
      expect(props.updateState.mock.calls[0][0].labels).toEqual({
        ...localProps.labels,
        postingDelLabel: false,
        labelToDelete: '',
        baselineDelNumber: -1,
      })
      expect(props.updateState.mock.calls[0][0]).toHaveProperty(
        'hoveredTrial',
        null,
      )
      wrapper.unmount()
      done()
    })
  })

  it('should call back end to ADD current baseline trial', () => {
    expService.postLabelToTrialFactory.mockImplementationOnce(() => [
      () => Promise.resolve({}),
      () => {},
    ])
    const localProps = {
      ...props,
      labels: {
        ...props.labels,
        postingNewLabel: true,
        newLabel: BASELINE_LABEL,
        baselineAddNumber: props.trials[3].number,
        postingDelLabel: false,
        labelToDelete: '',
        baselineDelNumber: -1,
      },
    }
    wrapper = shallow(<ExperimentDetails {...localProps} />)
    expect(expService.postLabelToTrialFactory).toHaveBeenCalledTimes(1)
    expect(expService.postLabelToTrialFactory.mock.calls[0][0]).toEqual({
      experimentId: props.experiments.list[props.activeExperiment.index].id,
      trialId: localProps.labels.baselineAddNumber,
      labels: {[BASELINE_LABEL]: DEFAULT_LABEL_VALUE},
    })
    wrapper.unmount()
  })

  it('should update state on successful baseline label post', done => {
    expService.postLabelToTrialFactory.mockImplementationOnce(() => [
      () => Promise.resolve({}),
      () => {},
    ])
    const localProps = {
      ...props,
      labels: {
        ...props.labels,
        postingNewLabel: true,
        newLabel: BASELINE_LABEL,
        baselineAddNumber: props.trials[3].number,
        postingDelLabel: false,
        labelToDelete: '',
        baselineDelNumber: -1,
      },
    }
    wrapper = mount(<ExperimentDetails {...localProps} />)
    expect(expService.postLabelToTrialFactory).toHaveBeenCalledTimes(1)
    setImmediate(() => {
      expect(props.updateState).toHaveBeenCalledTimes(1)
      expect(props.updateState.mock.calls[0][0].labels).toEqual({
        ...localProps.labels,
        postingNewLabel: false,
        newLabel: '',
        baselineAddNumber: -1,
      })
      expect(props.updateState.mock.calls[0][0]).toHaveProperty(
        'hoveredTrial',
        null,
      )
      wrapper.unmount()
      done()
    })
  })

  it('should update state in case of error in baseline label backend calls', done => {
    expService.postLabelToTrialFactory.mockImplementationOnce(() => [
      () => Promise.reject({message: 'test_error'}),
      () => {},
    ])
    const localProps = {
      ...props,
      labels: {
        ...props.labels,
        postingNewLabel: true,
        newLabel: BASELINE_LABEL,
        baselineAddNumber: props.trials[3].number,
        postingDelLabel: false,
        labelToDelete: '',
        baselineDelNumber: -1,
      },
    }
    wrapper = mount(<ExperimentDetails {...localProps} />)
    setImmediate(() => {
      expect(props.updateState).toHaveBeenCalledTimes(1)
      expect(props.updateState.mock.calls[0][0].labels).toEqual({
        ...localProps.labels,
        postingNewLabel: false,
        newLabel: '',
        baselineAddNumber: -1,
        postingDelLabel: false,
        labelToDelete: '',
        baselineDelNumber: -1,
        error: 'test_error',
      })
      wrapper.unmount()
      done()
    })
  })
})
