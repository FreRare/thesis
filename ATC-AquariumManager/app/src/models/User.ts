import UserInterface from "./UserInterface";

export default class User implements UserInterface {
  email: String;
  firstName: string;
  lastName: string;

  constructor(email = "", firstName = "", lastName = "") {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // All fields should be initialized after constructor and no changes should be made
  getName(): string {
    throw new Error("Method not implemented.");
  }
  getFirstName(): string {
    throw new Error("Method not implemented.");
  }
  getLastName(): string {
    throw new Error("Method not implemented.");
  }
  getEmail(): string {
    throw new Error("Method not implemented.");
  }
  toString(): string {
    return (
      "User with the following data: " +
      [this.firstName, this.lastName, this.email].join("::")
    );
  }
}
