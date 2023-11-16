import Aquarium from "../models/Aquarium";

export default class AquariumService {
  /**
   * Gets all the aquariums from the db for the user with the provided email
   * @param userEmail The active user's email address
   */
  static getAquariums(userEmail: string) {
    throw new Error("Unimplemented!");
  }
  /**
   * Tries to add the provided aquarium to the database
   * If there is a problem returns the error as strings
   * @param aq the aquarium
   */
  static tryToAddNewAquarium(aq: Aquarium): string {
    return ",";
  }
}
