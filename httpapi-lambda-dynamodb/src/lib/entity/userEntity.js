module.exports = class UserEntity {
  /**
   * @param  {String} userId
   * @param  {String} userName
   * @param  {String} firstName
   * @param  {String} lastName
   * @param  {String} email
   */
  constructor(userId, userName, firstName, lastName, email) {
    this.userId = userId;
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  /**
   * @param  {UserForm} form
   */
  static of(form) {
    return new this('', form.userName, form.firstName, form.lastName, form.email);
  }
};
