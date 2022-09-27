const db = require('../database');
const crypto = require('crypto');
const UserEntity = require('../entity/userEntity');

const TableName = 'users';
const PrimaryKey = 'pk';
const IndexName = 'username-index';

/**
 * ユーザー作成
 * @param  {UserEntity} entity
 */
const createUser = async (entity) => {
  entity.userId = crypto.randomUUID();
  const items = getPutItems(entity);
  const res = await db.transactWriteItems(TableName, items);
  if (200 == res.$metadata.httpStatusCode) {
    return true;
  } else {
    console.error(`${res.name} \n ${res.message}`);
    return false;
  }
};

/**
 * ユーザー取得（ID指定）
 * @param  {string} userId
 * @return {UserEntity} UserEntity(null: if not found, not null: found)
 */
const getUserById = async (userId) => {
  const item = await db.getItemByPrimaryKeyAsync(TableName, PrimaryKey, 'S', userId);
  return convertItemToEntity(item);
};

/**
 * ユーザー取得（ユーザー名指定）
 * @param  {string} userName
 * @param  {UserEntity}
 */
const getUserByName = async (userName) => {
  const item = await db.getItemByGSIAsync(TableName, IndexName, 'userName', 'S', userName);
  return convertItemToEntity(item);
};

/**
 * ユーザー削除（ID指定）
 * @param  {string} userId
 * @return {boolean} true: success,  false: fail
 */
const deleteUserById = async (userId) => {
  const item = await db.getItemByPrimaryKeyAsync(TableName, PrimaryKey, 'S', userId);
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
 * ユーザー削除（ユーザー名指定）
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
 * ユーザー更新（ユーザー名指定）
 * @param  {string} userName
 * @param  {userForm} form
 * @return {boolean} true: success, false: fail
 */
const updateUserByName = async (userName, form) => {
  const entity = await getUserByName(userName);
  if (null == entity) {
    return false;
  }
  entity.firstName = form.firstName;
  entity.lastName = form.lastName;
  const updateItem = getPutItems(entity);

  const res = await db.updateItemAsync(TableName, updateItem);
  if (200 == res.$metadata.httpStatusCode) {
    return true;
  } else {
    console.error(`${res.name} \n ${res.message}`);
    return false;
  }
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
  deleteUserById: deleteUserById,
  deleteUserByName: deleteUserByName,
  updateUserByName: updateUserByName,
};
