/*
 * Title: Utilities
 *Description: All utilities functions stay here
 *Author : MD. ZAHIDUL ISLAM
 *Date:  23/10/2023
 */

// Dependencies
const crypto = require("crypto");
const environment = require("./environment");

// module scaffolding
const utilities = {};

// parse json string to object
utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch (error) {
    output = {};
  }
  return output;
};

// hash string
utilities.hash = (str) => {
  if (typeof (str === "string") && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", environment.secretKey)
      .update(str)
      .digest("hex");
    return hash;
  }
  return false;
};

// Create random string
utilities.createRandomString = (strLength) => {
  const len =
    typeof strLength === "number" && strLength > 0 ? strLength : false;
  if (len) {
    const posibleCharacter = "abcdefghijklmnopqrstuvwxyz1234567890";
    let output = "";
    for (let i = 0; i < len; i += 1) {
      const posibleNumber = Math.floor(Math.random() * posibleCharacter.length);
      const randomCharacter = posibleCharacter.charAt(posibleNumber);
      output += randomCharacter;
    }
    return output;
  }
  return false;
};
module.exports = utilities;
