require("dotenv").config()
const axios = require("axios")
const jwt = require("jsonwebtoken")
const { readFileSync } = require('fs')

const KEY_P12_PATH = process.env.KEY_P12_PATH
const KEY_PASSWORD = process.env.KEY_PASSWORD
const DAPS_URL = process.env.DAPS_URL
const CLIENT_ID = process.env.CLIENT_ID

const privateKey = readFileSync(KEY_P12_PATH)

const requestDatPayload = {
  iss: CLIENT_ID,
  sub: CLIENT_ID,
  aud: "https://daps.dev.mobility-dataspace.eu/realms/DAPS",
  // aud: "idsc:IDS_CONNECTORS_ALL",
  exp: Math.floor(Date.now() / 1000) + (60 * 60),
  iat: Math.floor(Date.now() / 1000),
  nbf: Math.floor(Date.now() / 1000)
};

const requestToken = async () => {
  const client_assertion = jwt.sign(requestDatPayload, privateKey, { algorithm: "RS256"})
  try {
    const response = await axios.post(DAPS_URL, new URLSearchParams({
      grant_type: 'client_credentials',
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      client_assertion: client_assertion,
      scope: "idsc:IDS_CONNECTOR_ATTRIBUTES_ALL"
    }).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log(response.data);
  } catch (error) {
    console.error('Error making request:', error);
  }
};

requestToken()

