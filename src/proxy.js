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
    token = tokenRes.access_token
    tokenType = tokenRes.token_type
  })

const proxyRequest = (req, res) => {
  console.log(req.url)
  console.log(req.path)
  const options = {
    url: `${REDSKY_ADDRESS}${req.url}`,
    headers: {
      Authorization: `${tokenType} ${token}`,
    },
  }
  request(options, function(error, response, body) {
    if (error) {
      console.log('[PROXY:ERROR]', response.statusCode, error)
    }
    if (!error && response.statusCode === 200) {
      res.send(body)
    }
  })
}

app.use('/api/experiments', proxyRequest)
app.use('/api/experiments/:name/trials', proxyRequest)

app.listen(8000)
