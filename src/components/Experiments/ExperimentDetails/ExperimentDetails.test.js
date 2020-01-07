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
      labelsFilter: [],
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

  it('should render list of available labels', async () => {
    expService.getTrialsFactory.mockImplementationOnce(() => [
      () => Promise.resolve(trialStub),
      () => {},
    ])
    const localProps = {
      ...props,
      trials: [...props.trials],
    }
    localProps.trials[4] = {
      ...localProps.trials[4],
      labels: {test_label: 'true'},
    }
    wrapper = await mount(<ExperimentDetails {...localProps} />)
    const labelsBtns = wrapper.find('button[data-dome-id="exp-details-label"]')
    expect(labelsBtns).toHaveLength(2)
    expect(labelsBtns.first().text()).toContain('test_label')
    expect(labelsBtns.last().text()).toContain('best')
  })

  it('should render label checked if selected', async () => {
    expService.getTrialsFactory.mockImplementationOnce(() => [
      () => Promise.resolve(trialStub),
      () => {},
    ])
    const localProps = {
      ...props,
      trials: [...props.trials],
      experiments: {
        ...props.experiments,
        labelsFilter: ['test_label'],
      },
    }
    localProps.trials[4] = {
      ...localProps.trials[4],
      labels: {test_label: 'true'},
    }
    wrapper = await mount(<ExperimentDetails {...localProps} />)
    const labelsBtns = wrapper.find('button[data-dome-id="exp-details-label"]')
    expect(labelsBtns).toHaveLength(2)
    expect(labelsBtns.first().text()).toContain('check_box')
    expect(labelsBtns.first().text()).not.toContain('check_box_outline_blank')
    expect(labelsBtns.last().text()).toContain('check_box_outline_blank')
  })

  it('should update state on label click and add filter', async () => {
    expService.getTrialsFactory.mockImplementationOnce(() => [
      () => Promise.resolve(trialStub),
      () => {},
    ])
    const localProps = {
      ...props,
      trials: [...props.trials],
      experiments: {
        ...props.experiments,
      },
    }
    localProps.trials[4] = {
      ...localProps.trials[4],
      labels: {test_label: 'true'},
    }
    wrapper = await mount(<ExperimentDetails {...localProps} />)
    const labelsBtns = wrapper.find('button[data-dome-id="exp-details-label"]')
    expect(labelsBtns).toHaveLength(2)
    labelsBtns.first().simulate('click', {preventDefault: () => {}})
    expect(props.updateState).toHaveBeenCalledTimes(2)
    expect(props.updateState.mock.calls[1][0]).toMatchObject({
      experiments: {
        ...props.experiments,
        labelsFilter: ['test_label'],
      },
    })
  })

  it('should update state on label click and remove filter', async () => {
    expService.getTrialsFactory.mockImplementationOnce(() => [
      () => Promise.resolve(trialStub),
      () => {},
    ])
    const localProps = {
      ...props,
      trials: [...props.trials],
      experiments: {
        ...props.experiments,
        labelsFilter: ['test_label'],
      },
    }
    localProps.trials[4] = {
      ...localProps.trials[4],
      labels: {test_label: 'true'},
    }
    wrapper = await mount(<ExperimentDetails {...localProps} />)
    const labelsBtns = wrapper.find('button[data-dome-id="exp-details-label"]')

    labelsBtns.first().simulate('click', {preventDefault: () => {}})
    expect(props.updateState).toHaveBeenCalledTimes(2)
    expect(props.updateState.mock.calls[1][0]).toMatchObject({
      experiments: {
        ...props.experiments,
        labelsFilter: [],
      },
    })
  })

  it('should render show all button if any filter is active', async () => {
    expService.getTrialsFactory.mockImplementationOnce(() => [
      () => Promise.resolve(trialStub),
      () => {},
    ])
    const localProps = {
      ...props,
      trials: [...props.trials],
      experiments: {
        ...props.experiments,
        labelsFilter: ['test_label'],
      },
    }
    localProps.trials[4] = {
      ...localProps.trials[4],
      labels: {test_label: 'true'},
    }
    wrapper = await mount(<ExperimentDetails {...localProps} />)
    const showAll = wrapper.find('button[data-dome-id="exp-details-show-all"]')
    expect(showAll).toHaveLength(1)
  })

  it('should update state and clear labels filters when show all clicked', async () => {
    expService.getTrialsFactory.mockImplementationOnce(() => [
      () => Promise.resolve(trialStub),
      () => {},
    ])
    const localProps = {
      ...props,
      trials: [...props.trials],
      experiments: {
        ...props.experiments,
        labelsFilter: ['test_label'],
      },
    }
    localProps.trials[4] = {
      ...localProps.trials[4],
      labels: {test_label: 'true'},
    }
    wrapper = await mount(<ExperimentDetails {...localProps} />)
    const showAll = wrapper.find('button[data-dome-id="exp-details-show-all"]')
    showAll.simulate('click', {preventDefault: () => {}})
    expect(props.updateState.mock.calls[1][0]).toMatchObject({
      experiments: {
        ...props.experiments,
        labelsFilter: [],
      },
    })
  })

  it('should pass labels filter to Trial component', async () => {
    expService.getTrialsFactory.mockImplementationOnce(() => [
      () => Promise.resolve(trialStub),
      () => {},
    ])
    const localProps = {
      ...props,
      trials: [...props.trials],
      experiments: {
        ...props.experiments,
        labelsFilter: ['test_label'],
      },
    }

    wrapper = await mount(<ExperimentDetails {...localProps} />)
    expect(wrapper.find('Trials').props()).toHaveProperty(
      'labelsFilter',
      localProps.experiments.labelsFilter,
    )
  })
})
