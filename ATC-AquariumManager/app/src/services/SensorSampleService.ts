import strings from "../../config/strings";
import SensorSample from "../models/SensorSample";
import CommonServiceCallback from "./commonServiceCallbacks";

class SensorSampleService {
  /**
   * Gets the samples for the home page or the stats page
   * Depending on the param forHome
   * @param id - The id of the aquarium
   * @param forHome - The flag if it is for the home page or no
   * @returns - The array of samples (if it goes for home it only has 1 element)
   */
  static async getSamples(
    id: number,
    forHome?: boolean
  ): Promise<Array<SensorSample> | string> {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({
      id: id,
      forHome: forHome,
    });

    return fetch(strings.PATHS.getSensorSamplesApiUrl, {
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
        const sampleData = data;
        const samples = [];
        for (const dat of sampleData) {
          const parsedData = JSON.parse(dat);
          const parsedSample = parsedData["sample"];
          const newSample = new SensorSample(
            new Date(parsedSample["sampleTime"]["date"] as string),
            parsedSample["temp"],
            parsedSample["ph"],
            parsedSample["water"],
            parsedSample["light"]
          );
          samples.push(newSample);
        }
        return samples;
      })
      .catch(CommonServiceCallback.catchCallback);
  }
}

export default SensorSampleService;
