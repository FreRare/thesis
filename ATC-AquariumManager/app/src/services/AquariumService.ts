import Aquarium from "../models/Aquarium";
import strings from "../../config/strings";

export default class AquariumService {
  /**
   * Gets all the aquariums from the db for the user with the provided email
   * @param userEmail The active user's email address
   */
  static async getAquariums(
    userEmail: string
  ): Promise<Array<Aquarium> | string> {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({
      email: userEmail,
    });

    return fetch(strings.getAquariumsApiUrl, {
      method: "POST",
      headers: headers,
      body: body,
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
          const aquariumsArrayData = data;
          const aquariumsArray = [];
          for (const aq of aquariumsArrayData) {
            const parsedData = JSON.parse(aq);
            const aquariumData = parsedData["aquarium"];
            const aquarium = new Aquarium(
              aquariumData["id"],
              aquariumData["name"],
              aquariumData["length"],
              aquariumData["height"],
              aquariumData["width"],
              aquariumData["fishCount"]
            );
            aquariumsArray.push(aquarium);
          }
          return aquariumsArray;
        }
      })
      .catch((e) => {
        alert("Error: " + e);
      });
  }
  /**
   * Tries to update the provided aquarium in the database
   * If there is a problem returns the error as string
   * @param aq the aquarium
   */
  static async updateAquarium(aq: Aquarium): Promise<string> {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({
      id: aq.id,
      name: aq.name,
      length: aq.length,
      height: aq.height,
      width: aq.width,
      fishCount: aq.fishCount,
    });

    return fetch(strings.updateAquariumApiUrl, {
      method: "POST",
      headers: headers,
      body: body,
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
        }
        if (data["result"]) {
          return "";
        }
      })
      .catch((e) => {
        alert("Error: " + e);
      });
  }

  /**
   * Creates an aquarium in the db (Actually just updates and adds connection)
   * @param aq The aquarium the user wants to add
   * @param userEmail The user's email
   */
  static async createAquarium(
    aq: Aquarium,
    userEmail: string
  ): Promise<string> {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({
      id: aq.id,
      name: aq.name,
      length: aq.length,
      height: aq.height,
      width: aq.width,
      fishCount: aq.fishCount,
      email: userEmail,
    });

    return fetch(strings.updateAquariumApiUrl, {
      method: "POST",
      headers: headers,
      body: body,
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
        }
        if (data["result"]) {
          return "";
        }
      })
      .catch((e) => {
        alert("Error: " + e);
      });
  }

  static async deleteAquarium(aq: Aquarium): Promise<string>{
    // TODO fetch delete APIp
  }
}
