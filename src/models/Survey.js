import mongoose from 'mongoose'

const QuestionAnswerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ['scale', 'yes-no', 'multiple-choice', 'text-input'],
    default: 'text-input'
  },
  answer: {
    type: String,
    default: ''
  }
}, { _id: false })

const ReferralSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true })

const SurveySchema = new mongoose.Schema({
  // User information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    trim: true,
    default: ''
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String, // Base64 encoded image or URL
    default: null
  },

  // Questions and answers stored as array
  questionsAndAnswers: {
    type: [QuestionAnswerSchema],
    default: [],
    validate: {
      validator: function (v) {
        // Allow empty array for draft status, require at least one for submitted
        if (this.status === 'draft') {
          return true
        }
        return v && v.length > 0
      },
      message: 'At least one question and answer is required for submitted surveys'
    }
  },

  // Referrals array
  referrals: {
    type: [ReferralSchema],
    default: []
  },
  // Metadata
  completedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'submitted'],
    default: 'submitted'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
})

// Index for faster queries
SurveySchema.index({ email: 1, submittedAt: -1 })
SurveySchema.index({ status: 1 })
SurveySchema.index({ company: 1 })

// Prevent re-compilation during development
const Survey = mongoose.models.Survey || mongoose.model('Survey', SurveySchema)

export default Survey

