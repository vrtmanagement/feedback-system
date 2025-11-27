import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
    }
    return transporter;
}

// HTML email template
function generateEmailTemplate(survey) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          .email-wrapper {
            width: 100%;
            padding: 20px 0;
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
          .logo-section {
            background: white;
            padding: 40px 30px 30px;
            text-align: center;
          }
          .logo-section img {
            max-width: 200px;
            height: auto;
            display: inline-block;
          }
          .header { 
            background: white;
            color: #dc2626; 
            padding: 30px 30px 35px; 
            text-align: center;
            border-bottom: 2px solid #f3f4f6;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
            color: #dc2626;
          }
          .emoji {
            display: inline-block;
            font-size: 32px;
            margin-left: 8px;
          }
          .content { 
            padding: 40px 40px 35px;
            background: white;
          }
          .greeting {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .content p {
            margin: 16px 0;
            color: #4b5563;
            font-size: 15px;
            line-height: 1.7;
          }
          .details-box {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border-left: 5px solid #dc2626;
            padding: 25px;
            margin: 28px 0;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(220, 38, 38, 0.08);
          }
          .details-box p {
            margin: 0 0 15px 0;
            font-size: 16px;
            font-weight: 700;
            color: #dc2626;
          }
          .details-box ul {
            margin: 0;
            padding-left: 0;
            list-style: none;
          }
          .details-box li {
            margin: 12px 0;
            padding-left: 25px;
            position: relative;
            color: #374151;
            font-size: 14px;
          }
          .details-box li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #dc2626;
            font-weight: bold;
            font-size: 16px;
          }
          .details-box li strong {
            color: #1f2937;
            font-weight: 600;
          }
          .signature {
            margin-top: 35px;
            padding-top: 25px;
            border-top: 2px solid #f3f4f6;
          }
          .signature p {
            margin: 5px 0;
            color: #6b7280;
          }
          .signature strong {
            color: #dc2626;
            font-size: 16px;
            font-weight: 700;
          }
          .footer { 
            text-align: center; 
            padding: 30px 30px;
            background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
            color: #6b7280; 
            font-size: 13px;
            border-top: 1px solid #e5e7eb;
          }
          .footer-logo {
            margin-bottom: 15px;
          }
          .footer p {
            margin: 8px 0;
            line-height: 1.5;
          }
          .footer-divider {
            width: 50px;
            height: 2px;
            background: #dc2626;
            margin: 20px auto;
            border-radius: 2px;
          }
          .copyright {
            font-weight: 600;
            color: #374151;
          }
          @media only screen and (max-width: 600px) {
            .content {
              padding: 30px 25px !important;
            }
            .header h1 {
              font-size: 22px !important;
            }
            .logo-section img {
              max-width: 150px !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="container">
            <div class="logo-section">
              <img src="https://${process.env.VERCEL_URL || 'vrt-feedback.vercel.app'}/asset/logo.png" alt="VRT Management Group Logo" />
            </div>
            <div class="header">
              <h1>Thank You for Your Feedback!<span class="emoji">🎉</span></h1>
            </div>
            <div class="content">
              <p class="greeting">Hi ${survey.fullName},</p>
              
              <p>Thank you for taking the time to complete our survey! Your feedback is invaluable to us and helps us improve our services to better serve you and your organization.</p>
              
              <div class="details-box">
                <p>📋 Survey Submission Summary</p>
                <ul>
                  <li><strong>Submitted:</strong> ${new Date(survey.submittedAt).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</li>
                  <li><strong>Company:</strong> ${survey.company}</li>
                  <li><strong>Questions Answered:</strong> ${survey.questionsAndAnswers.length}</li>
                </ul>
              </div>
              
              <p>We truly appreciate your participation in the EGA Program survey. Your honest feedback helps us understand what's working well and where we can improve.</p>
              
              <p>If you have any questions, additional feedback, or would like to discuss your responses further, please don't hesitate to reach out to us anytime.</p>
              
              <div class="signature">
                <p>Warm regards,</p>
                <p><strong>VRT Management Group Team</strong></p>
                <p style="color: #9ca3af; font-size: 13px; margin-top: 10px;">Empowering Excellence Through Feedback</p>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
}

// Plain text fallback template
function generateTextTemplate(survey) {
    return `
Thank You for Your Feedback!

Hi ${survey.fullName},

Thank you for taking the time to complete our survey! Your feedback is invaluable to us and helps us improve our services.

Survey Details:
- Submitted: ${new Date(survey.submittedAt).toLocaleString()}
- Company: ${survey.company}
- Questions Answered: ${survey.questionsAndAnswers.length}

We truly appreciate your participation and will carefully review your responses. Your insights help us serve you better.

If you have any questions or additional feedback, feel free to reach out to us anytime.

Best regards,
VRT Management Group Team

---
© ${new Date().getFullYear()} VRT Management Group, LLC. All rights reserved.
This email was sent because you completed a survey on our platform.
    `;
}

/**
 * Send thank you email to user after survey submission
 * @param {Object} survey - Survey document with user details
 * @returns {Promise<Object>} - Email sending result
 */
export async function sendThankYouEmail(survey) {
    try {
        const emailTransporter = getTransporter();
        
        const info = await emailTransporter.sendMail({
            from: `"VRT Management Group" <${process.env.EMAIL_USER}>`,
            to: survey.email,
            subject: 'Thank You for Completing the EGA Program Survey! 🎉',
            html: generateEmailTemplate(survey),
            text: generateTextTemplate(survey)
        });

        console.log(`✅ Thank you email sent to ${survey.email}`);
        console.log(`   Message ID: ${info.messageId}`);
        
        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error(`❌ Failed to send email to ${survey.email}:`, error);
        return {
            success: false,
            error: error.message
        };
    }
}

