import {TypeTrials, TypeActiveTrial} from '../../context/DefaultState'

type ChartPropsType = {
  trials: TypeTrials,
  activeTrial?: TypeActiveTrial,
  xAxisMetricName: string,
  yAxisMetricName: string,
  selectTrialHandler: Function,
}

export default ChartPropsType
