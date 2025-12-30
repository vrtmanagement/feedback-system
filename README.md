# EGA™ Participant Feedback System

A modern, full-stack feedback and survey management system built with Next.js for collecting participant feedback from the EGA (Entrepreneur Growth Accelerator) program. The system features user details collection, a comprehensive 15-question survey, referral management, and automated email notifications.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## 🌟 Features

- **User Details Collection**: Capture user information including name, email, phone, company, and profile picture
- **Interactive Survey**: 15-question survey with multiple question types:
  - Rating scales (1-10)
  - Yes/No questions with visual thumbs up/down
  - Multiple choice with labeled options
  - Open-ended text responses
- **Real-time Progress Tracking**: Draggable floating progress indicator showing completion status
- **Referral System**: Allow satisfied users to refer colleagues
- **Email Notifications**: Automated thank-you emails with survey responses
- **File Upload**: Profile picture upload with Vercel Blob storage
- **Responsive Design**: Beautiful UI optimized for desktop, tablet, and mobile devices
- **Toast Notifications**: User-friendly feedback for all actions
- **Data Validation**: Comprehensive frontend and backend validation

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **Canvas Confetti** - Celebration animations

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Nodemailer** - Email service
- **Vercel Blob** - File storage
- **Vercel Functions** - Serverless functions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **MongoDB** account (MongoDB Atlas recommended)
- **Gmail** account (for email notifications)
- **Vercel** account (for deployment and blob storage)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd feedback_system
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

   # Email Configuration (Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-specific-password

   # Vercel Blob Storage (for file uploads)
   BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
   ```

   **Important Notes:**
   - For Gmail, use an [App-Specific Password](https://support.google.com/accounts/answer/185833?hl=en), not your regular password
   - Get your Vercel Blob token from your [Vercel Dashboard](https://vercel.com/dashboard)

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
feedback_system/
├── public/
│   └── asset/
│       ├── background.jpg      # Background images
│       └── logo.png            # Company logo
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── referrals/      # Referral submission API
│   │   │   ├── survey/         # Survey submission API
│   │   │   ├── upload/         # File upload API
│   │   │   └── userdetails/    # User details API
│   │   ├── contact/            # Contact page
│   │   ├── survey/             # Survey page
│   │   ├── thank-you/          # Thank you page
│   │   ├── user-details/       # User details form
│   │   ├── globals.css         # Global styles
│   │   ├── layout.js           # Root layout
│   │   └── page.js             # Home page (redirects)
│   ├── components/
│   │   └── ToastProvider.jsx   # Toast notification provider
│   ├── lib/
│   │   ├── db.js               # MongoDB connection
│   │   ├── emailService.js     # Email service with templates
│   │   └── surveyUtils.js      # Survey data formatting utilities
│   └── models/
│       └── Survey.js           # Mongoose schema
├── .env.local                  # Environment variables (create this)
├── package.json
├── next.config.mjs
├── tailwind.config.js
└── README.md
```

## 🔌 API Endpoints

### User Details
- **POST** `/api/userdetails` - Create user profile and draft survey

### Survey
- **POST** `/api/survey` - Submit survey responses
- **GET** `/api/survey?userEmail=email&status=submitted` - Retrieve surveys

### Referrals
- **POST** `/api/referrals` - Submit referral information

### Upload
- **POST** `/api/upload` - Upload profile picture to Vercel Blob

## 📝 Survey Questions

The system includes 15 questions covering various aspects of the EGA program:

1. **Q1-Q11**: Rating scales (1-10) for program modules:
   - Overall recommendation
   - Change or Die
   - Building Trust with Stakeholders
   - Dynamic Communication (DISC)
   - Seven Stages of Growth
   - Project Charters
   - Strategic Planning
   - Strategy Execution Calendar
   - Emotional Intelligence (EQ)
   - Company Culture
   - Talent Management

2. **Q12**: Referral interest (Yes/No)
3. **Q13**: Testimonial permission (Multiple choice)
4. **Q14**: Case study follow-up (Yes/No)
5. **Q15**: Additional comments (Optional text)

## 🎨 UI Features

- **Draggable Progress Indicator**: Desktop users can drag the circular progress widget
- **Responsive Grid Layouts**: Questions adapt to screen size
- **Visual Feedback**: Color-coded responses with smooth transitions
- **Validation Messages**: Clear error messages for incomplete submissions
- **Confetti Animation**: Celebration effect on successful submission
- **Modern Design**: Clean interface with consistent branding

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - Add all variables from `.env.local` in the Vercel dashboard
   - Navigate to Project Settings → Environment Variables

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be live at `https://your-project.vercel.app`

### Vercel Blob Setup

Enable Vercel Blob storage for file uploads:
```bash
vercel link
vercel blob create
```

## 🔒 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `EMAIL_USER` | Gmail address for sending emails | `your-email@gmail.com` |
| `EMAIL_PASS` | Gmail app-specific password | `xxxx xxxx xxxx xxxx` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token | `vercel_blob_rw_...` |

## 🧪 Development

### Available Scripts

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📊 Database Schema

The survey data is stored with the following structure:

```javascript
{
  fullName: String,
  email: String,
  phone: String,
  address: String,
  company: String,
  profilePicture: String,
  questionsAndAnswers: [
    {
      questionId: String,
      question: String,
      questionType: String, // 'scale', 'yes-no', 'multiple-choice', 'text-input'
      answer: String
    }
  ],
  referrals: [
    {
      name: String,
      email: String,
      submittedAt: Date
    }
  ],
  status: String, // 'draft' or 'submitted'
  submittedAt: Date,
  completedAt: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 📧 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ using Next.js and Tailwind CSS**
