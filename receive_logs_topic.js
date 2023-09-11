#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Usage: receive_logs_topic.js <facility>.<severity>");
    process.exit(1);
}

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

        channel.assertExchange(exchange, 'topic', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, function(error2, q) {
            if (error2) {
                throw error2;
            }
            console.log(' [*] Waiting for logs. To exit press CTRL+C');

            args.forEach(function(key) {
                channel.bindQueue(q.queue, exchange, key);
            });

            channel.consume(q.queue, function(msg) {
                console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
            }, {
                noAck: true
            });
        });
}

task();