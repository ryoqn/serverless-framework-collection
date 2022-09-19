'use strict';

module.exports.kinesisConsumer = async (event) => {
    try {
        event.Records.forEach(record => {
            let payload = new Buffer.from(record.kinesis.data, 'base64').toString('ascii');
            payload = JSON.parse(payload);
            console.log(payload)
        })
    } catch (e) {
        console.log(e.toString())
    }
};
