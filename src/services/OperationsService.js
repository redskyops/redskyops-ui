let instance
const BEACON_INTERVAL = 2500

export class OperationsService {
  constructor() {
    if (!instance) {
      this.url = ''
      this.interval = null
      this.healthErrorHandlers = []
      this.healthSuccessHandlers = []
      instance = this
    }
    return instance
  }

  shutdown = () => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/shutdown', false)
    xhr.send()
  }

  checkBackendHealth = () => {
    return fetch(`${this.url}/health`)
      .then(res => {
        if (!res.ok) {
          throw new Error(res.statusText)
        }
        this.healthSuccessHandlers.forEach(handler => handler(res))
        return res
      })
      .catch(error => {
        this.healthErrorHandlers.forEach(handler => handler(error))
      })
  }

  startBackendHealthCheck = ({onError = null, onSuccess = null} = {}) => {
    clearInterval(this.interval)
    if ('function' === typeof onError) this.healthErrorHandlers.push(onError)
    if ('function' === typeof onSuccess)
      this.healthSuccessHandlers.push(onSuccess)
    this.checkBackendHealth()
    this.interval = setInterval(this.checkBackendHealth, BEACON_INTERVAL)
  }

  stopBackendHealthCheck({onError = null, onSuccess = null} = {}) {
    clearInterval(this.interval)
    const errorHandlerIndex = this.healthErrorHandlers.findIndex(
      f => f === onError,
    )
    if (errorHandlerIndex > -1) {
      this.healthErrorHandlers.splice(errorHandlerIndex, 1)
    }
    const successHandlerIndex = this.healthSuccessHandlers.findIndex(
      f => f === onSuccess,
    )
    if (successHandlerIndex > -1) {
      this.healthSuccessHandlers.splice(successHandlerIndex, 1)
    }
  }
}
