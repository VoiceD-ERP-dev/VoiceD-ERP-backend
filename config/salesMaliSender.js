const nodemailer = require('nodemailer');

const config = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: "dasuntheekshana12@gmail.com",
        pass: "vkid tjfr uanj olpx"
    },
};
const transporter = nodemailer.createTransport(config);

const sendMailSales = (data) => {
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

async function sendSales(firstname, lastname, email, username, password, phone, agentNo) {
    
    const subject = `Welcome Aboard, ${firstname}! Your VoiceD Journey Begins Now`;
    const html = `
        <p style="font-size: 16px;">Dear ${firstname},</p>

        <p style="font-size: 16px;">A hearty welcome to the VoiceD family! We're thrilled to have you join us as a Salesman. Here are your login credentials:</p>
        
        <ul style="font-size: 16px;">
            <li>Agent ID: ${agentNo}</li>
            <li>Username: ${username}</li>
            <li>Password: ${password}</li>
        </ul>
        
        <p style="font-size: 16px;"><strong style="color:red;">Please keep these details safe and secure.</strong></p>

        <p style="font-size: 16px;">We're here to support you every step of the way. If you have any questions or concerns regarding the invoice or anything else, feel free to reach out to us. We're just an email away!</p>

        <p style="font-size: 16px;">Thank you for choosing VoiceD!</p>
        <p style="font-size: 16px;">Best regards,</p>
        <p style="font-size: 16px;">VoiceD Team</p>
    `;

    const from = "dasuntheekshana12@gmail.com";
    const to = email;

    try {

        // Send email with HTML content
        await sendMailSales({ from, to, subject, html });
        console.log("Email sent successfully");

        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}

module.exports = sendSales;
