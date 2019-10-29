import React from 'react'
import {mount} from 'enzyme'

import {StateProvider, connectWithState} from './StateContext'
import {DEFAULT_STATE} from './DefaultState'

jest.mock('../utilities/arePropsEqual', () => {
  return jest.fn()
})

import arePropsEqual from '../utilities/arePropsEqual'

describe('Component: StateProvider', () => {
  const TestComponent = jest.fn(props => {
    return (
      <button
        id="test"
        onClick={() => props.updateState({user: 'user_data'})}
      />
    )
  })

  beforeEach(() => {
    TestComponent.mockClear()
  })

  it("should set it's local state where updateState is called", () => {
    const Comp = connectWithState(TestComponent)
    const wrapper = mount(
      <StateProvider>
        <Comp />
      </StateProvider>,
    )
    expect(TestComponent).toHaveBeenCalledTimes(1)
    expect(TestComponent.mock.calls[0][0]).toMatchObject(DEFAULT_STATE)
    wrapper.find('button').simulate('click')
    expect(TestComponent).toHaveBeenCalledTimes(2)
    expect(TestComponent.mock.calls[1][0]).toMatchObject({
      ...DEFAULT_STATE,
      user: 'user_data',
    })
  })
})

describe('Function: connectWithState', () => {
  const TestComponent = jest.fn(() => {
    return <div id="test" />
  })

  beforeEach(() => {
    TestComponent.mockClear()
    arePropsEqual.mockClear()
  })

  it('should send state as props to target component', () => {
    const Comp = connectWithState(TestComponent)
    mount(
      <StateProvider>
        <Comp />
      </StateProvider>,
    )
    expect(TestComponent.mock.calls[0][0]).toMatchObject(DEFAULT_STATE)
  })

  it('should send updateState function in props', () => {
    const Comp = connectWithState(TestComponent)
    mount(
      <StateProvider>
        <Comp />
      </StateProvider>,
    )
    expect(TestComponent.mock.calls[0][0]).toHaveProperty('updateState')
    expect(typeof TestComponent.mock.calls[0][0].updateState).toBe('function')
  })

  it('should render with state connecter component if NO list of memory props are sent', () => {
    const Comp = connectWithState(TestComponent)
    const wrapper = mount(
      <StateProvider>
        <Comp />
      </StateProvider>,
    )
    expect(wrapper.find('MemoStateConnector').length).toBe(0)
    expect(wrapper.find('StateConnector').length).toBe(1)
  })

  it('should call React.memo with custom memo function', () => {
    const memoFunc = jest.fn((prev, next) => {
      return prev.user === next.user
    })
    const Comp = connectWithState(TestComponent, memoFunc)
    const wrapper = mount(
      <StateProvider>
        <Comp />
      </StateProvider>,
    )
    wrapper.setProps({user: 'test'})
    expect(memoFunc).toHaveBeenCalledTimes(1)
  })
})
