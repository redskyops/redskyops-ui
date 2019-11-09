let instance
export class ExperimentsService {
  constructor() {
    if (!instance) {
      this.getExperimentsFactory = jest.fn()
      this.getTrialsFactory = jest.fn()
      this.addIdsToExperments = jest.fn(expData => {
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
      })
      instance = this
    }
    return instance
  }
}
