import {TypeTrials, TypeActiveTrial} from '../../context/DefaultState'

export type ChartPropsType = {
  trials: TypeTrials,
  activeTrial?: TypeActiveTrial,
  xAxisMetricName: string,
  yAxisMetricName: string,
  selectTrialHandler: Function,
  labelsFilter: Array<string>,
}
