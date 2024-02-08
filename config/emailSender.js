const nodemailer = require('nodemailer');

const config = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: "dasuntheekshana12@gmail.com",
        pass: "yszs kvfj dbjq jfqo"
    },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = (data) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(data, (err, info) => {
            if (err) {
                reject(err);
            } else {
                resolve(info.response);
            }
        });
    });
};

module.exports = sendEmail;
