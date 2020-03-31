import express from 'express'
const app = express()

app.get('/', (req, res) => res.send("Hello world"))
app.get('/add_item', (req, res) => res.send("Hello add item"))

export default {
  handler: app
}