'use strict';

module.exports.compute = async (event) => {
    console.log(event)
    return { message: 'consume sqs message!', event };
};
