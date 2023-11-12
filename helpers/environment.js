/* eslint-disable operator-linebreak */
/*
 * Title: Environment variable
 *Description: Handle environment variable on this project.
 *Author : MD. ZAHIDUL ISLAM
 *Description:  22/10/2023
 */

// Module scaffolding
const environment = {};

environment.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "slkfjsahlahfalkfhahffk",
  maxCheck: 5,
  twilio: {
    fromNumber: "01532323232",
    sid: "ACe0d8249eb8f958dd91eadd0783320482",
    authToken: "cdfe98e0393c676505bc85d097fa546c",
  },
};

environment.production = {
  port: 5000,
  envName: "production",
  secretKey: "gasfashgkasjgfjsgfaskj",
  maxCheck: 5,
  twilio: {
    fromNumber: "01532323232",
    sid: "ACe0d8249eb8f958dd91eadd0783320482",
    authToken: "cdfe98e0393c676505bc85d097fa546c",
  },
};

// determine which environment was pass
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";
const environmentToExport =
  typeof environment[currentEnvironment] === "object"
    ? environment[currentEnvironment]
    : environment.staging;

module.exports = environmentToExport;
