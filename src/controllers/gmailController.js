import nodeMailer from "nodemailer";

require('dotenv').config();

let transporter = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, 
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

let sendEmail = (to, subject, htmlContent) => {
    let options = {
        from: process.env.MAIL_USERNAME,
        to: to,
        subject: subject,
        html: htmlContent
    };
    return transporter.sendMail(options);
};

let sendEmailWithAttachment = (to, subject, htmlContent, filename, path) => {
    let options = {
        from: process.env.MAIL_USERNAME,
        to: to,
        subject: subject,
        html: htmlContent,
        attachments: [
            {
                filename: filename,
                path: path
            }
        ]
    };
    return transporter.sendMail(options);
}
;

module.exports = {
    sendEmail: sendEmail,
    sendEmailWithAttachment:sendEmailWithAttachment
};