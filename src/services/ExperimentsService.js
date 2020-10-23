import {HttpService} from './HttpService'

import {backedAddress} from '../config'
import {mapMetricsValues} from '../utilities/trialsFunctions'

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

  addIdsToExperiments(expData) {
    return {
      experiments: expData.experiments.map(exp => {
        const id = exp._metadata.Link[0].match(/.+?\/experiments\/(.*)>.*/)[1]
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
        return this.addIdsToExperiments(expData)
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
        const data = await response.json()
        const mapedData = {...data, trials: mapMetricsValues(data.trials)}
        return mapedData
      })
    return [getTrials, abort]
  }

  postLabelToTrialFactory({experimentId, trialId, labels}) {
    const [request, abort] = this.http.post({
      url: `${this.url}/${experimentId}/trials/${trialId}/labels`,
      body: {labels},
    })
    const postLabel = () =>
      request().then(async response => {
        if (!response) {
          throw new Error('Error in ExperimentsService.postLabelToTrialFactory')
        }
        if (response.status >= 200 && response.status < 300) {
          return true
        }
        throw new Error('Error creating/deleting label')
      })
    return [postLabel, abort]
  }
}
