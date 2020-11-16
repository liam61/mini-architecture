import express, { Express } from 'express'
import path from 'path'
import fs from 'fs'
import getPort from 'get-port'
import glob from 'glob'
import ejs from 'ejs'
import expressWs from 'express-ws'
import { normalizePath } from '@mini-architecture/utils'

export interface ServerOptions {
  /**
   * mini project path
   */
  miniPath?: string
  /**
   * preferred static server port
   */
  port?: number | string
}

export interface StaticServer extends Express {
  send(data: Record<string, any>): void
  close(): Promise<Error | null>
}

const rootPath = path.join(__dirname, '../..')
const isDev = process.env.DEVTOOLS_ENV === 'develop'

let app: StaticServer
let port = 3000
let allFiles: string[] = []
const wsPath = '/'
const clientMap = new Map()

export default async function startServer(options?: ServerOptions) {
  const {
    miniPath = normalizePath('MINI_OUTPUT', path.join(rootPath, 'devtools/dist/mini')),
    port: preferredPort,
  } = options || {}

  if (preferredPort && !isNaN(+preferredPort)) {
    port = +preferredPort
  }

  if (process.env.DEVTOOLS_ENV !== 'develop') {
    port = await getPort({ port })
  }

  app = express() as any

  app.use('/mini', express.static(miniPath))
  app.use('/devtools', express.static(path.join(__dirname, '../frontend')))

  expressWs(app)
  ;(app as any).ws(wsPath, (ws, _req) => {
    console.log('[staticServer]: a client connected')
    ws._id = Math.random().toString(36).slice(-8)
    clientMap.set(ws._id, ws)

    ws.on('message', data => {
      // console.log('message', data.toString())
      const _message = JSON.parse(data.toString())
    })

    ws.on('close', code => {
      ws.terminate()
      clientMap.delete(ws._id)
      console.log(`[staticServer]: a client disconnected, code: ${code}\n`)
    })
  })

  app.send = function (data: Record<string, any>) {
    clientMap.forEach(client => {
      if (client.readyState !== 1) return
      client.send(JSON.stringify(data))
    })
  }

  const clientDir = path.join(rootPath, 'devtools/dist/client')
  allFiles = glob.sync(`${clientDir}/*`, { ignore: ['**/*.map'] })

  // client static
  app.get('*', (req, res) => {
    const url = req.url === '/' ? 'index.html' : req.url
    const filePath = allFiles.find(file => file.includes(url)) || ''

    if (url === 'index.html') {
      const content = ejs.render(fs.readFileSync(filePath, 'utf-8'), {
        __ENV__: process.env.DEVTOOLS_ENV,
        __HOST__: req.hostname,
        __PORT__: port,
        __PUBLIC_PATH__: '/mini/apps/',
        __WS_PATH__: wsPath,
      })
      res.type('html').send(content)
    } else if (filePath) {
      res.sendFile(filePath)
    } else {
      res.sendStatus(404)
    }
  })

  // http://localhost:3000/mini/apps/miniDemo/pages/index
  // http://localhost:3000/mini/apps/miniDemo/service.html
  const httpServer = app.listen(port, () => {
    console.log(`\nstatic server is running at http://localhost:${port}`)
  })

  app.close = () => {
    return new Promise(resolve => {
      console.log('static server close')
      httpServer.close(resolve)
    })
  }

  return { server: app, port }
}
