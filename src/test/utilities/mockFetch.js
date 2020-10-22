export function mockFetch({
  responseData = {},
  responseHeaders = {},
  responseStatus = 200,
  responseStatusText = '',
  url = null,
  ok = true,
  error = null,
} = {}) {
  /* eslint-disable indent */
  return jest.fn().mockImplementation(() =>
    !error
      ? Promise.resolve({
          status: responseStatus,
          statusText: responseStatusText,
          ok,
          headers: new Map(Object.entries(responseHeaders)),
          ...(url && {url}),
          json: () => responseData,
        })
      : Promise.reject(error),
  )
  /* eslint-enable indent */
}
