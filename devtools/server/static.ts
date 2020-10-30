import express, { Express } from 'express'
import path from 'path'
import fs from 'fs'
import getPort from 'get-port'
import glob from 'glob'
import ejs from 'ejs'
import { Deferred } from '../utils'

const rootPath = path.join(__dirname, '../')
const isDev = process.env.DEVTOOLS_ENV === 'develop'

let app: Express
let port = 3000
let allFiles: string[] | null = null

export interface ServerOptions {
  /**
   * mini project path
   */
  miniPath: string
  /**
   * preferred static server port
   */
  port?: number | string
}

export default async function startServer(options: ServerOptions) {
  const { miniPath, port: preferredPort } = options

  if (preferredPort && !isNaN(+preferredPort)) {
    port = +preferredPort
  }

  const deferred = new Deferred<number>()
  getPort({ port }).then(deferred.resolve)

  port = await deferred.promise
  app = express()

  app.use('/mini', express.static(miniPath))
  app.use('/devtools', express.static(path.join(__dirname, '../frontend')))

  const clientDir = path.join(rootPath, isDev ? 'dev/client' : 'client')
  allFiles = glob.sync(`${clientDir}/*`, { ignore: ['**/*.map'] })

  // client static
  app.get('*', (req, res) => {
    const url = req.url === '/' ? 'index.html' : req.url
    const filePath = allFiles.find(file => file.includes(url))

    if (url === 'index.html') {
      const content = ejs.render(fs.readFileSync(filePath, 'utf-8'), {
        __HOST__: req.hostname,
        __PORT__: port,
        __PUBLIC_PATH__: '/mini/apps/',
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
  app.listen(port, () => {
    console.log(`\nstatic server is running at http://localhost:${port}`)
  })

  return { server: app, port }
}
