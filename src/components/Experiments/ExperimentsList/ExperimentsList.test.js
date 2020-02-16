import React from 'react'
import {shallow, mount} from 'enzyme'

import {ExperimentsList} from './ExperimentsList.component'
import expStub from '../../../services/_stubs/exp-data'
import {ExperimentsService} from '../../../services/ExperimentsService'

jest.mock('../../../services/ExperimentsService', () =>
  jest.requireActual('../../../services/__mocks__/ExperimentsService'),
)

describe('Component: ExperimentList', () => {
  const expService = new ExperimentsService()

  let wrapper
  const props = {
    experiments: {
      list: [],
      loading: true,
      error: '',
    },
    activExperiment: null,
    updateState: jest.fn(),
  }

  beforeEach(() => {
    expService.getExperimentsFactory.mockClear()
    props.updateState.mockClear()
  })

  it('should render ExperimentsList component', () => {
    expService.getExperimentsFactory.mockImplementationOnce(() => [
      () => Promise.resolve(expStub),
      () => {},
    ])
    wrapper = mount(<ExperimentsList {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should load experiments on mount', () => {
    expService.getExperimentsFactory.mockImplementationOnce(() => [
      () => Promise.resolve(expStub),
      () => {},
    ])
    wrapper = mount(<ExperimentsList {...props} />)
    expect(expService.getExperimentsFactory).toHaveBeenCalledTimes(1)
    expect(expService.getExperimentsFactory.mock.calls[0][0]).toHaveProperty(
      'limit',
      500,
    )
    wrapper.unmount()
  })

  it('should update state after loading experiments', async done => {
    expService.getExperimentsFactory.mockImplementationOnce(() => [
      () => Promise.resolve(expStub),
      () => {},
    ])
    wrapper = await mount(<ExperimentsList {...props} />)

    setImmediate(() => {
      expect(props.updateState).toHaveBeenCalledTimes(1)
      expect(props.updateState.mock.calls[0][0]).toHaveProperty('experiments')
      expect(props.updateState.mock.calls[0][0].experiments).toMatchObject({
        list: expStub.experiments,
        loading: false,
      })
      done()
    })
    wrapper.unmount()
  })

  it('should update state in case of experiment loading error', async done => {
    expService.getExperimentsFactory.mockImplementationOnce(() => [
      () => Promise.reject(new Error()),
      () => {},
    ])
    wrapper = await mount(<ExperimentsList {...props} />)

    setImmediate(() => {
      expect(props.updateState).toHaveBeenCalledTimes(1)
      expect(props.updateState.mock.calls[0][0]).toHaveProperty('experiments')
      expect(props.updateState.mock.calls[0][0].experiments).toMatchObject({
        ...props.experiments,
        loading: false,
        error: 'Error loading experiments list',
      })
      done()
      wrapper.unmount()
    })
  })

  it('should render list of experiments with right props', () => {
    const localProps = {
      ...props,
      experiments: {
        ...props.experiments,
        list: expService.addIdsToExperiments(expStub).experiments,
      },
    }
    wrapper = shallow(<ExperimentsList {...localProps} />)
    expect(wrapper.find('button.btn')).toHaveLength(
      localProps.experiments.list.length,
    )
    wrapper.unmount()
  })

  it('should update state when experiment is selected', () => {
    const expService = new ExperimentsService()
    expService.addIdsToExperiments(expStub)
    const localProps = {
      ...props,
      experiments: {
        ...props.experiments,
        list: expService.addIdsToExperiments(expStub).experiments,
      },
    }
    wrapper = shallow(<ExperimentsList {...localProps} />)
    wrapper
      .find('button.btn')
      .first()
      .simulate('click')
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toMatchObject({
      activeExperiment: {
        index: 0,
        isLoading: true,
        metricParameterChart: null,
        xAxisMetric: 'duration',
        yAxisMetric: 'cost',
      },
      experiments: {
        ...localProps.experiments,
        labelsFilter: [],
      },
      trials: null,
      activeTrial: null,
    })
    wrapper.unmount()
  })

  it('should update state without yAxisMetric if metric list less than 2', () => {
    const expService = new ExperimentsService()
    expService.addIdsToExperiments(expStub)
    const localProps = {
      ...props,
      experiments: {
        ...props.experiments,
        list: expService.addIdsToExperiments(expStub).experiments,
      },
    }
    localProps.experiments.list[0].metrics = [
      localProps.experiments.list[0].metrics[0],
    ]
    wrapper = shallow(<ExperimentsList {...localProps} />)
    wrapper
      .find('button.btn')
      .first()
      .simulate('click')
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toMatchObject({
      activeExperiment: {
        index: 0,
        isLoading: true,
        metricParameterChart: null,
        xAxisMetric: 'duration',
      },
    })
    expect(
      props.updateState.mock.calls[0][0].activeExperiment,
    ).not.toHaveProperty('yAxisMetric')
    expect(
      props.updateState.mock.calls[0][0].activeExperiment,
    ).not.toHaveProperty('zAxisMetric')
    wrapper.unmount()
  })

  it('should update state with zAxisMetric if metric list greater or equal 3', () => {
    const expService = new ExperimentsService()
    expService.addIdsToExperiments(expStub)
    const localProps = {
      ...props,
      experiments: {
        ...props.experiments,
        list: expService.addIdsToExperiments(expStub).experiments,
      },
    }
    localProps.experiments.list[0].metrics = [
      ...localProps.experiments.list[0].metrics,
      {name: 'throughput'},
    ]
    wrapper = shallow(<ExperimentsList {...localProps} />)
    wrapper
      .find('button.btn')
      .first()
      .simulate('click')
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toMatchObject({
      activeExperiment: {
        index: 0,
        isLoading: true,
        metricParameterChart: null,
        xAxisMetric: 'throughput',
        yAxisMetric: 'cost',
        zAxisMetric: 'duration',
      },
      experiments: {
        ...localProps.experiments,
        labelsFilter: [],
      },
      trials: null,
      activeTrial: null,
    })
    wrapper.unmount()
  })

  it('should render number of experiments loaded', () => {
    const localProps = {
      ...props,
      experiments: {
        list: expService.addIdsToExperiments(expStub).experiments,
      },
    }
    wrapper = shallow(<ExperimentsList {...localProps} />)
    expect(wrapper.find('[data-dom-id="experiments-num"]').text()).toBe(
      `${localProps.experiments.list.length}`,
    )
    expect(wrapper.find('[data-dom-id="experiments-error"]')).toHaveLength(0)
  })

  it('should render error message', () => {
    const localProps = {
      ...props,
      experiments: {
        ...props.experiments,
        error: 'error_message',
      },
    }
    wrapper = shallow(<ExperimentsList {...localProps} />)
    expect(wrapper.find('[data-dom-id="experiments-num"]')).toHaveLength(0)
    expect(wrapper.find('[data-dom-id="experiments-error"]')).toHaveLength(1)
    expect(wrapper.find('[data-dom-id="experiments-error"]').text()).toBe(
      'error_message',
    )
    wrapper.unmount()
  })

  it('should render only matched filter experiments', () => {
    let localProps = {
      ...props,
      experiments: {
        ...props.experiments,
        list: expService.addIdsToExperiments(expStub).experiments,
      },
    }
    wrapper = shallow(<ExperimentsList {...localProps} />)
    expect(wrapper.find('button.btn')).toHaveLength(10)

    localProps = {
      ...props,
      experiments: {
        ...props.experiments,
        list: expService.addIdsToExperiments(expStub).experiments,
        filter: {
          name: 'postgres',
        },
      },
    }
    wrapper = shallow(<ExperimentsList {...localProps} />)
    expect(wrapper.find('button.btn')).toHaveLength(1)
    wrapper.unmount()
  })

  it('should set right css class to selected experiment', () => {
    let localProps = {
      ...props,
      experiments: {
        ...props.experiments,
        list: expService.addIdsToExperiments(expStub).experiments,
      },
      activeExperiment: {
        ...props.activExperiment,
        index: 5,
      },
    }
    wrapper = shallow(<ExperimentsList {...localProps} />)
    wrapper.find('button.btn').forEach((btn, i) => {
      expect(btn.hasClass('active')).toBe(i === 5)
    })
    wrapper.unmount()
  })

  it('should set list of metrics to empty array in case of missing metrics in experiment', () => {
    let localProps = {
      ...props,
      experiments: {
        ...props.experiments,
        list: expService.addIdsToExperiments(expStub).experiments,
      },
    }
    localProps.experiments.list[2] = {...localProps.experiments.list[2]}
    delete localProps.experiments.list[2].metrics
    wrapper = shallow(<ExperimentsList {...localProps} />)
    wrapper
      .find('button.btn')
      .at(2)
      .simulate('click')
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toMatchObject({
      activeExperiment: {
        index: 2,
        metricsList: [],
      },
    })
    wrapper.unmount()
  })

  it('should set list of parameters to empty array in case of missing parameters in experiment', () => {
    let localProps = {
      ...props,
      experiments: {
        ...props.experiments,
        list: expService.addIdsToExperiments(expStub).experiments,
      },
    }
    localProps.experiments.list[3] = {...localProps.experiments.list[3]}
    delete localProps.experiments.list[3].parameters
    wrapper = shallow(<ExperimentsList {...localProps} />)
    wrapper
      .find('button.btn')
      .at(3)
      .simulate('click')
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toMatchObject({
      activeExperiment: {
        index: 3,
        parametersList: [],
      },
    })
    wrapper.unmount()
  })

  it('should sort metrics list by minimize property', () => {
    let localProps = {
      ...props,
      experiments: {
        ...props.experiments,
        list: expService.addIdsToExperiments(expStub).experiments,
      },
    }
    localProps.experiments.list[4] = {...localProps.experiments.list[4]}
    localProps.experiments.list[4].metrics.forEach(m => (m.minimize = false))
    localProps.experiments.list[4].metrics[1].minimize = true
    wrapper = shallow(<ExperimentsList {...localProps} />)
    wrapper
      .find('button.btn')
      .at(4)
      .simulate('click')
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toMatchObject({
      activeExperiment: {
        index: 4,
        metricsList: ['cost', 'throughput', 'latency'],
      },
    })
    wrapper.unmount()
  })

  it('should render withouth required props', () => {
    let localProps = {
      ...props,
    }
    delete localProps.experiments
    delete localProps.activeExperiment
    wrapper = shallow(<ExperimentsList {...localProps} />)
    wrapper.unmount()
  })
})
