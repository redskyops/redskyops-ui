import React from 'react'

import style from './HelpDocs.module.scss'

export const HelpDocs = () => {
  return (
    <div className={style.docDetails}>
      <div className={style.generalSection}>
        <div>
          <h1 className={style.generalTitle}>Resources and Helpful Links:</h1>
          <div className={style.links}>
            <a
              href="//redskyops.dev/docs/"
              className={style.link}
              target="_blank"
              rel="noreferrer"
            >
              Red Sky Ops General Information
            </a>
          </div>
          <div className={style.links}>
            <a
              href="//github.com/redskyops/redskyops-recipes"
              className={style.link}
              target="_blank"
              rel="noreferrer"
            >
              Red Sky Ops Recipes
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpDocs
