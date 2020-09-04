import nodemailer, { Transport } from 'nodemailer';
import config from 'config';
import Mail from 'nodemailer/lib/mailer';

export default class MailService {
    private transporter?: Mail;

    constructor() {
        this.setupTransporter();
    }

    public async send(message: Mail.Options): Promise<void> {
        return await this.transporter?.sendMail(message);
    }

    private setupTransporter(): void {
        this.transporter = nodemailer.createTransport({
            host: config.get('App.smtp.host'),
            port: config.get('App.smtp.port'),
            secure: false,
            auth: {
                user: config.get('App.smtp.user'),
                pass: config.get('App.smtp.password')
            },
            tls: {
                rejectUnauthorized: true
            }
        });
    }
}