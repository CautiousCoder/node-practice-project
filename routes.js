/*
* Title: Routes
*Description: All Route stay here
*Author : MD. ZAHIDUL ISLAM
*Description:  16/10/2023
*/

// Dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleRoute');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');
const { checkHandler } = require('./handlers/routeHandlers/checkHandler');

const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
};

module.exports = routes;
