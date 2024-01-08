import amqp from 'amqplib';

async function consumeMessages() {
  const connection = await amqp.connect('amqp://localhost');
  const channel : amqp.Channel  = await connection.createChannel();

  await channel.assertExchange('logExchange', 'direct');
 
  const q = await channel.assertQueue('InfoQueue');

  await channel.bindQueue(q.queue, 'logExchange', 'Info');

  channel.consume(q.queue, (msg) => {
    if (msg !== null && msg.content) {
      try {
        const data = JSON.parse(msg.content.toString());
        console.log('Received message:', data);
        channel.ack(msg);
      } catch (error) {
        console.error('Error parsing message content:', error);
        console.log('Raw message content:', msg.content.toString());
      }
    }
  });
}

consumeMessages()
  .then(() => {
    console.log('Consumer service started successfully.');
  })
  .catch((err) => {
    console.error('Error starting consumer service:', err);
  });