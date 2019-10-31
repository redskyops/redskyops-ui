const proxy = require('http-proxy-middleware')
// const fetch = require('node-fetch')

// const REDSKY_ADDRESS = 'http://example.com'
// const REDSKY_OAUTH2_CLIENT_ID = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
// const REDSKY_OAUTH2_CLIENT_SECRET =
//   'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'

// let token
// let tokenType

// fetch(`${REDSKY_ADDRESS}/auth/token/`, {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//   },
//   body: `client_id=${REDSKY_OAUTH2_CLIENT_ID}&client_secret=${REDSKY_OAUTH2_CLIENT_SECRET}`,
// })
//   .then(res => res.json())
//   .then(tokenRes => {
//     token = tokenRes.access_token
//     tokenType = tokenRes.token_type
//   })

module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'http://localhost:8000',
      router: {
        '/api/experiments': 'http://localhost:8000/api/experiments',
      },
      // target: `${REDSKY_ADDRESS}/api/experiments`,
      // // changeOrigin: true,
      // logLevel: 'debug',
      // // secure: false,
      // // headers: {
      // //   Authorization: `${tokenType} ${token}`,
      // //   Connection: 'keep-alive',
      // // },
      // onProxyRes: function(proxyRes, req, res) {
      //   // proxyRes.headers['x-added'] = 'foobar';
      //   // delete proxyRes.headers['x-removed'];
      //   // console.log(res)
      // },
      // onProxyReq: function(proxyReq, req, res) {
      //   // console.log(res)
      //   // proxyReq.setHeader('x-powered-by', 'foobar');
      // },
    }),
  )
}
