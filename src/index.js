const express = require('express')
const cors = require('cors')
const path = require('path')
const publishMessage = require('./publish')

const app = express()
const PORT = process.env.PORT || 8080;

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

app.post('/feedbacks', async (req, res) => {
	const feedback = req.body.feedback
	console.log('Received message', feedback)

	if (feedback?.message == null || feedback?.name == null) {
		const error = 'Feedback missing message or name.'
		console.error('Invalid message', error)
		res.status(400).json({ ok: false, error })
		return
	}

	try {
		await publishMessage('feedback.created', feedback)
		res.status(201).json({ ok: true })
	} catch (error) {
		console.error('Publishing failed', error)
		res.status(500).json({ ok: false, error: error.message })
	}
	return
})

app.listen(PORT, () => {
	console.log(`Server running in port: ${PORT}`)
})