import React, { createContext, useContext, useState } from 'react'
import ReactModal, { Props } from 'react-modal'
import { AlertStore } from './store'

import './index.less'

interface AlertProps
  extends Omit<Props, 'isOpen' | 'className' | 'ariaHideApp' | 'parentSelector'> {}

export const AlertContext = createContext<AlertStore>({} as any)
export * from './store'

export default function Alert(props: AlertProps) {
  const [, setTick] = useState(0)
  const forceUpdate = () => setTick(t => t + 1)
  const store = useContext(AlertContext)
  store.init(forceUpdate)

  return (
    <div className='ma-api-alert'>
      <ReactModal
        {...props}
        className='alert'
        ariaHideApp={false}
        isOpen={store.isOpen}
        parentSelector={() => document.querySelector('.ma-page')}
      >
        {store.message}
      </ReactModal>
    </div>
  )
}
