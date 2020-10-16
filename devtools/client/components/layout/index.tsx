import React, { createContext, useContext, useState } from 'react'
import { LayoutStore } from './store'

import './index.less'

export const LayoutContext = createContext<LayoutStore>({} as any)
export * from './store'

export default function Layout() {
  const [, setTick] = useState(0)
  const forceUpdate = () => setTick(t => t + 1)
  const store = useContext(LayoutContext)
  store.init(forceUpdate)

  return (
    <div className='ma-page-container'>
      {store.webViews.map((page, i) => {
        return (
          <iframe
            key={page.getId()}
            // ref={page.getId()}
            name={page.getName()}
            src={page.getUrl()}
            style={{ zIndex: i + 1 }}
          />
        )
      })}
      {store.service && (
        <iframe
          className='g-hidden'
          // ref={store.service.getId()}
          name={store.service.getName()}
          src={store.service.getUrl()}
        />
      )}
    </div>
  )
}
