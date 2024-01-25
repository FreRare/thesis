import strings from "../../config/strings";
import User from "../models/User";
import CommonServiceCallback from "./commonServiceCallbacks";

export class UserService {
  /**
   * Updates the provided user with the provided old email address
   * @param oldMail
   * @param updatedUser
   * @returns
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

  static changePassword = (updatedUser: User) => {};
}