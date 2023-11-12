/*
* Title: Handle Request and Response.
*Description: Helper function to help Response and Request of a server.
*Author : MD. ZAHIDUL ISLAM
*Description:  15/10/2023
*/

// Dependencis
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundRoute');
const { parseJSON } = require('./utilities');

// Handle Request and Response

// handler object - Module Scaffolding
const handler = {};

// return HandlerReqRes function
handler.handleReqRes = (req, res) => {
  // Request Handle
  // Get the url and parse it
  const parseUrl = url.parse(req.url, true);
  const routePath = parseUrl.pathname;
  const trimPath = routePath.replace(/^\/+|\/+$/g, '');
  // Get Method
  const method = req.method.toLowerCase();
  // get query string
  const queryString = parseUrl.query;
  // Headers object
  const headerObject = req.headers;

  // all properties compress in an object
  const requestProperties = {
    parseUrl,
    routePath,
    trimPath,
    method,
    queryString,
    headerObject,
  };

  // get data
  const decoder = new StringDecoder('utf-8');
  let realData = '';

  // Handle routes
  const chosenHandler = routes[trimPath] ? routes[trimPath] : notFoundHandler;

  req.on('data', (buffer) => {
    realData += decoder.write(buffer);
  });
  req.on('end', () => {
    realData += decoder.end();

    // data pass to the requestProperties object
    requestProperties.body = parseJSON(realData);
    chosenHandler(requestProperties, (statusCode, payload) => {
      const codeStatus = typeof (statusCode) === 'number' ? statusCode : 500;
      const payloadObject = typeof (payload) === 'object' ? payload : {};
      const payloadString = JSON.stringify(payloadObject);

      // set header for response data to json
      res.setHeader('Content-Type', 'application/json');
      // return the final response
      res.writeHead(codeStatus);
      res.end(payloadString);
    });
  });
};

// Export handler object
module.exports = handler;
