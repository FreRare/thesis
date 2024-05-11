import strings from "../../config/strings";
import User from "../models/User";
import CommonServiceCallback from "./commonServiceCallbacks";
import { sha256 } from "js-sha256";

export default class AuthService {
  /**
   *  Tries to log in the user with given credentials
   * @param email user's email address
   * @param password user's password
   * @returns The fetch promise, use await to get User object or error message
   */
  static async tryLogin(
    email: string,
    password: string,
    token?: string
  ): Promise<User | string> {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const loginData = JSON.stringify({
      email: email,
      password: sha256(password),
      token: token,
    });
    return fetch(strings.PATHS.loginApiUrl, {
      method: "POST",
      headers: headers,
      body: loginData,
    })
      .then(CommonServiceCallback.fetchResponseCallback)
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
          // alert(user.toString());
          return user;
        }
      })
      .catch(CommonServiceCallback.catchCallback);
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
    return fetch(strings.PATHS.tokenLoginApiUrl, {
      headers: headers,
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(CommonServiceCallback.fetchResponseCallback)
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
          // alert(user.toString());
          return user;
        }
      })
      .catch(CommonServiceCallback.catchCallback);
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
      password: sha256(password),
      first_name: firstName,
      last_name: lastName,
      aquarium_id: aquariumID,
      device_token: deviceToken,
    });
    return fetch(strings.PATHS.registrationApiUrl, {
      method: "POST",
      headers: headers,
      body: content,
    })
      .then(CommonServiceCallback.fetchResponseCallback)
      .then((responseData) => {
        const data = responseData["data"];
        if (data["error"]) {
          return data["error"];
        } else {
          const userData = JSON.parse(data)["user"];
          const newUser = new User(
            userData["email"],
            userData["token"],
            userData["first_name"],
            userData["last_name"]
          );
          alert(newUser.toString());
          return newUser;
        }
      })
      .catch(CommonServiceCallback.catchCallback);
  }

  /**
   * Deletes the user with the given email address (sets it to inactive)
   * @param email - The email addresss of the user
   */
  static async deleteUser(email: string): Promise<string> {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const content = JSON.stringify({
      email: email,
    });
    return fetch(strings.PATHS.deleteUserApiUrl, {
      headers: headers,
      body: content,
      method: "POST",
    })
      .then((response) => response.json())
      .then((responseData) => {
        const data = responseData["data"];
        if (data["error"]) {
          return data["error"];
        } else if (data["success"]) {
          return "";
        }
      });
  }
}
