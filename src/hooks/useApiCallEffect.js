import {useEffect} from 'react'

const FAKE_RESPONSE = 'FAKE_RESPONSE'

const useApiCallEffect = (requestFactory, success, _fail, runOn = []) => {
  const fail = typeof _fail === 'function' ? _fail : () => {}
  let factoryResult = requestFactory() || [() => FAKE_RESPONSE, () => {}]
  const [request, abort] = factoryResult

  const cleanUp = () => abort()
  const effect = () => {
    //eslint-disable-next-line no-extra-semi
    ;(async () => {
      try {
        const response = await request()
        if (response === FAKE_RESPONSE) {
          return
        }
        success(response)
      } catch (e) {
        if (e.name === 'AbortError') {
          return
        }
        fail(e)
      }
    })()
    return cleanUp
  }
  useEffect(effect, runOn)
}

export default useApiCallEffect
