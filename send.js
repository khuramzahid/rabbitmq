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
    
    var msg = 'Hello World!';
    
    channel.assertQueue('queue1', {
        durable: false
    });
    
    channel.sendToQueue('queue1', Buffer.from(msg));
    
    console.log(" [x] Sent %s", msg);
    
    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
}

task();