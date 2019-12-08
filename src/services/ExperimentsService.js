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
      url: `${this.url}/`,
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

  postLabelToTrialFactory({experimentId, trialId, labels}) {
    const [request, abort] = this.http.post({
      url: `${this.url}/${experimentId}/trials/${trialId}/labels/`,
      body: {labels},
    })
    const postLabel = () =>
      request().then(async response => {
        if (!response) {
          throw new Error('Error in ExperimentsService.postLabelToTrialFactory')
        }
        return await response.json()
      })
    return [postLabel, abort]
  }
}
