import React from 'react'
import wifiIcon from './wifi.svg'

import './index.less'

export default function Top() {
  return (
    <div className='ma-top'>
      <div className='ma-top-name'>
        <img className='wifi' src={wifiIcon} />
        devtools
      </div>
      <span className='ma-top-time'>16:24</span>
      <div className='ma-top-battery'>
        92%
        <i className='battery g-center' />
      </div>
    </div>
  )
}
