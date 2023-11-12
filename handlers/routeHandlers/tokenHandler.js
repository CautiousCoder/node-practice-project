/*
* Title: User token Handler
*Description: Handle User Authentication
*Author : MD. ZAHIDUL ISLAM
*Description:  23/10/2023
*/

// dependencis
const data = require('../../lib/data');
const { hash, parseJSON, createRandomString } = require('../../helpers/utilities');

// Sample object - Module Scaffolding
const handler = {};
// handle user request
handler.tokenHandler = (requestProperties, callback) => {
  // console.log(requestProperties);

  // create an array for user method
  const acceptecMethod = ['get', 'post', 'put', 'delete'];
  if (acceptecMethod.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      message: 'This method is not accept. Please try another method.',
    });
  }
};
handler._token = {};

// write code for post method
handler._token.post = (requestProperties, callback) => {
  // validate user passing data
  const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
  const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
  if (phone && password) {
    // check the user if find or not
    data.read('users', phone, (err, userData) => {
      if (!err) {
        const hashPassword = hash(password);
        if (hashPassword === parseJSON(userData).password) {
          const tokenId = createRandomString(20);
          const expires = Date.now() + 60 * 60 * 12 * 1000;
          const tokenObject = {
            id: tokenId,
            phone,
            expires,
          };

          // store the token
          data.create('tokens', tokenId, tokenObject, (err1) => {
            if (!err1) {
              callback(200, tokenObject);
            } else {
              callback(500, { Error: 'There was a problem in server side. Please try again!' });
            }
          });
        } else {
          callback(400, { Error: 'Password Envalid. Please try again!' });
        }
      } else {
        callback(400, { Error: 'There was a problem in your request. Please try again!' });
      }
    });
  } else {
    callback(400, { Error: 'Invalid phone number and password. Please try again!' });
  }
};

// write code for post method
handler._token.get = (requestProperties, callback) => {
  // check queryString token id
  const id = typeof requestProperties.queryString.id === 'string' && requestProperties.queryString.id.trim().length === 20 ? requestProperties.queryString.id : false;
  if (id) {
    // finding the user
    data.read('tokens', id, (err1, tokenData) => {
      const token = { ...parseJSON(tokenData) };
      if (!err1 && tokenData) {
        callback(200, token);
      } else {
        callback(404, { Error: '404 Token not found!' });
      }
    });
  } else {
    callback(404, { Error: '404 Token not found!' });
  }
};

// write code for post method
handler._token.put = (requestProperties, callback) => {
  // validate require field
  const id = typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length > 0 ? requestProperties.body.id : false;
  const extend = typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true ? requestProperties.body.extend : false;

  if (id && extend) {
    // finding the token
    data.read('tokens', id, (err1, tokenData) => {
      const tData = { ...parseJSON(tokenData) };
      if (!err1 && tokenData) {
        if (tData.expires > Date.now()) {
          tData.expires = Date.now() + 60 * 60 * 12 * 1000;
          // update data to the database
          data.update('tokens', id, tData, (err2) => {
            if (!err2) {
              callback(200, { message: 'Token extended successfully.' });
            } else {
              callback(500, { Error: 'There was a problem in the server side. Please try again!' });
            }
          });
        } else {
          callback(400, { Error: 'Your session has expired. Please try again!' });
        }
      } else {
        callback(404, { Error: 'You have a problem in your request. Please try again!' });
      }
    });
  } else {
    callback(400, { Error: 'You have a problem in your request. Please try again!' });
  }
};

// write code for post method
handler._token.delete = (requestProperties, callback) => {
  // check queryString id
  const id = typeof requestProperties.queryString.id === 'string' && requestProperties.queryString.id.trim().length === 20 ? requestProperties.queryString.id : false;

  if (id) {
    // finding the user
    data.read('tokens', id, (err1, tokenData) => {
      if (!err1 && tokenData) {
        // delete the user
        data.delete('tokens', id, (err2) => {
          if (!err2) {
            callback(200, { message: 'Token deleted successfully.' });
          } else {
            callback(500, { Error: 'Token couldn\'t deleted. Please try again!' });
          }
        });
      } else {
        callback(500, { Error: 'There was a problem in server side. Please try again!' });
      }
    });
  } else {
    callback(400, { Error: 'There was a problem in your request. Please try again!' });
  }
};

// token verify public function
handler._token.verify = (id, phone, callback) => {
  data.read('tokens', id, (err, tokenData) => {
    const tData = { ...parseJSON(tokenData) };
    if (!err && tokenData) {
      if (tData.id === id && tData.phone === phone) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handler;
