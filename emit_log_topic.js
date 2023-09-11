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
    
        var exchange = 'topic_logs';
        var args = process.argv.slice(2);
        var key = (args.length > 0) ? args[0] : 'anonymous.info';
        var msg = args.slice(1).join(' ') || 'Hello World!';

        channel.assertExchange(exchange, 'topic', {
            durable: false
        });
        channel.publish(exchange, key, Buffer.from(msg));
        console.log(" [x] Sent %s: '%s'", key, msg);

    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
}

task();