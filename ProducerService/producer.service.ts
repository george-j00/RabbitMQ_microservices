import ampq from 'amqplib'
import { rabbitMQ } from './config';

export class Producer {
    channel:any;

  async createChannel() {
    const connection = await ampq.connect(rabbitMQ.url);
    this.channel = await connection.createChannel();
  }

  async publishMessage(routingKey : string, message : string) {
    if (!this.channel) {
      await this.createChannel();
    }

    const exchangeName = rabbitMQ.exchangeName;
    await this.channel.assertExchange(exchangeName, "direct");

    const logDetails = {
      logType: routingKey,
      message: message,
      dateTime: new Date(),
    };
    
    await this.channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(logDetails))
    );

    console.log(
      `The new ${routingKey} log is sent to exchange ${exchangeName}`
    );
  }
}

