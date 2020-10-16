import React from 'react'
import Alert, { AlertContext, alertStore } from '../components/alert'
import Layout, { LayoutContext, layoutStore } from '../components/layout'
import NavigationBar from '../components/navigationBar'

import './index.less'

export default function Page() {
  return (
    <AlertContext.Provider value={alertStore}>
      <LayoutContext.Provider value={layoutStore}>
        <NavigationBar />
        <div className='ma-page'>
          <Layout />
          <Alert />
        </div>
      </LayoutContext.Provider>
    </AlertContext.Provider>
  )
}
