let instance

export class HttpService {
  constructor() {
    if (!instance) {
      this.addMiddleware = jest.fn()
      this.removeMiddleware = jest.fn()
      this.get = jest.fn()
      this.post = jest.fn()
      instance = this
    }
    return instance
  }
}
