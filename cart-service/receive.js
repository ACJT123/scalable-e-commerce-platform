const amqp = require("amqplib/callback_api");
const dotenv = require("dotenv");

dotenv.config();

amqp.connect(process.env.RABBITMQ_URI, (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const queue = "cart";

    channel.assertQueue(queue, {
      durable: false,
    });

    channel.consume(queue, (message) => {
      console.log("Received message:", JSON.parse(message.content.toString()));
    });
  });
});
