module.exports = class UserForm {
  /**
   * @param  {String} userName
   * @param  {String} firstName
   * @param  {String} lastName
   * @param  {String} email
   */
  constructor(userName, firstName, lastName, email) {
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
};
