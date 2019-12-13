import React from 'react'
import {shallow, mount} from 'enzyme'

import {Labels} from './Labels.component'
import trialsStub from '../../../services/_stubs/trials-data'
import {ExperimentsService} from '../../../services/ExperimentsService'

jest.mock('../../../services/ExperimentsService', () =>
  jest.requireActual('../../../services/__mocks__/ExperimentsService'),
)

describe('Component: Lables', () => {
  let wrapper
  const expService = new ExperimentsService()
  const props = {
    trials: trialsStub.trials,
    activeTrial: {index: 2},
    experimentId: 'experiment-one',
    labels: {
      postingNewLabel: false,
      postingDelLabel: false,
      newLabel: '',
      labelToDelete: '',
    },
    updateState: jest.fn(),
  }

  beforeEach(() => {
    props.updateState.mockClear()
    expService.getExperimentsFactory.mockReset()
    expService.getTrialsFactory.mockReset()
    expService.postLabelToTrialFactory.mockReset()
  })

  it('should render Labels component', () => {
    wrapper = shallow(<Labels {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render input filed for adding new label', () => {
    wrapper = shallow(<Labels {...props} />)
    expect(wrapper.find('input[type="text"]')).toHaveLength(1)
    wrapper.unmount()
  })

  it('should update state with text field value', () => {
    wrapper = shallow(<Labels {...props} />)
    wrapper.find('input[type="text"]').simulate('change', {
      target: {
        value: 'new_label',
      },
    })
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toHaveProperty('labels')
    expect(props.updateState.mock.calls[0][0].labels).toMatchObject({
      newLabel: 'new_label',
    })
    wrapper.unmount()
  })

  it('should set state to posing when user post add new label', () => {
    wrapper = shallow(<Labels {...props} />)
    wrapper
      .find('form')
      .first()
      .simulate('submit', {
        preventDefault: () => {},
      })
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toHaveProperty('labels')
    expect(props.updateState.mock.calls[0][0].labels).toMatchObject({
      postingNewLabel: true,
    })
    wrapper.unmount()
  })

  it('make a call to post a new label if posting status is true', () => {
    const request = jest.fn(() =>
      Promise.resolve({labels: {new_label: 'true'}}),
    )
    const abort = jest.fn()
    expService.postLabelToTrialFactory.mockImplementationOnce(() => [
      request,
      abort,
    ])
    const localProps = {
      ...props,
      labels: {
        ...props.labels,
        postingNewLabel: true,
        newLabel: 'new_label',
      },
    }
    wrapper = mount(<Labels {...localProps} />)
    expect(expService.postLabelToTrialFactory).toHaveBeenCalledTimes(1)
    expect(expService.postLabelToTrialFactory).toHaveBeenCalledWith({
      experimentId: props.experimentId,
      trialId: props.trials[props.activeTrial.index].number,
      labels: {
        new_label: 'true',
      },
    })
    expect(request).toHaveBeenCalledTimes(1)
    wrapper.unmount()
    expect(abort).toHaveBeenCalledTimes(1)
  })

  it('should update state on successful label post', done => {
    const request = jest.fn(() => {
      return Promise.resolve({labels: {some_label: 'true'}})
    })
    const abort = jest.fn()
    expService.postLabelToTrialFactory.mockImplementationOnce(() => [
      request,
      abort,
    ])
    const localProps = {
      ...props,
      labels: {
        ...props.labels,
        postingNewLabel: true,
        newLabel: 'some_label',
      },
    }
    wrapper = mount(<Labels {...localProps} />)
    expect(request).toHaveBeenCalledTimes(1)
    setImmediate(() => {
      expect(props.updateState).toHaveBeenCalledTimes(1)
      expect(
        props.updateState.mock.calls[0][0].trials[props.activeTrial.index],
      ).toHaveProperty('labels')
      expect(
        props.updateState.mock.calls[0][0].trials[props.activeTrial.index]
          .labels,
      ).toMatchObject({some_label: 'true'})
      expect(props.updateState.mock.calls[0][0]).toHaveProperty('labels')
      expect(props.updateState.mock.calls[0][0].labels).toMatchObject({
        postingNewLabel: false,
        newLabel: '',
      })
      done()
    })
    wrapper.unmount()
    expect(abort).toHaveBeenCalledTimes(1)
  })

  it('render a list of assigned labels', () => {
    const localProps = {
      ...props,
      trials: [...props.trials],
    }
    localProps.trials[props.activeTrial.index] = {
      ...localProps.trials[props.activeTrial.index],
      labels: {
        one: 'true',
        two: 'true',
        three: 'true',
      },
    }
    wrapper = shallow(<Labels {...localProps} />)
    expect(wrapper.find('[data-dom-id="labels-assigned"] button')).toHaveLength(
      3,
    )
    wrapper.unmount()
  })

  it('update state with posting status when user delete label', () => {
    const localProps = {
      ...props,
      trials: [...props.trials],
    }
    localProps.trials[props.activeTrial.index] = {
      ...localProps.trials[props.activeTrial.index],
      labels: {
        one: 'true',
        two: 'true',
        three: 'true',
      },
    }
    wrapper = mount(<Labels {...localProps} />)
    wrapper
      .find('[data-dom-id="labels-assigned"] button')
      .at(1)
      .simulate('click', {preventDefault: () => {}})
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toHaveProperty('labels')
    expect(props.updateState.mock.calls[0][0].labels).toMatchObject({
      postingDelLabel: true,
      labelToDelete: 'two',
    })
    wrapper.unmount()
  })

  it('call backend to delete label if posting flag is true', () => {
    const request = jest.fn(() => {
      return Promise.resolve({labels: {some_label: 'true'}})
    })
    const abort = jest.fn()
    expService.postLabelToTrialFactory.mockImplementationOnce(() => [
      request,
      abort,
    ])
    const localProps = {
      ...props,
      labels: {
        ...props.labels,
        postingDelLabel: true,
        labelToDelete: 'two',
      },
    }
    localProps.trials[props.activeTrial.index] = {
      ...localProps.trials[props.activeTrial.index],
      labels: {
        one: 'true',
        two: 'true',
        three: 'true',
      },
    }
    wrapper = mount(<Labels {...localProps} />)
    wrapper
      .find('[data-dom-id="labels-assigned"] button')
      .at(1)
      .simulate('click', {preventDefault: () => {}})
    expect(expService.postLabelToTrialFactory).toHaveBeenCalledTimes(1)
    expect(expService.postLabelToTrialFactory.mock.calls[0][0]).toMatchObject({
      experimentId: props.experimentId,
      trialId: props.trials[props.activeTrial.index].number,
      labels: {
        two: '',
      },
    })
    wrapper.unmount()
  })

  it('update state in delete label is successful', done => {
    const request = jest.fn(() => {
      return Promise.resolve({labels: {some_label: 'true'}})
    })
    const abort = jest.fn()
    expService.postLabelToTrialFactory.mockImplementationOnce(() => [
      request,
      abort,
    ])
    const localProps = {
      ...props,
      labels: {
        ...props.labels,
        postingDelLabel: true,
        labelToDelete: 'two',
      },
    }
    localProps.trials[props.activeTrial.index] = {
      ...localProps.trials[props.activeTrial.index],
      labels: {
        one: 'true',
        two: 'true',
        three: 'true',
      },
    }
    wrapper = mount(<Labels {...localProps} />)
    wrapper
      .find('[data-dom-id="labels-assigned"] button')
      .at(1)
      .simulate('click', {preventDefault: () => {}})
    setImmediate(() => {
      expect(request).toHaveBeenCalledTimes(1)
      expect(props.updateState).toHaveBeenCalledTimes(1)
      expect(props.updateState.mock.calls[0][0]).toHaveProperty('labels')
      expect(props.updateState.mock.calls[0][0].labels).toMatchObject({
        postingDelLabel: false,
        labelToDelete: '',
      })
      expect(props.updateState.mock.calls[0][0]).toHaveProperty('trials')
      expect(
        props.updateState.mock.calls[0][0].trials[props.activeTrial.index]
          .labels,
      ).not.toHaveProperty('two')
      expect(
        props.updateState.mock.calls[0][0].trials[props.activeTrial.index]
          .labels,
      ).toMatchObject({one: 'true', three: 'true'})
      done()
    })
    wrapper.unmount()
    expect(abort).toHaveBeenCalledTimes(1)
  })

  it('should disable remove labels if in posting state', done => {
    const request = jest.fn(() => {
      return Promise.resolve({labels: {some_label: 'true'}})
    })
    const abort = jest.fn()
    expService.postLabelToTrialFactory.mockImplementationOnce(() => [
      request,
      abort,
    ])
    const localProps = {
      ...props,
      labels: {
        ...props.labels,
        postingDelLabel: true,
        labelToDelete: 'two',
      },
    }
    localProps.trials[props.activeTrial.index] = {
      ...localProps.trials[props.activeTrial.index],
      labels: {
        one: 'true',
        two: 'true',
        three: 'true',
      },
    }
    wrapper = mount(<Labels {...localProps} />)
    wrapper.find('[data-dom-id="labels-assigned"] button').forEach(btn => {
      expect(btn.props()).toHaveProperty('disabled', true)
    })
    wrapper
      .find('[data-dom-id="labels-assigned"] button')
      .at(1)
      .simulate('click', {preventDefault: () => {}})
    wrapper
      .find('[data-dom-id="labels-assigned"] button')
      .at(1)
      .simulate('click', {preventDefault: () => {}})
    wrapper
      .find('[data-dom-id="labels-assigned"] button')
      .at(1)
      .simulate('click', {preventDefault: () => {}})
    setImmediate(() => {
      expect(request).toHaveBeenCalledTimes(1)
      done()
    })
    wrapper.unmount()
  })

  it('render a list of unassigned labels', () => {
    const localProps = {
      ...props,
      trials: [...props.trials],
    }
    localProps.trials[props.activeTrial.index] = {
      ...localProps.trials[props.activeTrial.index],
      labels: {
        one: 'true',
        two: 'true',
        three: 'true',
      },
    }
    wrapper = shallow(<Labels {...localProps} />)
    expect(wrapper.find('[data-dom-id="labels-new"] button')).toHaveLength(1)
    wrapper.unmount()
  })

  it('upate state if user clicked on anassigned label', () => {
    const localProps = {
      ...props,
      trials: [...props.trials],
    }
    localProps.trials[props.activeTrial.index] = {
      ...localProps.trials[props.activeTrial.index],
      labels: {
        one: 'true',
        two: 'true',
        three: 'true',
      },
    }
    wrapper = shallow(<Labels {...localProps} />)
    const unassigned = wrapper.find('[data-dom-id="labels-new"] button')
    expect(unassigned).toHaveLength(1)
    unassigned.simulate('click', {preventDefault: () => {}})
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState).toHaveBeenCalledWith({
      labels: {
        ...props.labels,
        postingNewLabel: true,
        newLabel: 'best',
      },
    })
    wrapper.unmount()
  })

  it('should render nothing if trail has not label object', () => {
    const localProps = {
      ...props,
      trials: [...props.trials],
    }
    localProps.trials[props.activeTrial.index] = {
      ...localProps.trials[props.activeTrial.index],
      labels: null,
    }
    wrapper = mount(<Labels {...localProps} />)
    expect(wrapper.find('[data-dom-id="labels-assigned"] button')).toHaveLength(
      0,
    )

    wrapper.unmount()
  })
})
