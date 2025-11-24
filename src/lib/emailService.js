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
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: #dc2626; 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content { 
            padding: 40px 30px;
            background: white;
          }
          .content p {
            margin: 15px 0;
          }
          .details-box {
            background: #f9f9f9;
            border-left: 4px solid #dc2626;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .details-box ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .details-box li {
            margin: 8px 0;
          }
          .footer { 
            text-align: center; 
            padding: 20px;
            background: #f9f9f9;
            color: #666; 
            font-size: 12px;
            border-top: 1px solid #eee;
          }
          .emoji {
            font-size: 24px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Feedback! <span class="emoji">🎉</span></h1>
          </div>
          <div class="content">
            <p>Hi <strong>${survey.fullName}</strong>,</p>
            
            <p>Thank you for taking the time to complete our survey! Your feedback is invaluable to us and helps us improve our services.</p>
            
            <div class="details-box">
              <p><strong>Survey Details:</strong></p>
              <ul>
                <li><strong>Submitted:</strong> ${new Date(survey.submittedAt).toLocaleString()}</li>
                <li><strong>Company:</strong> ${survey.company}</li>
                <li><strong>Questions Answered:</strong> ${survey.questionsAndAnswers.length}</li>
              </ul>
            </div>
            
            <p>We truly appreciate your participation and will carefully review your responses. Your insights help us serve you better.</p>
            
            <p>If you have any questions or additional feedback, feel free to reach out to us anytime.</p>
            
            <p>Best regards,<br><strong>VRT Management Group Team</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} VRT Management Group, LLC. All rights reserved.</p>
            <p style="margin-top: 10px;">This email was sent because you completed a survey on our platform.</p>
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
            subject: 'Thank You for Your Feedback! 🎉',
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

