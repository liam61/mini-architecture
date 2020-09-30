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
          {/* <Layout /> */}
          <iframe
            // ref={webviews.get(id)}
            name='maWebview'
            // src={`http://${httpServerHost}:${port}/__dev__/${pathId}/page-frame.html`}
            src='http://localhost:3000/apps/miniDemo/pages/index'
          />
          <iframe
            className='g-hidden'
            // ref={webviews.get(id)}
            name='maService'
            src='http://localhost:3000/apps/miniDemo/service.html'
          />
          <Alert />
        </div>
      </LayoutContext.Provider>
    </AlertContext.Provider>
  )
}
