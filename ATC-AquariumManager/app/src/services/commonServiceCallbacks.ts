import strings from "../../config/strings";

class CommonServiceCallback {
  /**
   * Callback for fetch catch branch, should be the same everywhere
   * Can be used to give custom error messages to different errors
   * @param e - the error caught
   */
  static catchCallback = (e: Error) => {
    if (e.message === strings.SERVICES.networkErrorDetect) {
      alert(strings.SERVICES.networkErrorMessage);
    } else {
      alert("Error: " + e.message);
    }
    return []
  };

  /**
   * Callback for fetch response handling, checks if response if OK and turns it to json
   * @param response - the response given by the server
   * @returns
   */
  static fetchResponseCallback = (response: any) => {
    if (!response.ok) {
      throw new Error(strings.unexpectedStatusErrorMessage + response.status);
    } else {
      return response.json();
    }
  };
}

export default CommonServiceCallback;
