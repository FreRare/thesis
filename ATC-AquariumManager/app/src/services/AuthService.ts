import strings from "../../config/strings";
import User from "../models/User";

export default class AuthService {
  /**
   *  Tries to log in the user with given credentials
   * @param email user's email address
   * @param password user's password
   * @returns The fetch promise, use await to get User object or error message
   */
  static async tryLogin(
    email: string,
    password: string
  ): Promise<User | string> {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const loginData = JSON.stringify({
      email: email,
      password: password,
    });
    return fetch(strings.loginApiUrl, {
      method: "POST",
      headers: headers,
      body: loginData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            strings.unexpectedStatusErrorMessage + response.status
          );
        } else {
          return response.json();
        }
      })
      .then((responseData) => {
        const data = responseData["data"];
        // alert(JSON.stringify(data))
        if (data["error"]) {
          return data["error"];
        } else {
          const parsedData = JSON.parse(data); // ! need to parse again bc on backend it was encoded twice
          const userData = parsedData["user"];
          const user = new User(
            userData["email"],
            userData["token"],
            userData["first_name"],
            userData["last_name"]
          );
          alert(user.toString());
          return user;
        }
      })
      .catch((e) => {
        alert("Error: " + e);
      });
  }
  /**
   * Tries to login with the stored token (only saved token)
   * @param token The saved token on the device
   * @returns
   */
  static async tryLoginWithToken(token: string): Promise<User | string> {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const data = {
      token: token,
    };
    return fetch(strings.tokenLoginApiUrl, {
      headers: headers,
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            strings.unexpectedStatusErrorMessage + response.status
          );
        } else {
          return response.json();
        }
      })
      .then((responseData) => {
        const data = responseData["data"];
        if (data["error"]) {
          return data["error"];
        } else {
          const parsedData = JSON.parse(data); // ! need to parse again bc on backend it was encoded twice
          const userData = parsedData["user"];
          const user = new User(
            userData["email"],
            userData["token"],
            userData["first_name"],
            userData["last_name"]
          );
          alert(user.toString());
          return user;
        }
      });
  }
  /**
   * Tries to sign up the user with the given data
   * @param email
   * @param firstName
   * @param lastName
   * @param password
   * @param aquariumID
   * @param deviceToken
   * @returns The User object on success, error message orherwise
   */
  static async signUpUser(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    aquariumID: Number,
    deviceToken: string
  ): Promise<User | string> {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const content = JSON.stringify({
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
      aquarium_id: aquariumID,
      device_token: deviceToken,
    });
    return fetch(strings.registrationApiUrl, {
      method: "POST",
      headers: headers,
      body: content,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            strings.unexpectedStatusErrorMessage + response.status
          );
        } else {
          return response.json();
        }
      })
      .then((responseData) => {
        const data = responseData["data"];
        if (data["error"]) {
          return data["error"];
        } else if (data["user"]) {
          const userData = data["user"];
          const newUser = new User(
            userData.email,
            userData.firstName,
            userData.lastName
          );
          alert(newUser.toString());
          return newUser;
        }
      })
      .catch((e) => {
        alert("ERROR while signing up: " + e);
      });
  }
}
