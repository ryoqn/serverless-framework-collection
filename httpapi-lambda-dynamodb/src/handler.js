'use strict';

const uuid4 = require('uuid4')
const {putItemAsync} = require('../lib/database')

/**
 * 追加ハンドラ
 * @param  {} event
 */
module.exports.create = async (event) => {
  try {
    const body = JSON.parse(event['body']);
    const first_name = body.first_name;
    const last_name = body.last_name;
    const user_id = uuid4();
    const item = {
      UserId: { S: `${user_id}` },
      FirstName: { S: `${first_name}`},
      LastName: { S: `${last_name}`}
    };
    await putItemAsync(process.env.TABLENAME, item);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'create successed.' }, null, 2),
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'create failed.' }, null, 2),
    }
  }
};

/**
 * 取得ハンドラ
 * @param  {} event
 */
module.exports.get = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'get',
        input: event,
      },
      null,
      2
    ),
  };
};

/**
 * 更新ハンドラ
 * @param  {} event
 */
module.exports.update = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'epdate',
        input: event,
      },
      null,
      2
    ),
  };
};

/**
 * 削除ハンドラ
 * @param  {} event
 */
module.exports.delete = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'delete',
        input: event,
      },
      null,
      2
    ),
  };
};

/**
 * 認証ハンドラ
 * @param  {object} event
 * @return {boolean} true:認証OK false:認証NG
 */
module.exports.authorizer = async (event) => {
  let response = {
    isAuthorized: false,
  };
  const token = event.identitySource[0];
  if (token === 'token') {
    response.isAuthorized = true;
  }
  return response;
};