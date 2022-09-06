const {
  DynamoDBClient,
  PutItemCommand,
  BatchWriteItemCommand,
  QueryCommand,
  // DeleteItemCommand,
} = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

// connect to local DB if running offline
let options = {
  region: process.env.REGION
};
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    credentials: { accessKeyId: 'DUMMY', secretAccessKey: 'DUMMY' }
  };
}

const client = new DynamoDBClient(options);

/**
 *
 * @param  {string} tableName
 * @param  {Item} writeRequest https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/writerequest.html
 */
const putItemAsync = async (tableName, item) => {
  console.log(options);
  try {
    const command = new PutItemCommand({
      TableName: tableName,
      Item: item
    });
    const res = await client.send(command);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};


/**
 *
 * @param  {string} tableName
 * @param  {WriteRequest} writeRequests https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/writerequest.html
 */
const writeItemsAsync = async (tableName, writeRequests) => {
  try {
    const splitWriteRequests = splitBatchWriteItems(writeRequests);
    await Promise.all(
      splitWriteRequests.map(async (req) => {
        const command = new BatchWriteItemCommand({
          RequestItems: {
            [tableName]: req,
          },
        });
        const res = await client.send(command);
        console.log(res);
      })
    );
  } catch (e) {
    console.log(e);
  }
};

/**
 * @param  {string} tableName
 * @param  {string} userId
 * @return {array} items
 */
const getItemsAsync = async (tableName, userId) => {
  try {
    const params = {
      TableName: tableName,
      KeyConditionExpression: 'UserId = :user_id',
      ExpressionAttributeValues: {
        ':user_id': { S: `${deviceId}` },
      },
    };
    const data = await client.send(new QueryCommand(params));

    const items = [];
    data.Items.forEach((item) => {
      items.push(unmarshall(item));
    });
    return items;
  } catch (error) {
    console.log(error);
  }
};

/**
 * 配列を指定要素数ずつに分割する
 * @param  {array} items
 * @param  {number} splitCount=25
 * @return {array} splitArray (per splitCount)
 */
const splitBatchWriteItems = (items, splitCount = 25) => {
  const b = items.length;
  if (b <= splitCount) return [items];
  const splitItems = [];

  for (let i = 0; i < Math.ceil(b / splitCount); i++) {
    const start = i * splitCount;
    const end = start + splitCount;
    const p = items.slice(start, end);
    splitItems.push(p);
  }
  return splitItems;
};

module.exports = { writeItemsAsync, putItemAsync, getItemsAsync };
