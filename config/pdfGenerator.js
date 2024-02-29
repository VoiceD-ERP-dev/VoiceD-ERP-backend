const sendMail = require("../config/emailSender");
const puppeteer = require('puppeteer');
const numberToWords = require('number-to-words');
const fs = require('fs');
const encoded_header_image = fs.readFileSync('encode_files/header.txt');
const encoded_footer_image = fs.readFileSync('encode_files/footer.txt');

async function sendPdfEmail(firstname, lastname,email,nicNo,address, phone,invoiceId,orderId,currentDate,duedate,package,packagePrice,startupFee) {
  const amountInWords = numberToWords.toWords(packagePrice + 2990).replace(/\b\w/g, (char) => char.toUpperCase());
  const subject = `Invoice Notification for Invoice VDDG${invoiceId} : ${firstname} ${lastname}`;
  const text = `
    Dear ${firstname},

    We hope this email finds you well.

    Please see attached the invoice VDDG${invoiceId} for your recent transaction with VoiceD

    If you have any questions or concerns regarding the invoice, please feel free to contact us.

    Thank you for choosing VoiceD!
    Best regards,
    VoiceD Team
  `;
  const from = "dasuntheekshana12@gmail.com";
  const to = email;

  // Select the element with the class "letter-box"


  try {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome', // Specify the path to Chrome executable
      args: ['--no-sandbox'] // Add this option to run as root without sandbox
    });

    const page = await browser.newPage();
    await page.setContent(`
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VoiceD | Customer Invoice</title>
    
        <style>
            @page {
                size: A4;
                margin: 0;
            }
    
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                position: relative;
                overflow-x: hidden !important;
                box-sizing: border-box;
            }

            .amount-section
            {
                padding-top: 10px;
            }
    
            header {
                
                width: 100%;
            }
    
            .invoice-table-wrapper {
            border-collapse: collapse;
            width: 100%;
        }
    
        .letter-box {
            background-color: #1d1d1d;
            border: 1px solid black;
            padding: 10px;
        }

        
        .invoice-table-wrapper th,
        .invoice-table-wrapper td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
    
        .invoice-table-wrapper th {
            background-color: #f2f2f2;
        }
    
    .header-wrapper
    {
                display: flex;
                padding: auto;
                width: 100%;
                text-align: center !important;
                justify-content: center !important;
                align-items: center !important;
    }
    
    
    .header-wrapper, .footer-wrapper
            {
                /* background-color: rgb(138, 80, 159) !important;
                text-align: center !important;
                color: #fafafa !important; */
    
                position: relative;
               object-position: center;
            }
    
    .footer-wrapper img,
            .header-wrapper img {
                width: 100%;
            }
            
            
            .content {
                padding: 20px;
            }
    
            footer {
    
                text-align: center;
                width: 100%;
            
    
            }
    
            
    
            .customer-details, .invoice-details 
             {
                width: 100%;
                padding: 10px;
                
            }
    
            .invoice-details tr td,
            .customer-details tr td
            {
    padding: 5px;
    font-size: 10pt !important;
    border: 1px solid #565656;
            }
    
           
    
            .header-wrapper
            {
                
                text-align: center !important;
                color: #fafafa !important;
            }
    
            .header-wrapper ul 
            {
                list-style: none !important;
              
            }
    
            .invoice-details tr td:first-child,
    .customer-details tr td:first-child{
        font-weight: 600 !important;
    
    }
    
    .invoice-table
    {
        width: 100%;
    }
    .invoice-table table {
        width: 100%;
    }
    .invoice-table table thead
    {
        background-color: #3d3d3d;
        color: #ffffff;
        font-weight: 400 !important;
    }
    .invoice-table table thead th 
    {
        padding: 10px;
    }
    .invoice-table table tbody tr td {
        padding: 10px;
    }
    .amount-box
    {
        background-color: #f0f0f0;
        padding: 5px;
    }
    .invoice-table-wrapper th {
            background-color: #f2f2f2;
            color: #000; /* Set the color of the headers to black */
        }
        </style>
    </head>
    
    <body>
        <header>
            <div class="header-wrapper">
                <img src=" data:image/png;base64,${encoded_header_image }" class="pdfheader">
            </div>
        </header>
        <! –– firstname, lastname,email,nicNo, phone,invoiceId,orderId,currentDate,duedate,package,packagePrice,startupFee ––>
        
        <div class="content">
            <!-- Your dynamic content goes here -->
            <div class="table-wrapper">
                <table class="customer-details">
                    <tr>
                        <td>Name</td>
                        <td>${firstname} ${lastname}</td>
                    </tr>
                    <tr>
                        <td>Address</td>
                        <td>${address}</td>
                    </tr>
                    <tr>
                        <td>Phone</td>
                        <td>${phone}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>${email}</td>
                    </tr>

    
                </table>
    
                <table class="invoice-details">
                    <tr>
                        <td>Invoice No</td>
                        <td>VDDG${invoiceId}</td>
                    </tr>
    
                    <tr>
                        <td>Order No</td>
                        <td>VDON${orderId}</td>
                    </tr>
    
                    <tr>
                        <td>Invoice Date</td>
                        <td>${currentDate}</td>
                    </tr>
    
                    <tr>
                        <td>Due Date</td>
                        <td>${duedate}</td>
                    </tr>
                </table>
            </div>
            <br/>
            <section class="invoice-table">
                <table class="invoice-table-wrapper">
                    <thead>
                        <tr>
                            <th>#No</th>
                            <th>Description</th>
                            <th>Unit Price (LKR)</th>
                            <th colspan="2">QTY</th>
                            
                            <th>Total</th>
                        </tr>
                    </thead>
            
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>${package} Package</td>
                            <td>${packagePrice}</td>
                            <td colspan="2">1</td>
                            
                            <td>${packagePrice}.00</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Startup Fee</td>
                            <td>${startupFee}</td>
                            <td colspan="2">1</td>
                            <td>${startupFee}.00</td>
                        </tr>

                        <tr></tr>
                        <tr></tr>
                        
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4"></td>
                            <td><strong>Sub Total</strong></td>
                            <td><strong>${packagePrice + 2990}.00</strong></td>
                        </tr>
                        <tr>
                            <td colspan="4"></td>
                            <td><strong>Discount</strong></td>
                            <td><strong>0</strong></td>
                        </tr>
                        <tr>
                            <td colspan="4"></td>
                            <td><strong>Total (Rs)</strong></td>
                            <td><strong>${packagePrice + 2990}.00</strong></td>
                        </tr>
                    </tfoot>
                    
                </table>
            </section>

        
    
            <section class="amount-section">
                <div class="amount-box">
                    <div class="letter-box ">
                        <p><strong>Total Amount in Letters:</strong> ${amountInWords} Rupees</p>
                    </div>
                </div>
            </section>
            
        </div>
        <br/>
        <br/>

        <footer>
            <div class="footer-wrapper">
                <img src="data:image/png;base64,${encoded_footer_image}" class="pdfheader">
            </div>
        </footer>
    </body>
    </html>
    
    `);

    const pdfBytes = await page.pdf({ format: 'A4' });

    await browser.close();

    // Send email with PDF attachment
    await sendMail({ from, to, subject, text, attachment: { filename: `Invoice VDDG${invoiceId}.pdf`, content: pdfBytes } });
    console.log("Email sent successfully");

    return true;
  } catch (error) {
    console.error("Error sending PDF via email:", error);
    return false;
  }
}

module.exports = sendPdfEmail;