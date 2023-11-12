/*
* Title: Sample Handler
*Description: Sample Handler Route
*Author : MD. ZAHIDUL ISLAM
*Description:  16/10/2023
*/

// Sample object - Module Scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
  // console.log(requestProperties);
  callback(200, {
    message: 'This is sample route url.',
  });
};

module.exports = handler;
