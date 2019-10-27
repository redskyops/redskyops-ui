import experimentsData from './_stubs/exp-data'

let instance

export class ExperimentsService {
  constructor() {
    if (!instance) {
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
    const abort = () => {}
    const getExperiments = () =>
      Promise.resolve(this.addIdsToExperments(experimentsData))
    return [getExperiments, abort]
  }
}
