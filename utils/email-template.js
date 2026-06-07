const DASHBOARD_URL = "#";

export const generateEmailTemplate = ({
  userName,
  subscriptionName,
  renewalDate,
  planName,
  price,
  paymentMethod,
  accountSettingsLink,
  supportLink,
  daysLeft,
}) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SubDub - Subscription Reminder</title>
    <style>
        /* Mobile Responsive Styles */
        @media only screen and (max-width: 480px) {
            .mobile-container {
                padding: 20px 12px !important;
            }
            .mobile-header {
                padding: 35px 24px 25px !important;
            }
            .mobile-logo {
                font-size: 26px !important;
            }
            .mobile-content {
                padding: 0 24px 30px !important;
            }
            .mobile-greeting {
                font-size: 20px !important;
            }
            .mobile-message {
                font-size: 15px !important;
                margin-bottom: 28px !important;
            }
            .mobile-card-padding {
                padding: 20px 20px !important;
            }
            .mobile-label {
                font-size: 13px !important;
                width: 65px !important;
            }
            .mobile-value {
                font-size: 15px !important;
            }
            .mobile-info {
                font-size: 13px !important;
                margin-bottom: 28px !important;
            }
            .mobile-button {
                font-size: 15px !important;
                padding: 12px 28px !important;
                display: block !important;
                width: auto !important;
                margin: 0 20px !important;
            }
            .mobile-footer {
                padding: 20px 24px 28px !important;
            }
            .mobile-footer-text {
                font-size: 11px !important;
            }
            .mobile-footer-brand {
                font-size: 13px !important;
            }
            .mobile-divider {
                padding: 22px 0 !important;
            }
            .mobile-support {
                font-size: 13px !important;
            }
            .mobile-signature {
                font-size: 13px !important;
            }
            .mobile-outside-footer {
                font-size: 11px !important;
                padding: 0 12px !important;
            }
            .mobile-badge {
                font-size: 12px !important;
                padding: 5px 16px !important;
                margin-bottom: 28px !important;
            }
        }

        @media only screen and (max-width: 375px) {
            .mobile-greeting {
                font-size: 18px !important;
            }
            .mobile-message {
                font-size: 14px !important;
            }
            .mobile-value {
                font-size: 14px !important;
            }
            .mobile-button {
                font-size: 14px !important;
                padding: 11px 24px !important;
                margin: 0 16px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f7; -webkit-font-smoothing: antialiased;">
<div class="mobile-container" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif; line-height: 1.47059; color: #1d1d1f; max-width: 640px; margin: 0 auto; padding: 40px 20px;">

    <!-- Main Container -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%"
           style="background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);">

        <!-- Minimal Header -->
        <tr>
            <td class="mobile-header" style="padding: 50px 50px 30px; text-align: center;">
                <p class="mobile-logo" style="
                        margin: 0;
                        font-size: 32px;
                        font-weight: 600;
                        color: #1d1d1f;
                        letter-spacing: -0.5px;
                        line-height: 1.1;
                    ">SubDub</p>
            </td>
        </tr>

        <!-- Content Area -->
        <tr>
            <td class="mobile-content" style="padding: 0 50px 40px;">

                <div style="text-align: center; margin-bottom: 35px;">
                    <span class="mobile-badge" style="
                        display: inline-block;
                        background-color: #1d1d1f;
                        color: #ffffff;
                        padding: 6px 20px;
                        border-radius: 15px;
                        font-size: 13px;
                        font-weight: 500;
                        letter-spacing: -0.1px;
                    ">
                        ${daysLeft} days remaining
                    </span>
                </div>

                <!-- Greeting -->
                <p class="mobile-greeting" style="
                        font-size: 24px;
                        font-weight: 600;
                        color: #1d1d1f;
                        letter-spacing: -0.3px;
                        margin: 0 0 8px;
                    ">
                    Hello ${userName}
                </p>

                <!-- Main Message -->
                <p class="mobile-message" style="
                        font-size: 17px;
                        color: #6e6e73;
                        margin: 0 0 35px;
                        letter-spacing: -0.2px;
                    ">
                    Your <strong style="color: #1d1d1f; font-weight: 500;">${subscriptionName}</strong> subscription
                    will renew on
                    <span style="color: #1d1d1f; font-weight: 500;">${renewalDate}</span>.
                </p>

                <!-- Subscription Details -->
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="
                        background-color: #f5f5f7;
                        border-radius: 16px;
                        margin-bottom: 30px;
                    ">
                    <tr>
                        <td class="mobile-card-padding" style="padding: 28px 30px;">

                            <!-- Plan -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="padding-bottom: 16px; border-bottom: 1px solid #e5e5e7;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td class="mobile-label" style="
                                                        font-size: 14px;
                                                        color: #6e6e73;
                                                        font-weight: 400;
                                                        letter-spacing: -0.1px;
                                                        width: 80px;
                                                    ">
                                                    Plan
                                                </td>
                                                <td class="mobile-value" style="
                                                        font-size: 17px;
                                                        color: #1d1d1f;
                                                        font-weight: 500;
                                                        text-align: right;
                                                        letter-spacing: -0.2px;
                                                    ">
                                                    ${planName}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Price -->
                                <tr>
                                    <td style="padding: 16px 0; border-bottom: 1px solid #e5e5e7;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td class="mobile-label" style="
                                                        font-size: 14px;
                                                        color: #6e6e73;
                                                        font-weight: 400;
                                                        letter-spacing: -0.1px;
                                                        width: 80px;
                                                    ">
                                                    Price
                                                </td>
                                                <td class="mobile-value" style="
                                                        font-size: 17px;
                                                        color: #1d1d1f;
                                                        font-weight: 500;
                                                        text-align: right;
                                                        letter-spacing: -0.2px;
                                                    ">
                                                    ${price}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Payment Method -->
                                <tr>
                                    <td style="padding-top: 16px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td class="mobile-label" style="
                                                        font-size: 14px;
                                                        color: #6e6e73;
                                                        font-weight: 400;
                                                        letter-spacing: -0.1px;
                                                        width: 80px;
                                                    ">
                                                    Payment
                                                </td>
                                                <td class="mobile-value" style="
                                                        font-size: 17px;
                                                        color: #1d1d1f;
                                                        font-weight: 500;
                                                        text-align: right;
                                                        letter-spacing: -0.2px;
                                                    ">
                                                    ${paymentMethod}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>
                </table>

                <p class="mobile-info" style="
                        font-size: 14px;
                        color: #6e6e73;
                        margin: 0 0 35px;
                        letter-spacing: -0.1px;
                        line-height: 1.6;
                    ">
                    To manage or cancel your subscription, visit
                    <a href="${accountSettingsLink}" style="
                            color: #0071e3;
                            text-decoration: none;
                        ">Account Settings</a>
                    before your renewal date. Changes made after this date will apply to the next billing cycle.
                </p>

                <div style="text-align: center; margin-bottom: 35px;">
                    <a href="${accountSettingsLink}" class="mobile-button" style="
                            display: inline-block;
                            background-color: #0071e3;
                            color: #ffffff;
                            padding: 14px 36px;
                            border-radius: 980px;
                            font-size: 17px;
                            font-weight: 500;
                            text-decoration: none;
                            letter-spacing: -0.2px;
                            cursor: pointer;
                        ">Manage Subscription</a>
                </div>

                <!-- Divider -->
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                        <td class="mobile-divider" style="padding: 30px 0; border-top: 1px solid #e5e5e7;">

                            <!-- Support -->
                            <p class="mobile-support" style="
                                    font-size: 14px;
                                    color: #6e6e73;
                                    margin: 0 0 25px;
                                    text-align: center;
                                    letter-spacing: -0.1px;
                                ">
                                Questions? <a href="${supportLink}" style="
                                        color: #0071e3;
                                        text-decoration: none;
                                    ">Contact Support</a>
                            </p>

                            <!-- Signature -->
                            <p class="mobile-signature" style="
                                    margin: 0;
                                    font-size: 14px;
                                    color: #6e6e73;
                                    text-align: center;
                                    letter-spacing: -0.1px;
                                ">
                                The SubDub Team
                            </p>

                        </td>
                    </tr>
                </table>

            </td>
        </tr>

        <!-- Developer Footer -->
        <tr>
            <td class="mobile-footer" style="
                    background-color: #f5f5f7;
                    padding: 25px 50px 35px;
                    border-top: 1px solid #e5e5e7;
                ">
                <p class="mobile-footer-text" style="
                        margin: 0;
                        font-size: 12px;
                        line-height: 1.5;
                        color: #86868b;
                        text-align: center;
                        letter-spacing: -0.1px;
                    ">
                    <strong>
                        <span class="mobile-footer-brand" style="
                            font-weight: 600;
                            font-size: 14px;
                            color: #1d1d1f;
                            letter-spacing: -0.1px;
                        ">SubDub</span>
                    </strong>
                    <br>
                    <span style="color: #86868b;">Subscription Tracking, Simplified.</span>
                    <br>
                    A demonstration project for intelligent subscription management
                    <br>
                    <span style="color: #aeaeb2;">Built as a portfolio showcase</span>
                    <br><br>

                    <a href="{{unsubscribeUrl}}" style="
                            color: #424245;
                            text-decoration: none;
                        ">Unsubscribe</a>
                    <span style="color: #d2d2d7; margin: 0 8px;">|</span>
                    <a href="${DASHBOARD_URL}" style="
                            color: #424245;
                            text-decoration: none;
                        ">Dashboard</a>
                    <span style="color: #d2d2d7; margin: 0 8px;">|</span>
                    <a href="https://github.com/TheHarmanCodes" target="_blank" style="
                            color: #424245;
                            text-decoration: none;
                        ">
                        <img src="https://github.githubassets.com/assets/apple-touch-icon-144x144-b882e354c005.png"
                             alt="GitHub"
                             width="12"
                             height="12"
                             style="vertical-align: middle; border: none; opacity: 0.6; margin-right: 3px;">
                        Developer
                    </a>
                    <br><br>

                    <span style="color: #aeaeb2;">
                        © 2026 SubDub. All rights reserved.
                    </span>
                </p>
            </td>
        </tr>

    </table>

    <!-- Email Footer Note -->
    <p class="mobile-outside-footer" style="
            margin: 20px 0 0;
            font-size: 12px;
            color: #aeaeb2;
            text-align: center;
            letter-spacing: -0.1px;
            line-height: 1.5;
        ">
        This is an automated message from SubDub.
        <br>
        Please do not reply to this email.
    </p>

</div>
</body>
</html>`;

export const emailTemplates = [
  {
    label: "7 days before reminder",
    generateSubject: (data) =>
      `📅 Reminder: Your ${data.subscriptionName} Subscription Renews in 7 Days!`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 7 }),
  },
  {
    label: "5 days before reminder",
    generateSubject: (data) =>
      `⏳ ${data.subscriptionName} Renews in 5 Days – Stay Subscribed!`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 5 }),
  },
  {
    label: "2 days before reminder",
    generateSubject: (data) =>
      `🚀 2 Days Left!  ${data.subscriptionName} Subscription Renewal`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 2 }),
  },
  {
    label: "1 days before reminder",
    generateSubject: (data) =>
      `⚡ Final Reminder: ${data.subscriptionName} Renews Tomorrow!`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 1 }),
  },
];
