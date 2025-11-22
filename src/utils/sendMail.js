import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.SMTP_FROM) {
  console.warn(
    '⚠ WARNING: SMTP_FROM is not defined. Emails may fail without a valid sender address.',
  );
}

export const sendEmail = async (options = {}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      ...options,
    };

    return await transporter.sendMail(mailOptions);
  } catch (err) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};
