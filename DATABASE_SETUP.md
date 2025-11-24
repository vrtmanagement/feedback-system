# MongoDB Database Setup

This document explains how to set up and use the MongoDB database for the feedback survey system.

## Prerequisites

1. MongoDB installed locally or a MongoDB Atlas account
2. Node.js and npm installed
3. Mongoose package (already installed)

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
```

For local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/feedback_system
```

### 2. Database Connection

The database connection is handled by `src/lib/db.js`. It uses a caching mechanism to prevent multiple connections during development.

**Usage:**
```javascript
import connectDB from '@/lib/db'

// In an API route or server component
await connectDB()
```

## MongoDB Schema

### Survey Model (`src/models/Survey.js`)

The Survey schema stores questions and answers in array format:

```javascript
{
  userId: String,              // Optional user ID
  userEmail: String,            // Optional user email
  userName: String,            // Optional user name
  questionsAndAnswers: [       // Array of question-answer pairs
    {
      questionId: String,      // e.g., 'q1', 'q2'
      question: String,        // The question text
      answer: String          // The user's answer
    }
  ],
  status: String,              // 'draft' or 'submitted'
  submittedAt: Date,          // When survey was submitted
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

## API Routes

### POST `/api/survey`

Submit a new survey.

**Request Body:**
```json
{
  "questionsAndAnswers": [
    {
      "questionId": "q1",
      "question": "How satisfied are you?",
      "answer": "Very satisfied"
    },
    {
      "questionId": "q2",
      "question": "What features do you like?",
      "answer": "The dashboard"
    }
  ],
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "userId": "optional-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Survey submitted successfully",
  "surveyId": "507f1f77bcf86cd799439011"
}
```

### GET `/api/survey`

Fetch surveys with optional filters.

**Query Parameters:**
- `userEmail` - Filter by user email
- `status` - Filter by status ('draft' or 'submitted')

**Example:**
```
GET /api/survey?userEmail=user@example.com&status=submitted
```

**Response:**
```json
{
  "success": true,
  "surveys": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "questionsAndAnswers": [...],
      "userEmail": "user@example.com",
      "submittedAt": "2024-01-15T10:30:00.000Z",
      ...
    }
  ]
}
```

## Usage Example

### From Frontend (Survey Page)

```javascript
import { formatSurveyData } from '@/lib/surveyUtils'

const handleSubmit = async (e) => {
  e.preventDefault()
  
  // Format the data
  const questionsAndAnswers = formatSurveyData(answers, questions)
  
  // Submit to API
  const response = await fetch('/api/survey', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      questionsAndAnswers,
      userEmail: 'user@example.com',
      userName: 'John Doe'
    })
  })
  
  const data = await response.json()
  if (data.success) {
    router.push('/thank-you')
  }
}
```

## Utility Functions

### `formatSurveyData(answers, questions)`

Converts form data into the database format.

**Location:** `src/lib/surveyUtils.js`

**Example:**
```javascript
const answers = {
  q1: 'Very satisfied',
  q2: 'The dashboard is great'
}

const questions = [
  { id: 'q1', question: 'How satisfied are you?' },
  { id: 'q2', question: 'What features do you like?' }
]

const formatted = formatSurveyData(answers, questions)
// Returns array of { questionId, question, answer } objects
```

## Indexes

The schema includes indexes for:
- `userEmail` and `submittedAt` (for faster user-specific queries)
- `status` (for filtering by status)

These indexes are automatically created when the first document is saved.

