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

  getExperimentsFactory({limit = 20} = {}) {
    const [request, abort] = this.http.get({
      url: `${this.url}/`,
      queryParams: {limit},
    })
    const getExperiments = () =>
      request().then(async response => {
        if (!response) {
          throw new Error('Error in ExperimentsService.getExperiments')
        }
        const expData = await response.json()
        return this.addIdsToExperments(expData)
      })
    return [getExperiments, abort]
  }

  getTrialsFactory({name}) {
    const [request, abort] = this.http.get({
      url: `${this.url}/${name}/trials/`,
    })
    const getTrials = () =>
      request().then(async response => {
        if (!response) {
          throw new Error('Error in ExperimentsService.getTrials')
        }
        return await response.json()
      })
    return [getTrials, abort]
  }
}
