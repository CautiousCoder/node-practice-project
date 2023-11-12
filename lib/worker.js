/*
 * Title: Workers
 *Description: Work in this project
 *Author : MD. ZAHIDUL ISLAM
 *Description:  11/11/2023
 */

// Denpendencis
const http = require("http");
const https = require("https");
const url = require("url");
const data = require("./data");
const { parseJSON } = require("../helpers/utilities");
const { sendMsgTwilio } = require("../helpers/notification");

// Worker Object - Mudule scaffolding
const worker = {};

// lookup all the checks
worker.gatherAllChecks = () => {
  // get all the checks
  data.list("checks", (err, checks) => {
    if (!err && checks && checks.length > 0) {
      checks.forEach((check) => {
        // check the individual check data
        data.read("checks", check, (err1, originalCheckData) => {
          if (!err1 && originalCheckData) {
            // call this function for valided check data
            worker.validateCheckData(parseJSON(originalCheckData));
          } else {
            console.log("Error: Reading one of the checks data.");
          }
        });
      });
    } else {
      console.log("Error: Could not find any checks data to the process.");
    }
  });
};

// validate checks data
worker.validateCheckData = (originalCheckData) => {
  const originalData = originalCheckData;
  originalData.status =
    typeof originalCheckData.status === "string" &&
    ["up", "down"].indexOf(originalCheckData.status) > -1
      ? originalCheckData.status
      : "down";

  originalData.lastChecked =
    typeof originalCheckData.lastChecked === "number" &&
    originalCheckData.lastChecked > 0
      ? originalCheckData.lastChecked
      : false;

  // pass to the next process
  worker.performChecks(originalData);
};

// Perform check operation
worker.performChecks = (originalData) => {
  // prepare the initial check outcome
  const checkOutCome = {
    error: false,
    responseCode: false,
    value: false,
  };
  // mark the outcome has not been sent yet
  let outcomeSend = false;

  // construct the url
  const urlVariable = `${originalData.protocol}://${originalData.url}`;
  const parseUrl = url.parse(urlVariable, true);
  const hostName = parseUrl.hostname;
  const { path } = parseUrl;

  // construct the request
  const requestDetails = {
    protocol: `${originalData.protocol}:`,
    hostname: hostName,
    method: originalData.method.toUpperCase(),
    path,
    timeout: originalData.timeOutSecond * 1000,
  };
  // find protocool http or https
  const protocolToUse = originalData.protocol === "http" ? http : https;

  // generate request
  const req = protocolToUse.request(requestDetails, (res) => {
    // grab the status of the response
    const status = res.statusCode;
    checkOutCome.statusCode = status;
    // update the checks and pass to the next process
    if (!outcomeSend) {
      worker.processCheckOutcome(originalData, checkOutCome);
      outcomeSend = true;
    }
  });

  req.on("error", (e) => {
    checkOutCome.error = true;
    checkOutCome.value = e;
    // update the checks and pass to the next process
    if (!outcomeSend) {
      worker.processCheckOutcome(originalData, checkOutCome);
      outcomeSend = true;
    }
  });
  req.on("timeout", () => {
    checkOutCome.error = true;
    checkOutCome.value = "timeout";
    // update the checks and pass to the next process
    if (!outcomeSend) {
      worker.processCheckOutcome(originalData, checkOutCome);
      outcomeSend = true;
    }
  });
  req.end();
};

// check outcome and send a notification based on outcome
worker.processCheckOutcome = (originalData, checkOutCome) => {
  console.log(`${checkOutCome.statusCode} ${checkOutCome.value}`);
  // check, if the status is up or down
  const status1 =
    !checkOutCome.error &&
    checkOutCome.statusCode &&
    originalData.successCode.indexOf(checkOutCome.statusCode) > -1
      ? "up"
      : "down";

  // decide whether we should alert the user or not
  const alertWanted = !!(
    originalData.lastChecked && originalData.status !== status1
  );
  // prepare the original object
  const newCheckData = originalData;
  newCheckData.status = status1;
  newCheckData.lastChecked = Date.now();

  // update data
  data.update("checks", newCheckData.id, newCheckData, (err) => {
    if (!err) {
      if (alertWanted) {
        // send the checkdata to the next process
        worker.alertUserToStatusChange();
      } else {
        console.log(
          // eslint-disable-next-line comma-dangle
          `Error: Alert is not needed because the status is not change.${status1}`
        );
      }
    } else {
      console.log("Error: Trying to save check data of one of the checks.");
    }
  });
};

// send notification sms to user whether status change
worker.alertUserToStatusChange = (newCheckData) => {
  const msg = `Alert: Your check for ${newCheckData.method.toUpperCase} and link ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.status}`;

  // send sms via twilio
  sendMsgTwilio(newCheckData.userPhone, msg, (err) => {
    if (!err) {
      console.log(`Successfully send notification.${err}`);
    } else {
      console.log("Errror: There was a problem to send sms one of the user.");
    }
  });
};

// timer to execute the worker process once per minute
worker.loop = () => {
  setInterval(() => {
    worker.gatherAllChecks();
  }, 1000 * 10);
};
// calling the worker
worker.init = () => {
  // execute all the checks
  worker.gatherAllChecks();

  // call the loop so that checks continue
  worker.loop();
};

// export module
module.exports = worker;
