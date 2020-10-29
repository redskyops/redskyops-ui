import React from 'react'
import {mount} from 'enzyme'

import useApiCallEffect from './useApiCallEffect'

describe('Hook: useApiCallEffect', () => {
  const response = {one: 1}
  const request = jest.fn(() => Promise.resolve(response))
  const abort = jest.fn()
  const requestFactory = jest.fn(() => [request, abort])
  const successHandler = jest.fn()
  const errorHandler = jest.fn()

  beforeEach(() => {
    requestFactory.mockClear()
    request.mockClear()
    abort.mockClear()
    successHandler.mockClear()
    errorHandler.mockClear()
  })

  it('should run send request when component mount', () => {
    const TestComponent = () => {
      useApiCallEffect(requestFactory, successHandler, errorHandler)
      return <div id="test" />
    }
    mount(<TestComponent />)
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('should execute request if factory return none falsy value', () => {
    const TestComponent = () => {
      useApiCallEffect(requestFactory, successHandler, errorHandler)
      return <div id="test" />
    }
    mount(<TestComponent />)
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('should NOT execute request if factory return falsy value', () => {
    requestFactory.mockImplementationOnce(() => null)
    const TestComponent = () => {
      useApiCallEffect(requestFactory, successHandler, errorHandler)
      return <div id="test" />
    }
    mount(<TestComponent />)
    expect(request).toHaveBeenCalledTimes(0)
  })

  it('should call success handler if no errors', async done => {
    const TestComponent = () => {
      useApiCallEffect(requestFactory, successHandler, errorHandler)
      return <div id="test" />
    }
    await mount(<TestComponent />)
    setImmediate(() => {
      expect(successHandler).toHaveBeenCalledTimes(1)
      expect(successHandler.mock.calls[0][0]).toMatchObject(response)
      done()
    })
  })

  it('should call error handler in case of error', async done => {
    request.mockImplementationOnce(() =>
      Promise.reject(new Error('test_message')),
    )
    const TestComponent = () => {
      useApiCallEffect(requestFactory, successHandler, errorHandler)
      return <div id="test" />
    }
    await mount(<TestComponent />)
    setImmediate(() => {
      expect(successHandler).toHaveBeenCalledTimes(0)
      expect(errorHandler).toHaveBeenCalledTimes(1)
      expect(errorHandler.mock.calls[0][0].message).toBe('test_message')
      done()
    })
  })

  it('should do nothing in case of AbortError', async done => {
    request.mockImplementationOnce(() => Promise.reject({name: 'AbortError'}))
    const TestComponent = () => {
      useApiCallEffect(requestFactory, successHandler, errorHandler)
      return <div id="test" />
    }
    await mount(<TestComponent />)
    setImmediate(() => {
      expect(successHandler).toHaveBeenCalledTimes(0)
      expect(errorHandler).toHaveBeenCalledTimes(0)
      done()
    })
  })

  it('should call abort when component unmount', () => {
    const TestComponent = () => {
      useApiCallEffect(requestFactory, successHandler, errorHandler)
      return <div id="test" />
    }
    const wrapper = mount(<TestComponent />)
    wrapper.unmount()
    expect(abort).toHaveBeenCalledTimes(1)
  })

  it('should NOT call success handler neither error handler when component unmount', () => {
    const TestComponent = () => {
      useApiCallEffect(requestFactory, successHandler, errorHandler)
      return <div id="test" />
    }
    const wrapper = mount(<TestComponent />)
    wrapper.unmount()
    expect(successHandler).toHaveBeenCalledTimes(0)
    expect(errorHandler).toHaveBeenCalledTimes(0)
    expect(abort).toHaveBeenCalledTimes(1)
  })

  it('should execute the effect only on variable change if passed', async () => {
    // eslint-disable-next-line react/prop-types
    const TestComponent = ({value}) => {
      useApiCallEffect(requestFactory, successHandler, errorHandler, [value])
      return <div id="test" />
    }
    const wrapper = await mount(<TestComponent value={0} />)
    wrapper.setProps({value: 0})
    await wrapper.update()
    expect(request).toHaveBeenCalledTimes(1)
    wrapper.setProps({value: 1})
    await wrapper.update()
    expect(request).toHaveBeenCalledTimes(2)
  })

  it('should not require error hanlder function', async () => {
    request.mockImplementationOnce(() =>
      Promise.reject(new Error('test_message')),
    )
    // eslint-disable-next-line react/prop-types
    const TestComponent = () => {
      useApiCallEffect(requestFactory, successHandler, null)
      return <div id="test" />
    }
    await mount(<TestComponent />)
    expect(request).toHaveBeenCalledTimes(1)
    expect(successHandler).toHaveBeenCalledTimes(0)
  })
})
