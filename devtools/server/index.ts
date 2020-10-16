import express from 'express'
import path from 'path'

const app = express()

app.use(express.static(path.join(__dirname, '../_dev')))
app.use('/client', express.static(path.join(__dirname, '../dist')))

// app.get('/json', () => {
  // res.status(200).json(retJson);
// })

// http://localhost:3000/apps/miniDemo/pages/index
// http://localhost:3000/apps/miniDemo/service.html
app.listen(3000, () => console.log(`server is listening at http://localhost:${3000}`))
