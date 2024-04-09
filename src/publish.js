const { PubSub } = require('@google-cloud/pubsub')

const pubSub = new PubSub()

async function publishMessage(topic, json) {
	const stringifiedData = JSON.stringify(json);
	const dataBuffer = Buffer.from(stringifiedData);

	// Creates a new topic if it does not exist
	let pubSubTopic = pubSub.topic(topic);
	if (pubSubTopic == null) {
		pubSubTopic = await pubSub.createTopic(topic)
		console.log(`Topic ${topic} created.`);
	}

	console.log('Publishing message to Pub/Sub', json)
	try {
		await pubSubTopic.publish(dataBuffer)
		console.log("Message successfully published", json)
	} catch (error) {
		console.error("Error when publishing to GCP Pub/Sub", json, error)
		throw error
	}
}

module.exports = publishMessage