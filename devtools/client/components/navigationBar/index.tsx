import React, { useContext, useState } from 'react'
import { LayoutContext } from '../layout'
import backIcon from './back.svg'

import './index.less'

interface NavigationBarProps {
  title?: string
  back?: boolean
  onBack?: () => void
  onMore?: () => void
  onExit?: () => void
}

export * from './store'

// https://developers.weixin.qq.com/community/develop/doc/000c8664d906981f02e9947315ac00
export default function NavigationBar() {
  const [, setTick] = useState(0)
  const forceUpdate = () => setTick(t => t + 1)
  const store = useContext(LayoutContext)
  store.setNavUpdate(forceUpdate)

  const { navBar } = store

  return (
    <div className='ma-header'>
      {navBar.canGoBack && (
        <div className='ma-header-back' onClick={navBar.onBack}>
          <img className='back' src={backIcon} />
        </div>
      )}
      <div className='ma-header-title'>{navBar.title}</div>
      <div className='ma-header-capsule'>
        <div className='more g-center' onClick={navBar.onMore}>
          <i className='more-dot' />
          <i className='more-dot large' />
          <i className='more-dot' />
        </div>
        <div className='exit g-center' onClick={navBar.onExit} />
      </div>
    </div>
  )
}
