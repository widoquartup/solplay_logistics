// MailgunEmail.ts
import { EmailInterface } from '../Interfaces/EmailInterface';
import nodemailer from 'nodemailer';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mailgunTransport = require('nodemailer-mailgun-transport');
class MailgunEmail implements EmailInterface {
    private transporter: nodemailer.Transporter;

    constructor() {
        const mailgunOptions = {
            auth: {
                api_key: process.env.MAILGUN_API_KEY || '',
                domain: process.env.MAILGUN_DOMAIN || '',
            },
            host: process.env.MAILGUN_ENDPOINT || 'api.mailgun.net',
        };

        const transportOptions = mailgunTransport(mailgunOptions);
        this.transporter = nodemailer.createTransport(transportOptions);
    }

    send(message: object): void {
        const mailOptions = {
            from: 'NoReply <no-reply@josemanuelmunoz.com>',
            to: 'mg.jmanuel@gmail.com',
            subject: 'Hello',
            text: 'Hello world?',
            html: '<b>Hello world?</b>',
            ...message, // Permitir personalización de los campos del mensaje
        };

        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log('Error sending email:', error);
            }
            console.log('Message sent: %s', (info as nodemailer.SentMessageInfo).messageId);
        });
    }
}

export default MailgunEmail;
