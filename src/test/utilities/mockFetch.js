export function mockFetch({
  responseData = {},
  responseHeaders = {},
  responseStatus = 200,
  responseStatusText = '',
  url = null,
  ok = true,
} = {}) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      status: responseStatus,
      statusText: responseStatusText,
      ok,
      headers: new Map(Object.entries(responseHeaders)),
      ...(url && {url}),
      json: () => responseData,
    }),
  )
}
