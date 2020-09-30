import React, { createContext, useContext, useState } from 'react'
import { LayoutStore } from './store'

import './index.less'

interface LayoutProps {}

export const LayoutContext = createContext<LayoutStore>({} as any)
export * from './store'

export default function Layout(props: LayoutProps) {
  const [, setTick] = useState(0)
  const forceUpdate = () => setTick(t => t + 1)
  const store = useContext(LayoutContext)
  store.init(forceUpdate)

  return (
    <div className='ma-page-container'>
      {store.webViews.map((page, i) => {
        return (
          <iframe
            // ref={page.getId()}
            name={page.getName()}
            // pages/index
            src={`http://localhost:3000/apps/miniDemo/${page.getUrl()}`}
            style={{ zIndex: i + 1 }}
          />
        )
      })}
      <iframe
        className='g-hidden'
        // ref={store.service.getId()}
        name={store.service.getName()}
        // service.html
        src={`http://localhost:3000/apps/miniDemo/${store.service.getUrl()}`}
      />
    </div>
  )
}
