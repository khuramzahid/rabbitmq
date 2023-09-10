var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'task_queue';

    channel.assertQueue(queue, {
      durable: true
    });

    for (let j=0; j<10; j++) {
      let msg = process.argv.slice(2).join(' ') || `Hello World! ${j+1}`;

      channel.sendToQueue(queue, Buffer.from(msg), {
        persistent: true
      });

      console.log(" [x] Sent '%s'", msg);
    }
    
  });
  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});