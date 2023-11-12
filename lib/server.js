/*
 * Title: Server
 *Description: Server related task
 *Author : MD. ZAHIDUL ISLAM
 *Description:  11/11/2023
 */

// Denpendencis
const http = require("http");
const environment = require("../helpers/environment");
const { handleReqRes } = require("../helpers/handleRegRes");
// const data = require('./lib/data');

// Server Object - Mudule scaffolding
const server = {};

// Create Server
server.createServer = () => {
  const serverCreate = http.createServer(server.handleReqRes);

  serverCreate.listen(environment.port, () => {
    console.log(`The listening port is ${environment.port}`);
  });
};

// Handler Request Respons
server.handleReqRes = handleReqRes;

// Calling create server
server.init = () => {
  server.createServer();
};

module.exports = server;
