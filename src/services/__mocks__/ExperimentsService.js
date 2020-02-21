let instance
export class ExperimentsService {
  constructor() {
    if (!instance) {
      this.getExperimentsFactory = jest.fn()
      this.getTrialsFactory = jest.fn()
      this.addIdsToExperiments = jest.fn(expData => {
        return {
          experiments: expData.experiments.map(exp => {
            const id = exp._metadata.Link[0].match(
              /.+?\/experiments\/(.*)>.*/,
            )[1]
            return {
              ...exp,
              id,
            }
          }),
        }
      })
      this.postLabelToTrialFactory = jest.fn()
      instance = this
    }
    return instance
  }
}
