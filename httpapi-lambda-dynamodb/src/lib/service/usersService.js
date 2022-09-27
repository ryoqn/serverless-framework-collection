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

  /**
   * @param  {string} id
   * @return {UserEntity} entity
   */
  async getUserById(userId) {
    return await repo.getUserById(userId);
  }

  /**
   * @param  {string} userName
   * @return {UserEntity} entity
   */
  async getUserByName(userName) {
    return await repo.getUserByName(userName);
  }

  /**
   * @param  {string} userId
   * @return {boolean} true: success, false: fail
   */
  async deleteUserById(userId) {
    return await repo.deleteUserById(userId);
  }

  /**
   * @param  {string} userId
   * @return {boolean} true: success, false: fail
   */
  async deleteUserByName(userName) {
    return await repo.deleteUserByName(userName);
  }

  /**
   * update userEntity with UserForm
   * @param  {UserForm} userForm
   * @return {boolean} true: success, false: fail
   */
  async updateUser(userForm) {
    return await repo.updateUserByName(userForm.userName);
  }
};
