const config = require("config");

class ResponseObject {
  constructor() {}

  static getResponseJson(responseData, errorMsg, page) {
    let responseJson = {};
    if (errorMsg) {
      responseJson['count'] = 0;
      responseJson['nextPage'] = '';
      responseJson['error'] = true;
      responseJson['errorMessage'] = errorMsg;
      responseJson['movies'] = [];
    } else if (responseData) {
      responseJson['count'] = responseData.length;
      responseJson['nextPage'] = responseData.length < config.get("api.pageSize") ? '' : ++page;
      responseJson['error'] = false;
      responseJson['errorMessage'] = '';
      responseJson['movies'] = [...responseData];
    } else {
      responseJson['count'] = 0;
      responseJson['nextPage'] = '';
      responseJson['error'] = true;
      responseJson['errorMessage'] = "Error in response";
      responseJson['movies'] = [];
    }

    return responseJson;
  }
}


module.exports = ResponseObject;
