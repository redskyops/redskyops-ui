import React from 'react'
import {withRouter} from 'react-router-dom'

import style from './HelpDocs.module.scss'

export const HelpDocs = () => {
  return (
    <div className={style.docDetails}>
      <div className={style.generalSection}>
        <div>
          <h1 className={style.generalTitle}>Resources and Helpful Links:</h1>
          <div className={style.links}>
            <a
              style={{color: '#000000'}}
              href="https://redskyops.dev/docs/"
              className="button"
              target="_blank"
            >
              Red Sky Ops General Information
            </a>
          </div>
          <div className={style.links}>
            <a
              style={{color: '#000000'}}
              href="https://github.com/redskyops/redskyops-recipes"
              className="button"
              target="_blank"
            >
              Red Sky Ops Recipes
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRouter(HelpDocs)
