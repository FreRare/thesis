export default interface UserInterface {
  email: String;
  firstName: string;
  lastName: string;
  getName(): string;
  getFirstName(): string;
  getLastName(): string;
  getEmail(): string;
  toString(): string;
}
