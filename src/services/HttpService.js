let instance

export class HttpService {
  constructor() {
    if (!instance) {
      this.middleware = []
      instance = this
    }
    return instance
  }

  addMiddleware(handler) {
    if (this.middleware.indexOf(handler) < 0) {
      this.middleware.push(handler)
    }
  }

  removeMiddleware(handler) {
    const position = this.middleware.indexOf(handler)
    if (position > -1) {
      this.middleware.splice(position, 1)
    }
  }

  applyMiddleware = response => {
    const result = this.middleware.reduce(
      (acc, handler) => acc && handler(response) !== false,
      true,
    )
    if (!result) {
      return Promise.reject(new Error('HttpService middleware error'))
    }
    return response
  }

  handleErrors = error => {
    if (error.name === 'AbortError') {
      throw error
    }
    process.env.NODE_ENV !== 'production' && console.log(error) // eslint-disable-line
    return null
  }

  get({url, queryParams = null}) {
    const controller = new AbortController()
    const {signal} = controller
    const factory = () =>
      fetch(this.getUrl(url, queryParams), {signal})
        .then(this.applyMiddleware)
        .catch(this.handleErrors)
    return [factory, controller.abort.bind(controller)]
  }

  post({url, body, queryParams = null}) {
    const controller = new AbortController()
    const {signal} = controller
    const factory = () =>
      fetch(this.getUrl(url, queryParams), {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      })
        .then(this.applyMiddleware)
        .catch(this.handleErrors)
    return [factory, controller.abort.bind(controller)]
  }

  getUrl(url, queryParams) {
    return `${url}${queryParams ? this.buildQueryString(queryParams) : ''}`
  }

  buildQueryString(params) {
    const segments = []
    // eslint-disable-next-line no-unused-vars
    for (const p in params) {
      let segment = encodeURIComponent(p)
      segment += params[p] ? `=${encodeURIComponent(params[p])}` : ''
      segments.push(segment)
    }
    return `?${segments.join('&')}`
  }
}
