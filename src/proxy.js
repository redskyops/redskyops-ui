// const proxy = require('http-proxy-middleware')
const fetch = require('node-fetch')
const express = require('express')
const request = require('request')
const app = express()
const dotenv = require('dotenv')

dotenv.config()

if (
  !process.env.REDSKY_ADDRESS ||
  !process.env.REDSKY_OAUTH2_CLIENT_ID ||
  !process.env.REDSKY_OAUTH2_CLIENT_SECRET
) {
  throw new Error('Proxy cannot run without required environment variables')
}

const REDSKY_ADDRESS = process.env.REDSKY_ADDRESS
const REDSKY_OAUTH2_CLIENT_ID = process.env.REDSKY_OAUTH2_CLIENT_ID
const REDSKY_OAUTH2_CLIENT_SECRET = process.env.REDSKY_OAUTH2_CLIENT_SECRET

let token
let tokenType

fetch(`${REDSKY_ADDRESS}/auth/token/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: `client_id=${REDSKY_OAUTH2_CLIENT_ID}&client_secret=${REDSKY_OAUTH2_CLIENT_SECRET}`,
})
  .then(res => res.json())
  .then(tokenRes => {
    console.log(`[PROXY] Auth token obtained successfully`)
    token = tokenRes.access_token
    tokenType = tokenRes.token_type
  })

const proxyRequest = (req, res) => {
  const url = process.env.DOCKER_ENV ? req.originalUrl : req.path
  const options = {
    url: `${REDSKY_ADDRESS}${url.replace(/\/\//g, '/')}`,
    headers: {
      Authorization: `${tokenType} ${token}`,
    },
  }

  console.log(`[PROXY] Requesting ${url}`)
  request(options, function(error, response, body) {
    console.log(`[PROXY] ${response.statusCode} ${url}`)
    if (error) {
      console.log('[PROXY:ERROR]', response.statusCode, error)
    }
    if (response.statusCode === 401) {
      res.status(401)
      res.send({error: 'Token expired, restart development proxy'})
      return
    }
    if (!error && response.statusCode === 200) {
      res.send(body)
      return
    }

    res.status(response.statusCode)
    res.send(body)
  })
}

app.use('/api/experiments', proxyRequest)
app.use('/api/experiments/:name/trials', proxyRequest)

app.listen(8000)

console.log('[PROXY] started on port 8000')
