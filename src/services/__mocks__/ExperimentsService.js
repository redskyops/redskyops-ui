let instance

export class ExperimentsService {
  constructor() {
    if (!instance) {
      this.getExperimentsFactory = jest.fn()
      this.getTrialsFactory = jest.fn()
      instance = this
    }
    return instance
  }
}
