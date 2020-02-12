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
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/shutdown', false)
    xhr.send()
  }
}
