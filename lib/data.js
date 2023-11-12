/*
 * Title: Data CRUD Librery
 *Description: Handle CRUD operation
 *Author : MD. ZAHIDUL ISLAM
 *Description:  22/10/2023
 */

// dependencies

const fs = require("fs");
const path = require("path");

// Module scafollding
const lib = {};

// base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

// write data to file
lib.create = (dir, file, data, callback) => {
  // open file for writting
  fs.open(`${lib.baseDir + dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // data convert to string
      const stringData = JSON.stringify(data);

      // write data to file and then close it
      fs.write(fileDescriptor, stringData, (err1) => {
        if (!err1) {
          fs.close(fileDescriptor, (err2) => {
            if (!err2) {
              callback(false);
            } else {
              callback("Error closing the new file!");
            }
          });
        } else {
          callback("Error Writing to new file!");
        }
      });
    } else {
      callback("Could not create new file, it may already exists!");
    }
  });
};

// read data from file
lib.read = (dir, fileName, callback) => {
  // read file
  fs.readFile(`${lib.baseDir + dir}/${fileName}.json`, "utf8", (err, data) => {
    callback(err, data);
  });
};

// update existing file
lib.update = (dir, fileName, data, callback) => {
  // file open for writing
  fs.open(
    `${lib.baseDir + dir}/${fileName}.json`,
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert data to string
        const stringData = JSON.stringify(data);

        // removed or truncate data from the existing file
        fs.ftruncate(fileDescriptor, (err1) => {
          if (!err1) {
            // write to the file and close it
            fs.writeFile(fileDescriptor, stringData, (err2) => {
              if (!err2) {
                // close the file
                fs.close(fileDescriptor, (err3) => {
                  if (!err3) {
                    callback(false);
                  } else {
                    callback("Error closing file.");
                  }
                });
              } else {
                callback("Error writing to existing file.");
              }
            });
          } else {
            callback("Error truncate the file.");
          }
        });
      } else {
        callback(`Error Updating. File may not exist. ${err}`);
      }
      // eslint-disable-next-line comma-dangle
    }
  );
};

// delete existing file
lib.delete = (dir, fileName, callback) => {
  // unlink file
  fs.unlink(`${lib.baseDir + dir}/${fileName}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Erroe deleting file.");
    }
  });
};

// get all the item in a directory
lib.list = (dir, callback) => {
  // read directory
  fs.readdir(`${lib.baseDir + dir}/`, (err, fileNames) => {
    if (!err && fileNames && fileNames.length > 0) {
      const trimFileNames = [];
      fileNames.forEach((fileName) => {
        trimFileNames.push(fileName.replace(".json", ""));
      });
      callback(false, trimFileNames);
    } else {
      callback(`Can not read list of file of a directory ${err}`);
    }
  });
};

// export module
module.exports = lib;
