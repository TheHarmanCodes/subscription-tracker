import nodemailer from "nodemailer";
import {GMAIL_PASS, MAIL_USER} from "./env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${MAIL_USER}`,
    pass: `${GMAIL_PASS}`,
  },
});
export default transporter;
