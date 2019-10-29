import {DEFAULT_STATE} from '../DefaultState'
import React from 'react'
export const connectWithState = Component => {
  const context = {
    ...DEFAULT_STATE,
    updateState: jest.fn(),
  }
  const StateConnector = props => <Component {...context} {...props} />
  return StateConnector
}
