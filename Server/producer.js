const amqp = require('amqplib');
const config = require('./config');

class Producer {
    channel;

    async createChannel() {
        try {
            console.log("Connecting to RabbitMQ...");
            const connection = await amqp.connect(config.rabbitMQ.url);
            this.channel = await connection.createChannel();
            console.log("✅ RabbitMQ Channel Created");
        } catch (error) {
            console.error("❌ RabbitMQ Connection Error:", error.message);
        }
    }

    async publishMessage(routingKey, message) {
        if (!this.channel) {
            await this.createChannel();
        }

        if (!this.channel) {
            console.error("❌ Channel not available. Message not sent.");
            return;
        }

        const exchangeName = config.rabbitMQ.exchangeName;
        await this.channel.assertExchange(exchangeName, 'direct');

        const logDetails = {
            logType: routingKey,
            message: message,
            dateTime: new Date()
        };

        this.channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(logDetails)));
        console.log(`✅ Message "${message}" sent to exchange "${exchangeName}"`);
    }
}

module.exports = Producer;
