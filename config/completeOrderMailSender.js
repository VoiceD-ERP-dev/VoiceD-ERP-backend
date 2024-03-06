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

const sendMailCompleted = (data) => {
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

async function sendCompletedOrder(firstname,email, deliveryDate,orderNo) {
    
    const subject = `Your Order ORVDDG${orderNo} Has Been Completed and Delivered Successfully`;
    const html = `
        <p style="font-size: 16px;">Dear ${firstname},</p>

        <p style="font-size: 16px;">We are pleased to inform you that your order has been successfully completed and delivered to the specified address. Thank you for choosing VoiceD for your purchase.</p>
        
        <ul style="font-size: 16px;">
        <li>Agent ID: ORVDDG${orderNo}</li>
        <li>Delivery Date: ${deliveryDate}</li>
        <li>Grace Period: 2 Weeks</li>
        </ul>
        
        <p style="font-size: 16px;">If you have any questions or concerns regarding your order, please feel free to contact our customer support team. We are here to assist you in any way we can.</strong></p>

        <p style="font-size: 16px;">Once again, thank you for businessing with us. We hope you enjoy your purchase!</p>

        <p style="font-size: 16px;">Thank you for choosing VoiceD!</p>
        <p style="font-size: 16px;">Best regards,</p>
        <p style="font-size: 16px;">VoiceD Team</p>
    `;

    const from = "dasuntheekshana12@gmail.com";
    const to = email;

    try {

        // Send email with HTML content
        await sendMailCompleted({ from, to, subject, html });
        console.log("Email sent successfully");

        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}

module.exports = sendCompletedOrder;
