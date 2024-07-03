// server.js
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authController = require('./controllers/authController');
const authMiddleware = require('./middleware/authMiddleware');
const QueueManager = require('./services/queueManager');
const RequestWorker = require('./services/requestWorker');
const metrics = require('./metrics/metrics');

dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());

app.post('/register', authController.register);
app.post('/login', authController.login);

app.post('/enqueue', authMiddleware, async (req, res) => {
    const queueName = `user_${req.userId}`;
    await QueueManager.createQueue(queueName);
    await QueueManager.sendToQueue(queueName, JSON.stringify(req.body));
    res.send('Request enqueued');
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', metrics.contentType);
    res.end(await metrics.metrics());
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

const requestWorker = new RequestWorker(`user_1234`);  // Example user queue name
requestWorker.start();
