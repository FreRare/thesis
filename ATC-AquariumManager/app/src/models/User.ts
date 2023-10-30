export default class User {
  private _email: string;
  private _authToken: string; // For device saving and auto authorization
  private _firstName: string;
  private _lastName: string;

  constructor(email = "", authToken = "", firstName = "", lastName = "") {
    this._email = email;
    this._authToken = authToken;
    this._firstName = firstName;
    this._lastName = lastName;
  }

  // All fields should be initialized after constructor and no changes should be made
  getName(): string {
    return this._firstName + " " + this._lastName;
  }
  getFirstName(): string {
    return this._firstName;
  }
  getLastName(): string {
    return this._lastName;
  }
  getEmail(): string {
    return this._email;
  }
  getToken(): string{
    return this._authToken;
  }
  toString(): string {
    return (
      "User with the following data: " +
      [this.getFirstName(), this.getLastName(), this.getEmail()].join("::")
    );
  }
}
