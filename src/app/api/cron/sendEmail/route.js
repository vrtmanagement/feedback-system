// import connectDB from "@/lib/db";
// import Survey from "@/models/Survey";
// import nodemailer from "nodemailer";
// import { NextResponse } from "next/server";

// let transporter = null;

// function getTransport() {
//     if (!transporter) {
//         transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: "coachrajesh@vrt9.com",
//                 pass: "Kumar123#45#2024" 
//             }
//         })
//     }
//     return transporter;
// }

// export async function GET(request) {
//     try {
//         // Verify the request is from Vercel Cron
//         const authHeader = request.headers.get('authorization')
//         if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//         }

//         await connectDB();

//         // const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
//         const twoMinutesAgo = new Date(Date.now() - 10 * 1000); // 10 seconds instead of 2 minutes
//         const surveysToEmail = await Survey.find({
//             status: 'submitted',
//             emailSent: false,
//             submittedAt: { $lte: twoMinutesAgo },
//         }).limit(25)

//         console.log(`Found ${surveysToEmail.length} surveys to send email`);

//         if (surveysToEmail.length === 0) {
//             return NextResponse.json({
//                 success: true,
//                 message: 'No surveys to process',
//                 processed: 0
//             }, { status: 200 })
//         }

//         const emailTransporter = getTransport();
//         const results = [];

//         for (const survey of surveysToEmail) {
//             try {
//                 // send email to survey owner
//                 const info = await emailTransporter.sendMail({
//                     from: 'coachrajesh@vrt9.com',
//                     to: survey.email,
//                     subject: 'Thank You for Your Feedback! 🎉',
//                     html: generateEmailTemplate(survey),
//                     text: generateTextTemplate(survey) // Plain text fallback
//                 })

//                 survey.emailSent = true;
//                 await survey.save();

//                 results.push({
//                     email: survey.email,
//                     status: 'sent',
//                     messageId: info.messageId,
//                 })
//                 console.log(`Email sent to ${survey.email}: ${info.messageId}`);
//             } catch (error) {
//                 console.log(`Failed to send email to ${survey.email}`);
//                 results.push({
//                     email: survey.email,
//                     status: 'failed',
//                     error: error.message
//                 })
//             }
//         }
//         return NextResponse.json({
//             success: true,
//             processed: surveysToEmail.length,
//             sent: results.filter(r => r.status === 'sent').length,
//             failed: results.filter(r => r.status === 'failed').length,
//             results
//         }, { status: 200 })

//     } catch (error) {
//         console.error('Cron job error:', error)
//         return NextResponse.json(
//             { error: 'Cron job failed', details: error.message },
//             { status: 500 }
//         )
//     }
// }



// // HTML email template
// function generateEmailTemplate(survey) {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <style>
//           body { 
//             font-family: Arial, sans-serif; 
//             line-height: 1.6; 
//             color: #333; 
//             margin: 0;
//             padding: 0;
//             background-color: #f4f4f4;
//           }
//           .container { 
//             max-width: 600px; 
//             margin: 20px auto; 
//             background: white;
//             border-radius: 10px;
//             overflow: hidden;
//             box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//           }
//           .header { 
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
//             color: white; 
//             padding: 40px 30px; 
//             text-align: center;
//           }
//           .header h1 {
//             margin: 0;
//             font-size: 28px;
//           }
//           .content { 
//             padding: 40px 30px;
//             background: white;
//           }
//           .content p {
//             margin: 15px 0;
//           }
//           .details-box {
//             background: #f9f9f9;
//             border-left: 4px solid #667eea;
//             padding: 20px;
//             margin: 20px 0;
//             border-radius: 5px;
//           }
//           .details-box ul {
//             margin: 10px 0;
//             padding-left: 20px;
//           }
//           .details-box li {
//             margin: 8px 0;
//           }
//           .footer { 
//             text-align: center; 
//             padding: 20px;
//             background: #f9f9f9;
//             color: #666; 
//             font-size: 12px;
//             border-top: 1px solid #eee;
//           }
//           .emoji {
//             font-size: 24px;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>Thank You for Your Feedback! <span class="emoji">🎉</span></h1>
//           </div>
//           <div class="content">
//             <p>Hi <strong>${survey.fullName}</strong>,</p>
            
//             <p>Thank you for taking the time to complete our survey! Your feedback is invaluable to us and helps us improve our services.</p>
            
//             <div class="details-box">
//               <p><strong>Survey Details:</strong></p>
//               <ul>
//                 <li><strong>Submitted:</strong> ${new Date(survey.submittedAt).toLocaleString()}</li>
//                 <li><strong>Company:</strong> ${survey.company}</li>
//                 <li><strong>Questions Answered:</strong> ${survey.questionsAndAnswers.length}</li>
//               </ul>
//             </div>
            
//             <p>We truly appreciate your participation and will carefully review your responses. Your insights help us serve you better.</p>
            
//             <p>If you have any questions or additional feedback, feel free to reach out to us anytime.</p>
            
//             <p>Best regards,<br><strong>Your Company Team</strong></p>
//           </div>
//           <div class="footer">
//             <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
//             <p style="margin-top: 10px;">This email was sent because you completed a survey on our platform.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `
// }

// // Plain text fallback template
// function generateTextTemplate(survey) {
//     return `
//   Thank You for Your Feedback!
  
//   Hi ${survey.fullName},
  
//   Thank you for taking the time to complete our survey! Your feedback is invaluable to us and helps us improve our services.
  
//   Survey Details:
//   - Submitted: ${new Date(survey.submittedAt).toLocaleString()}
//   - Company: ${survey.company}
//   - Questions Answered: ${survey.questionsAndAnswers.length}
  
//   We truly appreciate your participation and will carefully review your responses. Your insights help us serve you better.
  
//   If you have any questions or additional feedback, feel free to reach out to us anytime.
  
//   Best regards,
//   Your Company Team
  
//   ---
//   VRT Management Group, LLC. All rights reserved.
//   This email was sent because you completed a survey on our platform.
//     `
// }