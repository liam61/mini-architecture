import React from 'react'
import './index.less'

export default function Top() {
  return (
    <div className='ma-top'>
      <div className='ma-top-name'>devtools</div>
      <div className='ma-top-time'>16:24</div>
      <div className='ma-top-battery'>
        99%
        <i className='battery g-center' />
      </div>
    </div>
  )
}
