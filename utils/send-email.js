import dayjs from "dayjs";
import { emailTemplates } from "./email-template.js";
import { MAIL_USER } from "../config/env.js";
import transporter from "../config/nodemailer.js";

export const sendReminderEmail = async ({ to, type, subscription }) => {
  const template = emailTemplates.find((t) => t.label === type);

  if (!template) throw new Error("Invalid email type");

  const mailInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format("MMMM D, YYYY"),
    planName: subscription.name,
    price: `${subscription.price} ${subscription.currency} (${subscription.frequency})`,
    paymentMethod: subscription.paymentMethod,
    accountSettingsLink: "#",
    supportLink: "#",
  };

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOptions = {
    from: MAIL_USER,
    to: to,
    subject: subject,
    html: message,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Email send failed:", error);
    throw error;
  }
};
