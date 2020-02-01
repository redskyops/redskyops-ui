import React from 'react'
import {shallow} from 'enzyme'

import {LeftPanel} from './LeftPanel.component'

jest.mock('../Experiments/ExperimentsList/ExperimentsList.component')

describe('Component: LeftPanel', () => {
  const props = {
    experiments: {
      filter: {
        name: '',
      },
    },
    updateState: jest.fn(),
  }
  let wrapper

  beforeEach(() => {
    props.updateState.mockClear()
  })

  it('should render LeftPanel', () => {
    wrapper = shallow(<LeftPanel {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render right content', () => {
    wrapper = shallow(<LeftPanel {...props} />)
    expect(wrapper.find('h1')).toHaveLength(1)
    expect(wrapper.find('h4')).toHaveLength(1)
    expect(wrapper.find('input[type="text"]')).toHaveLength(1)
    expect(wrapper.find('ExperimentsList')).toHaveLength(1)
    wrapper.unmount()
  })

  it('should update state when filter text box changed', () => {
    wrapper = shallow(<LeftPanel {...props} />)
    wrapper.find('input[type="text"]').simulate('change', {
      target: {value: 'new_filter'},
    })
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toMatchObject({
      experiments: {
        ...props.experiments,
        filter: {
          ...props.experiments.filter,
          name: 'new_filter',
        },
      },
    })
    wrapper.unmount()
  })

  it('should show search icon if not search is set', () => {
    wrapper = shallow(<LeftPanel {...props} />)
    expect(wrapper.find('Icon')).toHaveLength(1)
    expect(wrapper.find('button[data-dom-id="left-panel-clear"]')).toHaveLength(
      0,
    )
    wrapper.unmount()
  })

  it('should show button to clear search if search is set', () => {
    const localProps = {
      ...props,
      experiments: {
        ...props.experiments,
        filter: {
          ...props.experiments.filter,
          name: 'new_filter',
        },
      },
    }
    wrapper = shallow(<LeftPanel {...localProps} />)
    expect(wrapper.find('button[data-dom-id="left-panel-clear"]')).toHaveLength(
      1,
    )
    wrapper.unmount()
  })

  it('should udpate state to clear search when clear button clicked', () => {
    const localProps = {
      ...props,
      experiments: {
        ...props.experiments,
        filter: {
          ...props.experiments.filter,
          name: 'new_filter',
        },
      },
    }
    wrapper = shallow(<LeftPanel {...localProps} />)
    wrapper.find('button[data-dom-id="left-panel-clear"]').simulate('click')
    expect(props.updateState).toHaveBeenCalledTimes(1)
    expect(props.updateState.mock.calls[0][0]).toMatchObject({
      experiments: {
        ...props.experiments,
        filter: {
          ...props.experiments.filter,
          name: '',
        },
      },
    })
    wrapper.unmount()
  })
})
