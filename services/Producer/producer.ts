import amqp from "amqplib";
// import { rabbitMQ } from './config';

export class Producer {
  private channel: amqp.Channel | null = null;

  private async createChannel() {
    const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://localhost";
    const connection = await amqp.connect(rabbitmqUrl);
    this.channel = await connection.createChannel();
  }

  public async publishMessage(routingKey: string, message: string) {
    if (!this.channel) {
      await this.createChannel();
    }

    if (this.channel) {
      const exchangeName = "logExchange";
      await this.channel.assertExchange(exchangeName, "direct");

      const logDetails = {
        logType: routingKey,
        message: message,
        dateTime: new Date(),
      };

      this.channel.publish(
        exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(logDetails))
      );

      console.log(
        `The new ${routingKey} log is sent to exchange ${exchangeName}`
      );
    } else {
      console.error("Failed to create a channel");
    }
  }
}
