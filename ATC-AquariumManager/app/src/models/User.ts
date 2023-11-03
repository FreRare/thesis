import Aquarium from "./Aquarium";

export default class User {
  private _email: string;
  private _authToken: string; // For device saving and auto authorization
  private _firstName: string;
  private _lastName: string;
  private _aquariums: Array<Aquarium>;

  constructor(
    email = "",
    authToken = "",
    firstName = "",
    lastName = "",
    aquariums = []
  ) {
    this._email = email;
    this._authToken = authToken;
    this._firstName = firstName;
    this._lastName = lastName;
    this._aquariums = aquariums;
  }

  // All fields should be initialized after constructor and no changes should be made
  public get name(): string {
    return this._firstName + " " + this._lastName;
  }

  toString(): string {
    return (
      "User with the following data: " +
      [this.firstName, this.lastName, this.email].join(" :: ")
    );
  }

  public get email(): string {
    return this._email;
  }
  public set email(value: string) {
    this._email = value;
  }

  public get authToken(): string {
    return this._authToken;
  }

  public get firstName(): string {
    return this._firstName;
  }
  public set firstName(value: string) {
    this._firstName = value;
  }

  public get lastName(): string {
    return this._lastName;
  }
  public set lastName(value: string) {
    this._lastName = value;
  }

  public get aquariums(): Array<Aquarium> {
    return this._aquariums;
  }
  public set aquariums(value: Array<Aquarium>) {
    this._aquariums = value;
  }
}
