const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 8080;

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => {
	console.log(`Server running in port: ${PORT}`)
})