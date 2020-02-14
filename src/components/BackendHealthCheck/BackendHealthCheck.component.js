import React, {useEffect} from 'react'

import {connectWithState} from '../../context/StateContext'
import Loader from '../Loader/Loader.component'
import ServerDown from '../ServerDown/ServerDown.component'
import {OperationsService} from '../../services/OperationsService'

type TypeProps = {
  initialBackendCheck: boolean,
  backendHealthy: boolean,
  children: React.Node,
  updateState: () => {},
}

export const BackendHealthCheck = (props: TypeProps) => {
  const {initialBackendCheck, backendHealthy, children, updateState} = props
  const operationsServ = new OperationsService()

  const onSuccess = () => {
    if (!initialBackendCheck) {
      updateState({initialBackendCheck: true})
    }
  }

  const onError = () => {
    updateState(() => ({
      backendHealthy: false,
      ...(!initialBackendCheck ? {initialBackendCheck: true} : null),
    }))
    operationsServ.stopBackendHealthCheck({onSuccess, onError})
  }

  useEffect(() => {
    operationsServ.startBackendHealthCheck({onSuccess, onError})
    return () => {
      operationsServ.stopBackendHealthCheck({onSuccess, onError})
    }
  }, [])

  if (!initialBackendCheck) {
    return <Loader />
  }

  if (initialBackendCheck && !backendHealthy) {
    return <ServerDown />
  }

  return children
}

export default connectWithState(BackendHealthCheck, [
  'initialBackendCheck',
  'backendHealthy',
])
