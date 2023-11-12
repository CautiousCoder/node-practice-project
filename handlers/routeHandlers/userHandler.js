/* eslint-disable operator-linebreak */
/* eslint-disable quotes */
/*
 * Title: User Handler
 *Description: Handler to handle User Route
 *Author : MD. ZAHIDUL ISLAM
 *Description:  23/10/2023
 */

// dependencis
const data = require("../../lib/data");
const { hash, parseJSON } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");

// Sample object - Module Scaffolding
const handler = {};
// handle user request
handler.userHandler = (requestProperties, callback) => {
  // console.log(requestProperties);

  // create an array for user method
  const acceptecMethod = ["get", "post", "put", "delete"];
  if (acceptecMethod.indexOf(requestProperties.method) > -1) {
    handler._user[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      message: "This method is not accept. Please try another method.",
    });
  }
};
handler._user = {};

// write code for post method
handler._user.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;
  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean" &&
    requestProperties.body.tosAgreement === true
      ? requestProperties.body.tosAgreement
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    // make sure that the user doesn't already exists
    data.read("users", phone, (err) => {
      if (err) {
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };
        // store the user to do
        data.create("users", phone, userObject, (err1) => {
          if (!err1) {
            callback(200, { message: "User was created successfully." });
          } else {
            callback(500, { Error: "Could not create user!" });
          }
        });
      } else {
        callback(500, {
          Error:
            "This user is already exists. There was a problem in server side!",
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
handler._user.get = (requestProperties, callback) => {
  // check queryString Phone
  const phone =
    typeof requestProperties.queryString.phone === "string" &&
    requestProperties.queryString.phone.trim().length === 11
      ? requestProperties.queryString.phone
      : false;
  if (phone) {
    // Authentication verify
    const id =
      typeof requestProperties.headerObject.id === "string" &&
      requestProperties.headerObject.id.trim().length === 20
        ? requestProperties.headerObject.id
        : false;
    tokenHandler._token.verify(id, phone, (tokenId) => {
      if (tokenId) {
        // finding the user
        data.read("users", phone, (err1, u) => {
          const user = { ...parseJSON(u) };
          if (!err1 && u) {
            delete user.password;
            callback(200, user);
          } else {
            callback(404, { Error: "404 User not found!" });
          }
        });
      } else {
        callback(403, { Error: "Authentication faliure!" });
      }
    });
  } else {
    callback(404, { Error: "404 User not found!" });
  }
};

// write code for put method
handler._user.put = (requestProperties, callback) => {
  // validate require field
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone) {
    // Authentication verify
    const id =
      typeof requestProperties.headerObject.id === "string" &&
      requestProperties.headerObject.id.trim().length === 20
        ? requestProperties.headerObject.id
        : false;
    tokenHandler._token.verify(id, phone, (tokenId) => {
      if (tokenId) {
        if (firstName || lastName || password) {
          // finding the user
          data.read("users", phone, (err1, userData) => {
            const uData = { ...parseJSON(userData) };
            if (!err1 && userData) {
              if (firstName) {
                uData.firstName = firstName;
              }
              if (lastName) {
                uData.lastName = lastName;
              }
              if (firstName) {
                uData.password = hash(password);
              }

              // update data to the database
              data.update("users", phone, uData, (err2) => {
                if (!err2) {
                  callback(200, { message: "User was updated successfully." });
                } else {
                  callback(500, {
                    Error:
                      "There was a problem in the server side. Please try again!",
                  });
                }
              });
            } else {
              callback(400, {
                Error: "You have a problem in your request. Please try again!",
              });
            }
          });
        } else {
          callback(400, {
            Error: "You have a problem in your request. Please try again!",
          });
        }
      } else {
        callback(403, { Error: "Authentication faliure!" });
      }
    });
  } else {
    callback(400, { Error: "Invalid phone number. Please try again!" });
  }
};

// write code for delete method
handler._user.delete = (requestProperties, callback) => {
  // check queryString Phone
  const phone =
    typeof requestProperties.queryString.phone === "string" &&
    requestProperties.queryString.phone.trim().length === 11
      ? requestProperties.queryString.phone
      : false;

  if (phone) {
    // Authentication verify
    const id =
      typeof requestProperties.headerObject.id === "string" &&
      requestProperties.headerObject.id.trim().length === 20
        ? requestProperties.headerObject.id
        : false;
    tokenHandler._token.verify(id, phone, (tokenId) => {
      if (tokenId) {
        // finding the user
        data.read("users", phone, (err1, userData) => {
          if (!err1 && userData) {
            // delete the user
            data.delete("users", phone, (err2) => {
              if (!err2) {
                callback(200, { message: "User deleted successfully." });
              } else {
                callback(500, {
                  Error: "User couldn't deleted. Please try again!",
                });
              }
            });
          } else {
            callback(500, {
              Error: "There was a problem in server side. Please try again!",
            });
          }
        });
      } else {
        callback(403, { Error: "Authentication faliure!" });
      }
    });
  } else {
    callback(400, {
      Error: "There was a problem in your request. Please try again!",
    });
  }
};

module.exports = handler;
