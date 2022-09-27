const {
  DynamoDBClient,
  PutItemCommand,
  BatchWriteItemCommand,
  QueryCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  TransactWriteItemsCommand,
} = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

// create dynamodb client
// connect to local DB if running offline
let options = {
  region: process.env.REGION,
};
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    credentials: { accessKeyId: 'DUMMY', secretAccessKey: 'DUMMY' },
  };
}
const client = new DynamoDBClient(options);

/**
 * 単一アイテム追加
 * @param  {string} tableName
 * @param  {Item} item https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/putitemcommandinput.html#item
 * @return {PutItemCommandOutput} 追加結果 https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/putitemcommandoutput.html
 */
const putItemAsync = async (tableName, item) => {
  try {
    const command = new PutItemCommand({
      TableName: tableName,
      Item: item,
    });
    return await client.send(command);
  } catch (error) {
    return error;
  }
};

/**
 * アイテム追加（トランザクション）
 * @param  {string} tableName
 * @param  {Array<Item>} items
 * @return {TransactWriteItemsCommandOutput}
 */
const transactWriteItems = async (tableName, items) => {
  try {
    const command = new TransactWriteItemsCommand({
      TransactItems: items,
    });
    return await client.send(command);
  } catch (error) {
    return error;
  }
};

/**
 * 複数アイテム書き込み
 * @param  {string} tableName
 * @param  {WriteRequest} writeRequests https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/writerequest.html
 * @return {Array<BatchWriteItemCommandOutput>} 書き込み結果
 */
const writeItemsAsync = async (tableName, writeRequests) => {
  try {
    const splitWriteRequests = splitBatchWriteItems(writeRequests);
    return await Promise.all(
      splitWriteRequests.map(async (req) => {
        const command = new BatchWriteItemCommand({
          RequestItems: {
            [tableName]: req,
          },
        });
        return client.send(command);
      })
    );
  } catch (error) {
    return error;
  }
};

/**
 * 単一アイテム更新
 * @param  {string} tableName
 * @param  {object} item https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/updateitemcommandinput.html#key
 */
const updateItemAsync = async (tableName, item) => {
  try {
    const command = new UpdateItemCommand({
      Key: item,
    });
    return await client.send(command);
  } catch (error) {
    return error;
  }
};

/**
 * アイテム取得（プライマリキー）
 * @param  {string} tableName
 * @param  {string} primaryKey
 * @param  {string} type(S/N/)
 * @return {object} アイテム（見つからなかった場合はnull)
 */
const getItemByPrimaryKeyAsync = async (tableName, primaryKey, type, value) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: `${primaryKey} = :value`,
    ExpressionAttributeValues: {
      ':value': {
        [`${type}`]: `${value}`,
      },
    },
  };
  const data = await client.send(new QueryCommand(params));

  if (0 != data.Items.length) {
    return unmarshall(data.Items[0]);
  }
  return null;
};

/**
 * アイテム取得（GSI）
 * @param  {string} tableName
 * @param  {string} indexName
 * @param  {string} key
 * @param  {string} type(S/N/)
 * @param  {string} value
 * @return {object} アイテム（見つからなかった場合、複数見つかった場合はnull)
 */
const getItemByGSIAsync = async (tableName, indexName, key, type, value) => {
  const params = {
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: `${key} = :value`,
    ExpressionAttributeValues: {
      ':value': {
        [`${type}`]: `${value}`,
      },
    },
  };
  const data = await client.send(new QueryCommand(params));

  if (0 != data.Items.length) {
    return unmarshall(data.Items[0]);
  }
  return null;
};

/**
 * アイテム削除(プライマリキーで削除)
 * @param  {string} tableName
 * @param  {string} primaryKey
 * @param  {string} type(S/N/)
 * @param  {any} val value of primaryKey
 * @return {boolean} result
 */
const deleteItemByPrimaryKeyAsync = async (tableName, primaryKey, type, value) => {
  try {
    const command = new DeleteItemCommand({
      TableName: tableName,
      Key: {
        [primaryKey]: { [type]: value },
      },
    });
    return await client.send(command);
  } catch (error) {
    return error;
  }
};

/**
 * 配列を指定要素数ずつに分割
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

module.exports = {
  writeItemsAsync: writeItemsAsync,
  putItemAsync: putItemAsync,
  getItemByPrimaryKeyAsync: getItemByPrimaryKeyAsync,
  getItemByGSIAsync: getItemByGSIAsync,
  updateItemAsync: updateItemAsync,
  deleteItemByPrimaryKeyAsync: deleteItemByPrimaryKeyAsync,
  transactWriteItems: transactWriteItems,
};
