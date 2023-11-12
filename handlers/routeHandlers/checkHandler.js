/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable operator-linebreak */
/*
 * Title: Checks Handler
 *Description: Handler to handle User checks link
 *Author : MD. ZAHIDUL ISLAM
 *Description:  24/10/2023
 */

// dependencis
const data = require("../../lib/data");
const { parseJSON, createRandomString } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");
const { maxCheck } = require("../../helpers/environment");

// Sample object - Module Scaffolding
const handler = {};
// handle user request
handler.checkHandler = (requestProperties, callback) => {
  // console.log(requestProperties);

  // create an array for user method
  const acceptecMethod = ["get", "post", "put", "delete"];
  if (acceptecMethod.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      message: "This method is not accept. Please try another method.",
    });
  }
};
handler._check = {};

// write code for post method
handler._check.post = (requestProperties, callback) => {
  // validate inputs
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;
  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;
  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;
  const successCode =
    typeof requestProperties.body.successCode === "object" &&
    requestProperties.body.successCode instanceof Array
      ? requestProperties.body.successCode
      : false;
  const timeOutSecond =
    typeof requestProperties.body.timeOutSecond === "number" &&
    requestProperties.body.timeOutSecond % 1 === 0 &&
    requestProperties.body.timeOutSecond > 0 &&
    requestProperties.body.timeOutSecond <= 5
      ? requestProperties.body.timeOutSecond
      : 5;
  if (protocol && url && method && successCode && timeOutSecond) {
    // Authentication verify
    const token =
      typeof requestProperties.headerObject.id === "string" &&
      requestProperties.headerObject.id.trim().length === 20
        ? requestProperties.headerObject.id
        : false;
    // find phone Number by the token
    data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        const userPhone = parseJSON(tokenData).phone;
        // user authenticate or not
        tokenHandler._token.verify(token, userPhone, (tokenId) => {
          if (tokenId) {
            // find user by the phone number
            data.read("users", userPhone, (err1, userData) => {
              if (!err1 && userData) {
                const userObject = parseJSON(userData);
                const checks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (checks.length < maxCheck) {
                  const id = createRandomString(20);
                  const checkObject = {
                    id,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCode,
                    timeOutSecond,
                  };
                  // store the user to do
                  data.create("checks", id, checkObject, (err2) => {
                    if (!err2) {
                      // add check id to the userObject
                      userObject.checks = checks;
                      userObject.checks.push(id);
                      // update the user object
                      data.update("users", userPhone, userObject, (err3) => {
                        if (!err3) {
                          callback(200, {
                            message: "Check was created successfully.",
                          });
                        } else {
                          callback(500, {
                            Error: "There was a problem in server side!",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        Error: "There was a problem in server side.",
                      });
                    }
                  });
                } else {
                  callback(401, {
                    Error: "You have already reached maximum limits.",
                  });
                }
              } else {
                callback(500, {
                  Error: "There was a problem in server side",
                });
              }
            });
          } else {
            callback(403, { Error: "Authentication faliure!" });
          }
        });
      } else {
        callback(500, {
          Error: "There was a problem in server side!",
        });
      }
    });
  } else {
    callback(400, {
      Error: "You have a problem in your request.",
    });
  }
};

// write code for get method
handler._check.get = (requestProperties, callback) => {
  // check queryString Phone
  const checkID =
    typeof requestProperties.queryString.id === "string" &&
    requestProperties.queryString.id.trim().length === 20
      ? requestProperties.queryString.id
      : false;
  if (checkID) {
    // get check
    data.read("checks", checkID, (err, cData) => {
      if (!err && cData) {
        // Authentication verify
        const tokenID =
          typeof requestProperties.headerObject.id === "string" &&
          requestProperties.headerObject.id.trim().length === 20
            ? requestProperties.headerObject.id
            : false;
        const checkData = parseJSON(cData);
        tokenHandler._token.verify(tokenID, checkData.userPhone, (tokenId) => {
          if (tokenId) {
            callback(200, checkData);
          } else {
            callback(500, { Error: "Authentication faliure!" });
          }
          // eslint-disable-next-line comma-dangle
        });
      } else {
        callback(403, { Error: "There was a problem in server side." });
      }
    });
  } else {
    callback(404, { Error: "There was a problem in server side." });
  }
};

