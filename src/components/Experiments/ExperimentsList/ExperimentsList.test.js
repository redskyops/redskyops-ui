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
      },
      experiments: {
        ...localProps.experiments,
        labelsFilter: [],
      },
      trials: null,
      activeTrial: null,
    })
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
  })
})
