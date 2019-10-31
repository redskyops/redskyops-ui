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
}
