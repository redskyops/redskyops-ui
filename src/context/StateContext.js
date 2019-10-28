import React from 'react'
import PropTypes from 'prop-types'

import {DEFAULT_STATE} from './DefaultState'

import arePropsEqual from '../utilities/arePropsEqual'

export const StateContext = React.createContext(DEFAULT_STATE)
export const StateConsumer = StateContext.Consumer

export class StateProvider extends React.Component {
  state = DEFAULT_STATE
  stateListeners = []

  updateState = newState => {
    this.setState(newState)
  }

  render() {
    return (
      <StateContext.Provider
        value={{
          ...this.state,
          updateState: this.updateState,
        }}
      >
        {this.props.children}
      </StateContext.Provider>
    )
  }
}

StateProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
}

export const connectWithState = (Component, memoProps = null) => {
  let MemoComponent
  if (Array.isArray(memoProps) && memoProps.length > 0) {
    const propNames = [...memoProps]
    MemoComponent = React.memo(Component, arePropsEqual(propNames))
  } else if (typeof memoProps === 'function') {
    MemoComponent = React.memo(Component, memoProps)
  }

  if (MemoComponent) {
    const MemoStateConnector = props => {
      return (
        <StateConsumer>
          {context => {
            return <MemoComponent {...context} {...props} />
          }}
        </StateConsumer>
      )
    }
    return MemoStateConnector
  }

  const StateConnector = props => {
    return (
      <StateConsumer>
        {context => {
          return <Component {...context} {...props} />
        }}
      </StateConsumer>
    )
  }
  return StateConnector
}
