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

const sendMailReject = (data) => {
    return new Promise((resolve, reject)=>{
        // Handle attachment as Buffer
        const attachments = [];
        if (data.attachment) {
            attachments.push({
                filename: data.attachment.filename,
                content: data.attachment.content
            });
        }

        const mailOptions = {
            from: data.from,
            to: data.to,
            subject: data.subject,
            html: data.html,
            cc: ['shanbasnayake@hotmail.com', 'efnuefb@gmail.com'],
            attachments: attachments
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if(err){
                reject(err);
            } else {
                resolve(info.response);
            }
        });
    });
};

async function sendRejectMail(subjectText,header1,header2,id,_id,firstname, lastname, email, salesman,description ) {
    
    const subject = `${subjectText} - VDDG${id}`;
    const html = `
        <p style="font-size: 16px;">Dear ${salesman},</p>

        <p style="font-size: 16px;">${header1}</p>
        
        <ul style="font-size: 16px;">
            <li>Invoice ID: VDDG${id}</li>        
            <li>Customer: ${firstname} ${lastname}</li>
            <li>Customer ID: ${_id}</li>
            <li>Reason: ${description}</li>
        </ul>

        <p style="font-size: 16px;">${header2}</p>
        <p style="font-size: 16px;">Thank you for your understanding and cooperation.</p>


        <p style="font-size: 16px;">Best regards,</p>
        <p style="font-size: 16px;">VoiceD Team</p>
    `;

    const from = "dasuntheekshana12@gmail.com";
    const to = email;

    try {

        // Send email with HTML content
        await sendMailReject({ from, to, subject, html });
        console.log("Email sent successfully");

        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}

module.exports = sendRejectMail;