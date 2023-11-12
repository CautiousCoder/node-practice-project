/* eslint-disable operator-linebreak */
/* eslint-disable quotes */
/*
 * Title: Notifications
 *Description: Notification and send notification
 *Author : MD. ZAHIDUL ISLAM
 *Description:  09/11/2023
 */

// dependency
const https = require("https");
const querystring = require("querystring");
const { twilio } = require("./environment");

// app scaffolding
const notifications = {};

// send a message with twilio
notifications.sendMsgTwilio = (toNumber, message, callback) => {
  const phone =
    typeof toNumber === "string" && toNumber.trim().length === 11
      ? toNumber.trim()
      : false;
  const msg =
    typeof message === "string" &&
    message.trim().length > 0 &&
    message.trim().length <= 1600
      ? message.trim()
      : false;

  if (phone && msg) {
    // configure the message payload
    const payload = {
      From: twilio.fromNumber,
      To: `+88${phone}`,
      Body: msg,
    };
    // stringfy message payload
    const payloadString = querystring.stringify(payload);

    // configure the request object
    const requestDetails = {
      hostname: "api.twilio.com",
      methoe: "POST",
      path: `/2010-04-01/Accounts/${twilio.sid}/Messages.json`,
      auth: `${twilio.sid}:${twilio.authToken}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    // instanciate the request object
    const req = https.request(requestDetails, (res) => {
      const status = res.statusCode;
      // check the throwing status
      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback(`Status code return was ${status}`);
      }
    });

    // find any request error
    req.on("error", (e) => {
      callback(`Requiest Error ${e}`);
    });

    req.write(payloadString);
    req.end();
  } else {
    callback("Invalid Message or Phone Number.");
  }
};

module.exports = notifications;
