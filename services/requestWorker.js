// services/requestWorker.js
const QueueManager = require('./queueManager');

class RequestWorker {
    constructor(queueName) {
        this.queueName = queueName;
    }

    async start() {
        await QueueManager.connect();
        await QueueManager.createQueue(this.queueName);
        QueueManager.receiveFromQueue(this.queueName, async (msg) => {
            const request = JSON.parse(msg.content.toString());
            await this.processRequest(request);
            QueueManager.channel.ack(msg);
        });
    }

    async processRequest(request) {
        // Implement your request processing logic here
        console.log('Processing request:', request);
    }
}

module.exports = RequestWorker;
