/*
 * Title: Server and Create Background Task
 *Description: Create server and create background process
 *Author : MD. ZAHIDUL ISLAM
 *Description:  11/11/2023
 */

// Denpendencis
const server = require("./lib/server");
const worker = require("./lib/worker");

// const data = require('./lib/data');

// App Object - Mudule scaffolding
const app = {};
app.start = () => {
  // calling the server
  server.init();

  // calling the worker
  worker.init();
};

// Calling create server
app.start();

module.exports = app;
