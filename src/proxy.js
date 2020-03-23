// const proxy = require('http-proxy-middleware')
const fetch = require('node-fetch')
const express = require('express')
const request = require('request')
const app = express()
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

dotenv.config()

if (
  !process.env.REDSKY_SERVER_IDENTIFIER ||
  !process.env.REDSKY_SERVER_ISSUER ||
  !process.env.REDSKY_AUTHORIZATION_CLIENT_ID ||
  !process.env.REDSKY_AUTHORIZATION_CLIENT_SECRET
) {
  throw new Error('Proxy cannot run without required environment variables')
}

app.use(bodyParser.json())

const REDSKY_SERVER_IDENTIFIER = process.env.REDSKY_SERVER_IDENTIFIER
const REDSKY_SERVER_ISSUER = process.env.REDSKY_SERVER_ISSUER
const REDSKY_AUTHORIZATION_CLIENT_ID =
  process.env.REDSKY_AUTHORIZATION_CLIENT_ID
const REDSKY_AUTHORIZATION_CLIENT_SECRET =
  process.env.REDSKY_AUTHORIZATION_CLIENT_SECRET

let token
let tokenType

fetch(`${REDSKY_SERVER_ISSUER}/oauth/token`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: [
    `client_id=${REDSKY_AUTHORIZATION_CLIENT_ID}`,
    `client_secret=${REDSKY_AUTHORIZATION_CLIENT_SECRET}`,
    'grant_type=client_credentials',
    `audience=https://api.carbonrelay.io/v1/`,
  ].join('&'),
})
  .then(res => {
    return res.json()
  })
  .then(tokenRes => {
    console.log(`[PROXY] Auth token obtained successfully`)
    token = tokenRes.access_token
    tokenType = tokenRes.token_type
  })
  .catch(error => console.log(`[PROXY:ERROR] ${error}`))

const proxyRequest = (req, res) => {
  let url = (process.env.DOCKER_ENV ? req.originalUrl : req.path).replace(
    /\/api/g,
    '',
  )
  const queryStr = Object.keys(req.query).map(
    param => `${param}=${req.query[param]}`,
  )
  url += queryStr.length > 0 ? `?${queryStr.join('&')}` : ''

  const newHeaders = {...req.headers}
  delete newHeaders.Authorization
  delete newHeaders.authorization
  delete newHeaders['content-length']
  delete newHeaders['host']

  const options = {
    url: `${REDSKY_SERVER_IDENTIFIER}${url.replace(/\/\//g, '/')}`,
    method: req.method,
    json: true,
    ...(['POST', 'PATCH', 'PUT'].indexOf(req.method) > -1
      ? {body: req.body}
      : null),
    headers: {
      ...newHeaders,
      Authorization: `${tokenType} ${token}`,
    },
  }

  console.log(`[PROXY] Requesting ${req.method} ${url}`)
  request(options, function(error, response, body) {
    if (error) {
      console.log('[PROXY:ERROR]', error)
    }
    if (!response) {
      console.log('[PROXY:ERROR]', 'Error in backend')
      res.status(400)
      res.send({error: 'Error in response'})
      return
    }
    console.log(`[PROXY] ${response.statusCode} ${url}`)
    if (response.statusCode === 401) {
      res.status(401)
      res.send({error: 'Token expired, restart development proxy'})
      return
    }

    res.status(response.statusCode)
    res.send(body)
  })
}

app.use('/experiments', proxyRequest)
app.use('/shutdown', (req, res) => {
  console.log(`[PROXY] Requesting /shutdown`)
  res.send('shutdown')
})
app.use('/health', (req, res) => {
  console.log(`[PROXY] Requesting /health`)
  res.send('health')
})

app.listen(8000)

console.log('[PROXY] started on port 8000')
