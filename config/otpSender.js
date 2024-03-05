const dotenv = require("dotenv");
dotenv.config();
const twilio = require("twilio");
const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function sendSMS(from, to, body) {
  client.messages
    .create({ from, to, body })
    .then((message) => {
      console.log(
        `SMS message sent from ${from} to ${to}. Message SID: ${message.sid}`
      );
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = sendSMS;