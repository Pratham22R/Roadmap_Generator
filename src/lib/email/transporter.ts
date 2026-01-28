import nodemailer from "nodemailer";

const smtpConfig = {
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
};

export const transporter = nodemailer.createTransport(smtpConfig);

export const formatEmail = ({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) => {
    return {
        from: process.env.EMAIL_FROM || '"Roadmap Generator" <noreply@example.com>',
        to,
        subject,
        html,
    };
};
