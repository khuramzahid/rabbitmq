var amqp = require('amqplib/callback_api');

const connect = async (amqp, host) => {
    return new Promise ((resolve, reject) => {
        amqp.connect(host, (error, connection) => {
            if (error) {
                reject(error);
            }
            resolve(connection);
        });
    });
};

const createChannel = async (connection) => {
    return new Promise ((resolve, reject) => {
        connection.createChannel((error, channel) => {
            if (error) {
                reject(error);
            }
            resolve(channel);
        });
    });
};

async function task() {
    const connection = await connect(amqp, 'amqp://localhost');
    const channel = await createChannel(connection);
    
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
    
    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
}

task();