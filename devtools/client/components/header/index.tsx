import React from 'react'
import './index.less'

export default function Top() {
  return (
    <div className='ma-header'>
      <div className='ma-header-title'>demo</div>
      {/* https://developers.weixin.qq.com/community/develop/doc/000c8664d906981f02e9947315ac00 */}
      <div className='ma-header-capsule'>
        <div className="more g-center">
          <i className="more-dot" />
          <i className="more-dot large" />
          <i className="more-dot" />
        </div>
        <div className="quit g-center" />
      </div>
    </div>
  )
}
