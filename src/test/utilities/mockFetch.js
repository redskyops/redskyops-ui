export function mockFetch({
  responseData = {},
  responseHeaders = {},
  responseStatus = 200,
  url = null,
} = {}) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      status: responseStatus,
      ok: true,
      headers: new Map(Object.entries(responseHeaders)),
      ...(url && {url}),
      json: () => responseData,
    }),
  )
}
