// import experimentsData from './_stubs/exp-data'
import trialsData from './_stubs/trials-data'
import {HttpService} from './HttpService'

import {backedAddress} from '../config'

let instance

export class ExperimentsService {
  constructor() {
    if (!instance) {
      this.http = new HttpService()
      this.url = `${backedAddress}/experiments`
      instance = this
    }
    return instance
  }

  addIdsToExperments(expData) {
    return {
      experiments: expData.experiments.map(exp => {
        const id = exp._metadata.Link[0].match(
          /.+?\/api\/experiments\/(.*)>.*/,
        )[1]
        return {
          ...exp,
          id,
        }
      }),
    }
  }

  getExperimentsFactory() {
    const [request, abort] = this.http.get({
      url: this.url,
    })
    const getExperiments = () =>
      request().then(async response => {
        if (!response) {
          throw new Error('Error in ExperimentsService.getExperiments')
        }
        return await response.json()
      })
    return [getExperiments, abort]
  }

  getTrialsFactory({id}) {
    const abort = () => ({id})
    const getExperiments = () => {
      return Promise.resolve(trialsData)
    }
    return [getExperiments, abort]
  }
}
