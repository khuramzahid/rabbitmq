#!/usr/bin/env node

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
    
    var queue = 'queue1';
    
    channel.assertQueue(queue, {
        durable: false
    });
    
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    
    channel.consume(queue, function(msg) {
        console.log(" [x] Received %s", msg.content.toString());
        connection.close();
        process.exit(0);
    }, {
        noAck: true
    });
}

task();