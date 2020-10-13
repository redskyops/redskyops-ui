import {OperationsService} from './OperationsService'
import {mockFetch} from '../test/utilities/mockFetch'

describe('Service: OperationsService', () => {
  const originalFetch = global.fetch
  const originalLog = console.log
  let opService
  const onSuccess = jest.fn()
  const onError = jest.fn()

  beforeEach(() => {
    onSuccess.mockClear()
    onError.mockClear()
  })

  afterEach(() => {
    global.fetch = originalFetch
    console.log = originalLog
  })

  describe('checkBackendHealth', () => {
    it('should call backend to check for', async () => {
      global.fetch = mockFetch({responseData: {ok: true, test: 1}})
      opService = new OperationsService()
      await opService.checkBackendHealth()
      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch.mock.calls[0][0]).toBe('/health')
    })
  })

  describe('checkBackendHealth', () => {
    it('should call health success handler function ', done => {
      jest.useFakeTimers()
      global.fetch = mockFetch({responseData: {ok: true, test: 1}})
      opService = new OperationsService()

      opService.startBackendHealthCheck({onError, onSuccess})
      setImmediate(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1)
        opService.stopBackendHealthCheck({onError, onSuccess})
        jest.useRealTimers()
        done()
      })
    })

    it('should call health error handler function ', done => {
      jest.useFakeTimers()
      global.fetch = mockFetch({
        responseStatus: 400,
        ok: false,
        responseStatusText: 'test_error',
      })
      opService = new OperationsService()

      opService.startBackendHealthCheck({onError, onSuccess})
      setImmediate(() => {
        expect(onError).toHaveBeenCalledTimes(1)
        expect(onError.mock.calls[0][0] instanceof Error).toBe(true)
        expect(onError.mock.calls[0][0].message).toBe('test_error')
        opService.stopBackendHealthCheck({onError, onSuccess})
        jest.useRealTimers()
        done()
      })
    })

    it('should start interval health check', () => {
      jest.useFakeTimers()
      const originalSetInterval = window.setInterval
      const originalClearInterval = window.clearInterval
      window.setInterval = jest.fn()
      window.clearInterval = jest.fn()
      global.fetch = mockFetch({
        responseStatus: 400,
        ok: false,
        responseStatusText: 'test_error',
      })
      opService = new OperationsService()

      opService.startBackendHealthCheck({onError, onSuccess})
      expect(window.setInterval).toHaveBeenCalledTimes(1)
      expect(window.setInterval.mock.calls[0][0]).toBe(
        opService.checkBackendHealth,
      )
      expect(window.clearInterval).toHaveBeenCalledTimes(1)
      opService.stopBackendHealthCheck({onError, onSuccess})
      window.setInterval = originalSetInterval
      window.clearInterval = originalClearInterval
      jest.useRealTimers()
    })

    it('should add nothing as success/error handlers if they are not valid functions', () => {
      jest.useFakeTimers()
      window.setInterval = jest.fn()
      global.fetch = mockFetch({
        responseStatus: 400,
        ok: false,
        responseStatusText: 'test_error',
      })
      opService = new OperationsService()

      opService.startBackendHealthCheck()
      expect(opService.healthSuccessHandlers).toHaveLength(0)
      expect(opService.healthErrorHandlers).toHaveLength(0)
      opService.stopBackendHealthCheck()
      jest.useRealTimers()
    })
  })

  describe('stopBackendHealthCheck', () => {
    it('should clear health check interval', () => {
      jest.useFakeTimers()
      const originalClearInterval = window.clearInterval
      window.clearInterval = jest.fn()
      global.fetch = mockFetch({
        responseStatus: 400,
        ok: false,
        responseStatusText: 'test_error',
      })
      opService = new OperationsService()

      opService.startBackendHealthCheck({onError, onSuccess})
      expect(window.clearInterval).toHaveBeenCalledTimes(1)
      opService.stopBackendHealthCheck({onError, onSuccess})
      expect(window.clearInterval).toHaveBeenCalledTimes(2)
      window.clearInterval = originalClearInterval
      jest.useRealTimers()
    })

    it('should remove handlers from list', () => {
      jest.useFakeTimers()
      window.setInterval = jest.fn()
      global.fetch = mockFetch({
        responseStatus: 400,
        ok: false,
        responseStatusText: 'test_error',
      })
      opService = new OperationsService()

      opService.startBackendHealthCheck({onError, onSuccess})
      expect(opService.healthSuccessHandlers).toHaveLength(1)
      expect(opService.healthErrorHandlers).toHaveLength(1)
      opService.stopBackendHealthCheck({onError, onSuccess})
      expect(opService.healthSuccessHandlers).toHaveLength(0)
      expect(opService.healthErrorHandlers).toHaveLength(0)
      jest.useRealTimers()
    })
  })
})
