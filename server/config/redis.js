const {createClient} = require('redis')

const client = createClient({
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: 12012
    }
});

client.on('error', err => console.log('Redis Client Error', err));


module.exports = client