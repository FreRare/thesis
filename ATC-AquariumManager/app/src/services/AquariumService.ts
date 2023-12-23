import Aquarium from "../models/Aquarium";
import strings from "../../config/strings";
import AquariumConfiguration from "../models/AquariumConfiguration";
import CommonServiceCallback from "./commonServiceCallbacks";

export default class AquariumService {
  /**
   * Gets all the aquariums from the db for the user with the provided email
   * Also gets the configs for it
   * @param userEmail The active user's email address
   */
  static async getAquariums(userEmail: string): Promise<Array<Aquarium>> {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({
      email: userEmail,
    });

    const aquariums = await fetch(strings.PATHS.getAquariumsApiUrl, {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then(CommonServiceCallback.fetchResponseCallback)
      .then((responseData) => {
        const data = responseData["data"];
        if (data["error"]) {
          alert(data["error"]);
          return [];
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
      .catch(CommonServiceCallback.catchCallback);

    if (typeof aquariums === "string") {
      return [];
    }

    // Get the config for each aquarium
    for (const aq of aquariums) {
      const configBody = JSON.stringify({
        id: aq.id,
        phone: true,
      });
      const configForAq = await fetch(strings.PATHS.getAquariumConfigApiUrl, {
        method: "POST",
        headers: headers,
        body: configBody,
      })
        .then(CommonServiceCallback.fetchResponseCallback)
        .then((responseData) => {
          const data = responseData["data"];
          if (data["errror"]) {
            return data["error"];
          }
          const configData = data["config"]; // get data and make object
          return new AquariumConfiguration(
            aq.id,
            configData["minTemp"],
            configData["maxTemp"],
            configData["minPh"],
            configData["maxPh"],
            configData["ol1On"],
            configData["ol1Off"],
            configData["ol2On"],
            configData["ol2Off"],
            configData["ol3On"],
            configData["ol3Off"],
            configData["feedingTime"],
            configData["foodPortions"],
            configData["filterClean"],
            configData["waterChange"],
            configData["samplePeriod"],
            new Date(configData["lastModifiedDate"]["date"] as string)
          );
        })
        .catch(CommonServiceCallback.catchCallback);
      if (typeof configForAq === "string") {
        aq.config = new AquariumConfiguration();
      }
      // Otherwise assign config for the aquarium
      aq.config = configForAq;
    }
    return aquariums;
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

    return fetch(strings.PATHS.updateAquariumApiUrl, {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then(CommonServiceCallback.fetchResponseCallback)
      .then((responseData) => {
        const data = responseData["data"];
        if (data["error"]) {
          return data["error"];
        }
        if (data["result"]) {
          return "";
        }
      })
      .catch(CommonServiceCallback.catchCallback);
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

    return fetch(strings.PATHS.updateAquariumApiUrl, {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then(CommonServiceCallback.fetchResponseCallback)
      .then((responseData) => {
        const data = responseData["data"];
        if (data["error"]) {
          return data["error"];
        }
        if (data["result"]) {
          return "";
        }
      })
      .catch(CommonServiceCallback.catchCallback);
  }

  /**
   * Deletes the provided aquarium
   * @param aq The aquarium to remove
   * @returns "" on success error as string otherwise
   */
  static async deleteAquarium(aq: Aquarium): Promise<string> {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({
      id: aq.id,
    });
    return fetch(strings.PATHS.deleteAquariumApiUrl, {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then(CommonServiceCallback.fetchResponseCallback)
      .then((responseData) => {
        const data = responseData["data"];
        if (data["error"]) {
          return data["error"];
        }
        if (data["result"]) {
          return "";
        }
      })
      .catch(CommonServiceCallback.catchCallback);
  }

  /**
   * Updates the provided aquarium's config in the DB
   * @param aq The aquarium which's config we're updating
   * @returns - the result of the service
   */
  static async updateConfiguration(
    config: AquariumConfiguration,
    id: number
  ): Promise<string> {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({
      id: id,
      minTemp: config.minTemp,
      maxTemp: config.maxTemp,
      minPh: config.minPh,
      maxPh: config.maxPh,
      OL1On: config.OnOutlet1,
      OL1Off: config.OffOutlet1,
      OL2On: config.OnOutlet2,
      OL2Off: config.OffOutlet2,
      OL3On: config.OnOutlet3,
      OL3Off: config.OffOutlet3,
      feedingTime: config.feedingTime,
      foodPortions: config.foodPortions,
      filterClean: config.filterClean,
      waterChange: config.waterChange,
      samplePeriod: config.samplePeriod,
    });

    return fetch(strings.PATHS.updateConfigApiUrl, {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then(CommonServiceCallback.fetchResponseCallback)
      .then((responseData) => {
        const data = responseData["data"];
        if (data["error"]) {
          return data["error"];
        }
        if (data["result"]) {
          return "";
        }
        return "Something went really wrong!";
      })
      .catch(CommonServiceCallback.catchCallback);
  }
}
