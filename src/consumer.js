const functions = require('@google-cloud/functions-framework')
const { Storage } = require('@google-cloud/storage')
const crypto = require('node:crypto');

// Creates a client using Application Default Credentials
const storage = new Storage()
const BUCKET_NAME = 'feedbacks-event-store'

// Register a CloudEvent callback with the Functions Framework that will
// be executed when the Pub/Sub trigger topic receives a message.
functions.cloudEvent('store-feedback', async cloudEvent => {
	// The Pub/Sub message is passed as the CloudEvent's data payload.
	const base64name = cloudEvent.data.message.data
	const stringifiedData = Buffer.from(base64name, 'base64').toString();
	const parsedJson = JSON.parse(stringifiedData)
	console.log('Received feedback', parsedJson)

	const bucket = storage.bucket(BUCKET_NAME)

	const jsonFile = bucket.file('feedbacks-event-store.json')
	const [res] = await jsonFile.download()
	const parsedResponse = Buffer.from(res).toString()
	console.log('Successfully download object', parsedResponse)

	const parsedJSONFile = JSON.parse(parsedResponse ?? '[]')
	parsedJSONFile.push({
		...parsedJson,
		timestamp: new Date(),
		uuid: crypto.randomUUID(),
	})

	await jsonFile.save(
		JSON.stringify(parsedJSONFile),
		{ contentType: 'application/json', metadata: { contentType: 'application/json' } }
	)
	console.log('Updated Event store');
});
