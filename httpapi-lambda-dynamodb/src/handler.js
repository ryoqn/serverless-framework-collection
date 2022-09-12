'use strict';

const UserForm = require('./lib/form/userForm');
const UserService = require('./lib/service/usersService');

/**
 * ユーザー追加ハンドラ
 * @param  {} event
 */
module.exports.create = async (event) => {
  try {
    const body = JSON.parse(event['body']);
    const name = body.name;
    const firstName = body.first_name;
    const lastName = body.last_name;
    const email = body.email;

    const service = new UserService();
    const form = new UserForm(name, firstName, lastName, email);
    const ret = await service.create(form);
    if (ret) {
      return {
        statusCode: 201,
      };
    } else {
      return {
        statusCode: 500,
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
    };
  }
};

/**
 * ユーザー取得ハンドラ
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
 * ユーザー更新ハンドラ
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
 * ユーザー削除ハンドラ
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
