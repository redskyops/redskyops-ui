const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'http://localhost:8000',
      router: {
        '/api/experiments': 'http://localhost:8000/api/experiments',
      },
    }),
  )
  app.use(
    '/shutdown',
    proxy({
      target: 'http://localhost:8000',
      router: {
        '/shutdown': 'http://localhost:8000/shutdown',
      },
    }),
  )
  app.use(
    '/health',
    proxy({
      target: 'http://localhost:8000',
      router: {
        '/health': 'http://localhost:8000/health',
      },
    }),
  )
}
