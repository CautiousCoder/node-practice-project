/*
* Title: Not Found Handler
*Description: 404, Not found route Handler Route
*Author : MD. ZAHIDUL ISLAM
*Description:  16/10/2023
*/

// Sample object - Module Scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  // console.log(requestProperties);
  callback(404, {
    message: 'This is 404 not found route url.',
  });
};

module.exports = handler;
