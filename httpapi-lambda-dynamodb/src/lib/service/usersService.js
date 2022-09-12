const UserEntity = require('../entity/userEntity');
const repo = require('../repository/usersRepository');

module.exports = class UserService {
  /**
   * @param  {UserForm} userForm
   * @return {Object}
   */
  async create(userForm) {
    const entity = UserEntity.of(userForm);
    return await repo.createUser(entity);
  }

  // TODO: impl
  // getUserById(id) {}

  // getUserByName(name) {}

  // getAllUser() {}

  // deleteUserById(id) {}

  // deleteUserByName() {}

  // updateUser() {}

  // createUserId() {}
};