// write code for put method
handler._check.put = (requestProperties, callback) => {
  // validate require field
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length > 0
      ? requestProperties.body.id
      : false;
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;
  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;
  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;
  const successCode =
    typeof requestProperties.body.successCode === "object" &&
    requestProperties.body.successCode instanceof Array
      ? requestProperties.body.successCode
      : false;
  const timeOutSecond =
    typeof requestProperties.body.timeOutSecond === "number" &&
    requestProperties.body.timeOutSecond % 1 === 0 &&
    requestProperties.body.timeOutSecond > 0 &&
    requestProperties.body.timeOutSecond <= 5
      ? requestProperties.body.timeOutSecond
      : 5;

  if (id) {
    if (protocol || url || method || successCode || timeOutSecond) {
      data.read("checks", id, (err, cData) => {
        if (!err && cData) {
          const checkData = parseJSON(cData);
          // Authentication verify
          const tokenId =
            typeof requestProperties.headerObject.id === "string" &&
            requestProperties.headerObject.id.trim().length === 20
              ? requestProperties.headerObject.id
              : false;
          tokenHandler._token.verify(tokenId, checkData.userPhone, (token) => {
            if (token) {
              if (protocol) {
                checkData.protocol = protocol;
              }
              if (url) {
                checkData.url = url;
              }
              if (method) {
                checkData.method = method;
              }
              if (successCode) {
                checkData.successCode = successCode;
              }
              if (timeOutSecond) {
                checkData.timeOutSecond = timeOutSecond;
              }

              // update check
              data.update("checks", id, checkData, (err1) => {
                if (!err1) {
                  callback(200, { message: "Check updated successfully." });
                } else {
                  callback(500, {
                    Error: "There was a problem in server side.",
                  });
                }
              });
            } else {
              callback(403, { Error: "Authentication faliure!" });
            }
          });
        } else {
          callback(500, { Error: "There was a problem in server side." });
        }
      });
    } else {
      callback(400, { Error: "Invalid your request. Please try again!" });
    }
  } else {
    callback(400, { Error: "Invalid your request. Please try again!" });
  }
};

// write code for delete method
handler._check.delete = (requestProperties, callback) => {
  // check queryString Phone
  const checkId =
    typeof requestProperties.queryString.id === "string" &&
    requestProperties.queryString.id.trim().length === 20
      ? requestProperties.queryString.id
      : false;

  if (checkId) {
    data.read("checks", checkId, (err, cData) => {
      const checkData = parseJSON(cData);
      if (!err && cData) {
        // Authentication verify
        const id =
          typeof requestProperties.headerObject.id === "string" &&
          requestProperties.headerObject.id.trim().length === 20
            ? requestProperties.headerObject.id
            : false;
        tokenHandler._token.verify(id, checkData.userPhone, (token) => {
          if (token) {
            // delete the token data
            data.delete("checks", checkId, (err1) => {
              if (!err1) {
                // finding the user
                data.read("users", checkData.userPhone, (err2, uData) => {
                  const userData = parseJSON(uData);
                  if (!err2 && uData) {
                    const userCheck =
                      typeof userData.checks === "object" &&
                      userData.checks instanceof Array
                        ? userData.checks
                        : [];
                    // remove the deleted check id from the user checks list
                    const checkPosition = userCheck.indexOf(checkId);
                    if (checkPosition > -1) {
                      userCheck.splice(checkPosition, 1);
                      // save and update user data
                      userData.checks = userCheck;
                      data.update("users", userData.phone, userData, (err3) => {
                        if (!err3) {
                          callback(200, {
                            message: "Check deleted successfulllly.",
                          });
                        } else {
                          callback(500, {
                            Error: "There was a problem in server side.",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        Error: "There was a problem in server side.!",
                      });
                    }
                  } else {
                    callback(500, {
                      Error: "There was a problem in server side..",
                    });
                  }
                });
              } else {
                callback(500, {
                  Error: "There was a problem in server side!",
                });
              }
            });
          } else {
            callback(403, { Error: "Authentication faliure!" });
          }
        });
      } else {
        callback(500, {
          Error: "There was a problem in server side!!",
        });
      }
    });
  } else {
    callback(400, {
      Error: "There was a problem in your request. Please try again!",
    });
  }
};

module.exports = handler;
