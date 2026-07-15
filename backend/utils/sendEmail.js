const sgMail = require('@sendgrid/mail');

const sendEmail = async (to, subject, text) => {
    try {
        console.log('sendEmail: attempt to send to', to);
        const apiKey = process.env.SENDGRID_API_KEY;
        const from = process.env.EMAIL_FROM;
        const replyTo = process.env.REPLY_TO || from;

        if (!apiKey || !from) {
            console.error('Missing SendGrid config: SENDGRID_API_KEY or EMAIL_FROM');
            return false;
        }

        sgMail.setApiKey(apiKey);

        const msg = {
            to,
            from,
            replyTo,
            subject,
            text,
        };

        await sgMail.send(msg);
        return true;
    } catch (error) {
        console.error('Error sending email via SendGrid:', error);
        if (error.response && error.response.body) {
            console.error('SendGrid response:', error.response.body);
        }
        return false;
    }
};

module.exports = sendEmail;