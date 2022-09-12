const db = require('../database');
const crypto = require('crypto');
const UserEntity = require('../entity/userEntity');

const TableName = 'users';
const PrimaryKey = 'pk';
const IndexName = 'username-index';

/**
 * @param  {UserEntity} entity
 */
const createUser = async (entity) => {
  entity.userId = crypto.randomUUID();
  const items = getPutItems(entity);
  const res = await db.transactWriteItems(TableName, items);
  await getUserByName(entity.userName);
  if (200 == res.$metadata.httpStatusCode) {
    return true;
  } else {
    console.error(`${res.name} \n ${res.message}`);
    return false;
  }
};

/**
 * @param  {string} userId
 * @return {UserEntity}
 */
const getUserById = async (userId) => {
  const item = await db.getItemByPrimalyKeyAsync(TableName, PrimaryKey, 'S', userId);
  return convertItemToEntity(item);
};

/**
 * @param  {string} userName
 * @param  {UserEntity}
 */
const getUserByName = async (userName) => {
  const item = await db.getItemByGSIAsync(TableName, IndexName, 'userName', 'S', userName);
  return convertItemToEntity(item);
};

/**
 * @return  {Array<UserEntity>}
 */
const getAllUser = async () => {};

/**
 * @param  {string} userId
 * @return {boolean} true: success,  false: fail
 */
const deleteUserById = async (userId) => {
  const item = await db.getItemByPrimalyKeyAsync(TableName, PrimaryKey, 'S', userId);
  const entity = convertItemToEntity(item);
  if (null == entity) {
    return false;
  }

  const deleteItems = getDeleteItems(entity);
  const res = await db.transactWriteItems(TableName, deleteItems);

  if (200 == res.$metadata.httpStatusCode) {
    return true;
  } else {
    console.error(`${res.name} \n ${res.message}`);
    return false;
  }
};

/**
 * @param  {string} userName
 */
const deleteUserByName = async (userName) => {
  const item = await db.getItemByGSIAsync(TableName, IndexName, 'userName', 'S', userName);
  const entity = convertItemToEntity(item);

  if (null == entity) {
    return false;
  }

  const deleteItems = getDeleteItems(entity);
  const res = await db.transactWriteItems(TableName, deleteItems);

  if (200 == res.$metadata.httpStatusCode) {
    return true;
  } else {
    console.error(`${res.name} \n ${res.message}`);
    return false;
  }
};

/**
 * @param  {} userId
 */
const updateUser = async (userId) => {
  // TODO:impl
  console.log(userId);
};

/**
 *
 * @param  {UserEntity} entity
 * @return {Array<Item>} items
 */
const getPutItems = (entity) => {
  return [
    {
      Put: {
        TableName: TableName,
        Item: {
          pk: { S: `${entity.userId}` },
          userName: { S: `${entity.userName}` },
          firstName: { S: `${entity.firstName}` },
          lastName: { S: `${entity.lastName}` },
          email: { S: `${entity.email}` },
        },
        ConditionExpression: 'attribute_not_exists(pk)',
      },
    },
    {
      Put: {
        TableName: TableName,
        Item: {
          pk: { S: `userName#${entity.userName}` },
        },
        ConditionExpression: 'attribute_not_exists(pk)',
      },
    },
    {
      Put: {
        TableName: TableName,
        Item: {
          pk: { S: `email#${entity.email}` },
        },
        ConditionExpression: 'attribute_not_exists(pk)',
      },
    },
  ];
};

const getDeleteItems = (entity) => {
  return [
    {
      Delete: {
        TableName: TableName,
        Key: {
          pk: { S: `${entity.userId}` },
        },
      },
    },
    {
      Delete: {
        TableName: TableName,
        Key: {
          pk: { S: `userName#${entity.userName}` },
        },
      },
    },
    {
      Delete: {
        TableName: TableName,
        Key: {
          pk: { S: `email#${entity.email}` },
        },
      },
    },
  ];
};

/**
 * @param  {Item} item
 * @return {UserEntity}
 */
const convertItemToEntity = (item) => {
  if (null == item) {
    return null;
  }
  return new UserEntity(item.pk, item.userName, item.firstName, item.lastName, item.email);
};

module.exports = {
  createUser: createUser,
  getUserById: getUserById,
  getUserByName: getUserByName,
  getAllUser: getAllUser,
  deleteUserById: deleteUserById,
  deleteUserByName: deleteUserByName,
  updateUser: updateUser,
};
