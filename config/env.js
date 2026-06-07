import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  SERVER_URL,
  NODE_ENV,
  MONGODB_URI,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  ARCJET_KEY,
  ARCJET_ENV,
  QSTASH_URL,
  QSTASH_TOKEN,
  MAIL_USER,
  GMAIL_PASS,
  ADMIN_BOOTSTRAP_SECRET,
} = process.env;

// Validate required variables
const required = [
  "MONGODB_URI",
  "JWT_SECRET",
  "ARCJET_KEY",
  "QSTASH_URL",
  "QSTASH_TOKEN",
  "MAIL_USER",
  "GMAIL_PASS",
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
}
