const amqp = require("amqplib");

async function consumeMessages() {
    try {
        const connection = await amqp.connect(""); // Provide the RabbitMQ URL here
        const channel = await connection.createChannel();
        
        // Declare the exchange first
        await channel.assertExchange("logExchange", "direct");

        // Declare the queue (ensure it exists)
        const q = await channel.assertQueue("InfoQueue", { durable: true });

        // Bind the queue to the exchange
        await channel.bindQueue(q.queue, "logExchange", "Info");  // if listent to tow messages 
        await channel.bindQueue(q.queue, "logExchange", "Info");


        // Consume the messages from the queue
        channel.consume(q.queue, (msg) => {
            if (msg) {
                const data = JSON.parse(msg.content.toString());
                console.log(data);  // Log the received message
                channel.ack(msg);   // Acknowledge the message
            }
        });

        console.log("✅ Waiting for messages...");
    } catch (error) {
        console.error("❌ Error in consumer:", error.message);
    }
}

consumeMessages();
