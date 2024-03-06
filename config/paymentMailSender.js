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

const sendMailpayment = (data) => {
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

async function sendPaymentConfirmation(email,firstname,orderNo,invoiceNo,paymentType,total,estDeliveryDate){
    
    const subject = `Payment Confirmation - Order ORVDDG${orderNo}`;
    const html = `
        <p style="font-size: 16px;">Dear ${firstname},</p>

        <p style="font-size: 16px;">We hope this email finds you well. We are writing to confirm the receipt of your recent payment for Invoice VDDG${invoiceNo}. We sincerely appreciate your business and want to ensure that your payment has been successfully processed.</p>
        <p style="font-size: 16px;">Payment Details: </p>
        <ul style="font-size: 16px;">
            <li>Invoice No: VDDG${invoiceNo}</li>
            <li>Payment Amount: Rs ${total}.00</li>
            <li>Payment Method: ${paymentType}</li>
            <li>Estimated Delivery Date: ${estDeliveryDate}</li>
        </ul>
        
        <p style="font-size: 16px;">We want to assure you that your payment has been securely processed, and your order is now confirmed. Our team is diligently working to fulfill your order, and we will keep you updated on its progress.</strong></p>

        <p style="font-size: 16px;">If you have any questions or concerns regarding your payment or order, please feel free to reach out to our customer service team. We are here to assist you every step of the way.</p>

        <p style="font-size: 16px;">Once again, thank you for choosing VoiceD. We value your business and look forward to serving you again in the future.</p>
        <p style="font-size: 16px;">Best regards,</p>
        <p style="font-size: 16px;">VoiceD Team</p>
    `;

    const from = "dasuntheekshana12@gmail.com";
    const to = email;

    try {

        // Send email with HTML content
        await sendMailpayment({ from, to, subject, html });
        console.log("Email sent successfully");

        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}

module.exports = sendPaymentConfirmation;
