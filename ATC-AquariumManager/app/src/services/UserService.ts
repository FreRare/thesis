import strings from "../../config/strings";
import User from "../models/User";
import CommonServiceCallback from "./commonServiceCallbacks";
import { sha256 } from "js-sha256";

export class UserService {
  /**
   * Updates the provided user with the provided old email address
   * @param oldMail
   * @param updatedUser
   * @returns The promise what returns the result string
   * @async
   */
  static updateData = async (
    oldMail: string,
    updatedUser: User
  ): Promise<string> => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const data = JSON.stringify({
      email: oldMail,
      newMail: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
    });

    return fetch(strings.PATHS.updateUserApiUrl, {
      method: "POST",
      headers: headers,
      body: data,
    })
      .then(CommonServiceCallback.fetchResponseCallback)
      .then((responseData) => {
        const data = responseData["data"];
        if (data["error"]) {
          return data["error"];
        }
        if (data["result"]) {
          return data["result"];
        }
        return "No response data!";
      })
      .catch(CommonServiceCallback.catchCallback);
  };

  static changePassword = async (
    email: string,
    oldPass: string,
    newPass: string
  ): Promise<string> => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const data = JSON.stringify({
      email: email,
      oldPass: sha256(oldPass),
      newPass: sha256(newPass),
    });
    return fetch(strings.PATHS.changePasswordApiUrl, {
      method: "POST",
      headers: headers,
      body: data,
    })
      .then(CommonServiceCallback.fetchResponseCallback)
      .then((responseData) => {
        const data = responseData["data"];
        if (data["error"]) {
          return data["error"];
        }
        if (data["result"]) {
          return data["result"];
        }
        return "No response data!";
      })
      .catch(CommonServiceCallback.catchCallback);
  };
}
