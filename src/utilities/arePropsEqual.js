const arePropsEqual = props => (prev, next) => {
  if (!props) return false
  const res = props.reduce((acc, prop) => {
    return acc && prev[prop] === next[prop]
  }, true)
  return res
}

export default arePropsEqual
