declare module 'nodemailer-mailgun-transport' {
    import { TransportOptions } from 'nodemailer';

    interface MailgunOptions {
        auth: {
            api_key: string;
            domain: string;
        };
    }

    function mailgun(options: MailgunOptions): TransportOptions;

    export = mailgun;
}
