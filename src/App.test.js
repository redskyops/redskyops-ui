/* eslint-disable-next-line */
import React from 'react'
import ReactDOM from 'react-dom'
/* eslint-disable-next-line */
import App from './App'

/* eslint-disable-next-line */
it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})
