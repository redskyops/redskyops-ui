/* eslint no-console: 0 */
import {HttpService} from './HttpService'
import {mockFetch} from '../test/utilities/mockFetch'

describe('Service: HttpService', () => {
  const originalFetch = global.fetch
  const originalLog = console.log
  const httpService = new HttpService()
  const originalHandelErrors = httpService.handleErrors

  afterEach(() => {
    global.fetch = originalFetch
    console.log = originalLog
    httpService.handleErrors = originalHandelErrors
  })

  it('should be a singleton service', () => {
    const another = new HttpService()
    expect(httpService).toBe(another)
  })

  it('should construct a valid URL', () => {
    let url = httpService.getUrl('/api/v1/test')
    expect(url).toBe('/api/v1/test')

    url = httpService.getUrl('/api/v1/test', {one: 1, two: null})
    expect(url).toBe('/api/v1/test?one=1&two')
  })

  it('should build correct querystring from object', () => {
    const qString1 = httpService.buildQueryString({
      one: 1,
      two: 2,
    })
    expect(qString1).toBe('?one=1&two=2')

    const qString2 = httpService.buildQueryString({
      'one?': 1,
      'two d': 2,
    })
    expect(qString2).toBe('?one%3F=1&two%20d=2')
  })

  describe('get', () => {
    it('should return array of 2 functions', () => {
      global.fetch = mockFetch({responseData: {test: 1}})
      const result = httpService.get({url: '/api/v1/cases'})
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(2)
      expect(typeof result[0]).toBe('function')
      expect(typeof result[1]).toBe('function')
    })

    it('should do get fetch', async () => {
      global.fetch = mockFetch({responseData: {test: 1}})
      const [request] = httpService.get({url: '/api/v1/cases'})
      const response = await request()
      expect(response.json()).toMatchObject({test: 1})
      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch.mock.calls[0][0]).toBe('/api/v1/cases')
    })
  })

  describe('post', () => {
    it('should return array of 2 functions', () => {
      global.fetch = mockFetch({responseData: {test: 1}})
      const result = httpService.post({
        url: '/api/v1/cases',
        body: {test: 1},
      })
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(2)
      expect(typeof result[0]).toBe('function')
      expect(typeof result[1]).toBe('function')
    })

    it('should do post fetch', async () => {
      global.fetch = mockFetch({responseData: {test: 1}})
      const [request] = httpService.post({
        url: '/api/v1/cases',
        body: {test: 1},
      })
      const response = await request()
      expect(response.json()).toMatchObject({test: 1})
      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch.mock.calls[0][0]).toBe('/api/v1/cases')
      expect(global.fetch.mock.calls[0][1]).toMatchObject({
        method: 'POST',
        body: '{"test":1}',
        headers: {'Content-Type': 'application/json'},
      })
    })
  })

  it('should add middleware', () => {
    const testMiddle = () => {}

    httpService.middleware = []
    httpService.addMiddleware(testMiddle)
    expect(httpService.middleware).toHaveLength(1)
    expect(httpService.middleware[0]).toBe(testMiddle)
  })

  it('should not add the same middleware multiple times', () => {
    const testMiddle = () => {}

    httpService.middleware = []
    httpService.addMiddleware(testMiddle)
    expect(httpService.middleware).toHaveLength(1)
    expect(httpService.middleware[0]).toBe(testMiddle)
    httpService.addMiddleware(testMiddle)
    expect(httpService.middleware).toHaveLength(1)
  })

  it('should remove middleware', () => {
    const testMiddle = () => {}

    httpService.middleware = []
    httpService.addMiddleware(testMiddle)

    expect(httpService.middleware).toHaveLength(1)
    expect(httpService.middleware[0]).toBe(testMiddle)

    httpService.removeMiddleware(testMiddle)
    expect(httpService.middleware).toHaveLength(0)
  })

  it("should not remove middleware that doesn't exists", () => {
    const testMiddle = () => {}
    const anotherMiddle = () => {}

    httpService.middleware = []
    httpService.addMiddleware(testMiddle)

    expect(httpService.middleware).toHaveLength(1)
    expect(httpService.middleware[0]).toBe(testMiddle)

    httpService.removeMiddleware(anotherMiddle)
    expect(httpService.middleware).toHaveLength(1)
  })

  it('should execute middleware in each request', async () => {
    const testMiddle = jest.fn()

    httpService.middleware = []
    httpService.addMiddleware(testMiddle)

    global.fetch = mockFetch({responseData: {test: 1}})
    const [getRequest] = httpService.get({url: '/api/v1/cases'})
    await getRequest()
    expect(testMiddle).toHaveBeenCalledTimes(1)

    const [postRequest] = httpService.post({
      url: '/api/v1/cases',
      body: {test: 1},
    })
    await postRequest()
    expect(testMiddle).toHaveBeenCalledTimes(2)
  })

  it('should reject the promise if one middleware returns false', async () => {
    const testMiddle = jest.fn(() => false)

    httpService.middleware = []
    httpService.addMiddleware(testMiddle)

    global.fetch = mockFetch({responseData: {test: 1}})
    httpService.handleErrors = jest.fn()
    const [request] = httpService.get({url: '/api/v1/cases'})
    await request()

    expect(httpService.handleErrors).toHaveBeenCalledTimes(1)
    expect(httpService.handleErrors.mock.calls[0][0] instanceof Error).toBe(
      true,
    )
  })

  it('should log errors to console in development env', async () => {
    console.log = jest.fn(() => {})

    const testMiddle = jest.fn(() => false)
    httpService.addMiddleware(testMiddle)

    global.fetch = mockFetch({responseData: {test: 1}})
    const [request] = httpService.get({url: '/api/v1/cases'})
    await request()
    expect(console.log).toHaveBeenCalledTimes(1)
  })

  it('should throw error again if AbortError', async () => {
    console.log = jest.fn(() => {})

    const testMiddle = jest.fn(() => true)
    httpService.addMiddleware(testMiddle)

    global.fetch = mockFetch({
      responseData: {test: 1},
      error: {name: 'AbortError'},
    })
    const [request] = httpService.get({url: '/api/v1/cases'})
    await expect(request()).rejects.toEqual({name: 'AbortError'})
  })
})
