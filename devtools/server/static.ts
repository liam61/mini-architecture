import express, { Express } from 'express'
import path from 'path'
import fs from 'fs'
import getPort from 'get-port'
import glob from 'glob'
import ejs from 'ejs'
import { Deferred } from '../utils'

let app: Express

async function startServer(): Promise<number> {
  const deferred = new Deferred<number>()
  getPort({ port: 3000 }).then(deferred.resolve)

  const port = await deferred.promise
  app = express()

  app.use('/mini', express.static(path.join(__dirname, '../build/mini')))
  // app.use(express.static(path.join(__dirname, '../build/client')))
  app.use('/devtools', express.static(path.join(__dirname, '../frontend')))
  app.use('/pages', express.static(path.join(__dirname, '../build/mini/apps/miniDemo/pages')))

  const clientDir = path.join(__dirname, '../build/client')
  const allFiles = glob.sync(`${clientDir}/*`, { ignore: ['**/*.map'] })

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
    console.log(`\nserver is running at http://localhost:${port}`)
  })

  return port
}

// startServer()
export default startServer
