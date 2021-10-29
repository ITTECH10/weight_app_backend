const nodemailer = require('nodemailer')

module.exports = class Email {
    newTransport() {
        return nodemailer.createTransport({
            service: "SendGrid",
            port: 25,
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD
            }
        });
    }

    async sendToCustomer(customer, subject, text) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: customer.email,
            subject: subject,
            text: text
        }

        await this.newTransport().sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
            }
            // console.log(info)
        })
    }

    async sendPasswordResetToken(customer, url) {
        const subject = 'Passwort zurücksetzen token'
        const body = `Token zum Zurücksetzen des Passworts ${url} 
        Warnung, Token ist nur 10 Minuten gültig!!!`

        this.sendToCustomer(customer, subject, body)
    }
}

