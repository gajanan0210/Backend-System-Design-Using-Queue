// services/queueManager.js
const amqp = require('amqplib');

class QueueManager {
    constructor() {
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        this.connection = await amqp.connect(process.env.RABBITMQ_URL);
        this.channel = await this.connection.createChannel();
    }

    async createQueue(queueName) {
        await this.channel.assertQueue(queueName);
    }

    async sendToQueue(queueName, message) {
        await this.channel.sendToQueue(queueName, Buffer.from(message));
    }

    async receiveFromQueue(queueName, callback) {
        await this.channel.consume(queueName, callback);
    }

    async deleteQueue(queueName) {
        await this.channel.deleteQueue(queueName);
    }
}

module.exports = new QueueManager();
