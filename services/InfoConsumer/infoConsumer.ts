import amqp from "amqplib";

export class InfoConsumer {
  
  public async consumeMessages() {
    const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://localhost";
    const connection = await amqp.connect(rabbitmqUrl);

    const channel: amqp.Channel = await connection.createChannel();

    await channel.assertExchange("logExchange", "direct");

    const q = await channel.assertQueue("InfoQueue");

    await channel.bindQueue(q.queue, "logExchange", "Info");

    channel.consume(q.queue, (msg) => {
      if (msg !== null && msg.content) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log("Received message:", data);
          channel.ack(msg);
        } catch (error) {
          console.error("Error parsing message content:", error);
          console.log("Raw message content:", msg.content.toString());
        }
      }
    });
  }
}
