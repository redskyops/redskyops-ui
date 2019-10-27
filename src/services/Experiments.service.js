let instance

import experimentsData from './_stubs/exp-data'

export class HttpService {
  constructor() {
    if (!instance) {
      instance = this
    }
    return instance
  }

  getExperimentsFactory() {
    const abort = () => {}
    const getExperiments = () => Promise.resolve(experimentsData)
    return [getExperiments, abort]
  }
}
