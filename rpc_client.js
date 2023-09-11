#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Usage: rpc_client.js num");
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
    
        channel.assertQueue('', {
            exclusive: true
        }, function(error2, q) {
            if (error2) {
                throw error2;
            }
            var correlationId = generateUuid();
            var num = parseInt(args[0]);

            console.log(' [x] Requesting fib(%d)', num);

            channel.consume(q.queue, function(msg) {
                if (msg.properties.correlationId === correlationId) {
                    console.log(' [.] Got %s', msg.content.toString());
                    setTimeout(function() {
                        connection.close();
                        process.exit(0);
                    }, 500);
                }
            }, {
                noAck: true
            });

            channel.sendToQueue('rpc_queue',
                Buffer.from(num.toString()), {
                    correlationId: correlationId,
                    replyTo: q.queue
                });
        });
}

task();

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}