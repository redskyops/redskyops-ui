const getAllLabelsFromTrials = trials => {
  return trials.reduce((acc, {labels}) => {
    return labels
      ? [...acc, ...Object.keys(labels).filter(l => acc.indexOf(l) < 0)]
      : acc
  }, [])
}

export default getAllLabelsFromTrials
