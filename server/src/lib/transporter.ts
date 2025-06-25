import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: 587,
  secure: false, // usar SSL
  auth: {
    user: process.env.NODEMAILER_USERNAME,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});
