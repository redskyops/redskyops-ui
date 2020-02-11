import {HttpService} from './HttpService'

let instance

export class OperationsService {
  constructor() {
    if (!instance) {
      this.http = new HttpService()
      this.url = ''
      instance = this
    }
    return instance
  }

  shutdown() {
    return this.http.get({url: `${this.url}/shutdown`})
  }
}
