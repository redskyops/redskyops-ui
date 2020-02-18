import {TypeTrials, TypeActiveTrial} from '../../context/DefaultState'

export type ChartPropsType = {
  trials: TypeTrials,
  activeTrial?: TypeActiveTrial,
  xAxisMetricName: string,
  yAxisMetricName: string,
  selectTrialHandler: Function,
  hoverTrialHandler: Function,
  labelsFilter: Array<string>,
}
