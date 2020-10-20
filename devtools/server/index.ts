import express from 'express'
import path from 'path'

const app = express()
const port = 3000

app.use('/mini', express.static(path.join(__dirname, '../build/mini')))
app.use(express.static(path.join(__dirname, '../_dev')))

// app.get('/json', () => {
// res.status(200).json(retJson);
// })

// http://localhost:3000/mini/apps/miniDemo/pages/index
// http://localhost:3000/mini/apps/miniDemo/service.html
app.listen(port, () => console.log(`\nserver is running at http://localhost:${port}`))
