import connectDB from '@/lib/db'
import Survey from '@/models/Survey'
import { NextResponse } from 'next/server'
import { sendThankYouEmail } from '@/lib/emailService'
import { waitUntil } from '@vercel/functions'

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()
    const { questionsAndAnswers, surveyId, email } = body

    // Validate required fields
    if (!questionsAndAnswers || !Array.isArray(questionsAndAnswers) || questionsAndAnswers.length === 0) {
      return NextResponse.json(
        { error: 'Questions and answers array is required' },
        { status: 400 }
      )
    }

    // Validate that 14-15 questions are submitted (q15 is optional)
    if (questionsAndAnswers.length < 14 || questionsAndAnswers.length > 15) {
      return NextResponse.json(
        { error: `Expected 14-15 questions. Received ${questionsAndAnswers.length} questions.` },
        { status: 400 }
      )
    }

    // Validate that first 14 questions (q1-q14) have required fields and non-empty answers
    // q15 is optional and can be empty
    const requiredQuestions = questionsAndAnswers.filter(q => q.questionId !== 'q15')
    const invalidQuestions = requiredQuestions.filter(q =>
      !q.questionId || !q.question || q.answer === undefined || q.answer === ''
    )

    if (invalidQuestions.length > 0) {
      return NextResponse.json(
        { error: 'All required questions (q1-q14) must have questionId, question, and non-empty answer' },
        { status: 400 }
      )
    }

    // Validate optional question (q15) has required structure even if answer is empty
    const optionalQuestion = questionsAndAnswers.find(q => q.questionId === 'q15')
    if (optionalQuestion && (!optionalQuestion.questionId || !optionalQuestion.question)) {
      return NextResponse.json(
        { error: 'Optional question (q15) must have questionId and question fields' },
        { status: 400 }
      )
    }

    // Try to find existing draft survey by surveyId or email
    // This finds the survey that was created when user filled user details
    let survey = null
    if (surveyId) {
      survey = await Survey.findById(surveyId)
    } else if (email) {
      survey = await Survey.findOne({
        email: email.toLowerCase(),
        status: 'draft'
      })
    }

    if (survey) {
      // Update the existing draft survey with questions and answers
      // This is the second step - questions and answers are stored in the same survey document
      // that was created in the first step (user details)
      survey.questionsAndAnswers = questionsAndAnswers
      survey.status = 'submitted'
      survey.submittedAt = new Date()
      survey.completedAt = new Date()

      const savedSurvey = await survey.save()

      // Send thank you email asynchronously (non-blocking)
      waitUntil(

        sendThankYouEmail(savedSurvey).then(result => {
          if (result.success) {
            console.log(`📧 Email sent successfully to ${savedSurvey.email}`)
          } else {
            console.error(`📧 Email failed for ${savedSurvey.email}:`, result.error)
          }
        }).catch(error => {
          console.error(`📧 Email error for ${savedSurvey.email}:`, error)
        })
      
      )

      return NextResponse.json(
        {
          success: true,
          message: 'Survey submitted successfully',
          surveyId: savedSurvey._id,
          userEmail: savedSurvey.email,
          fullName: savedSurvey.fullName
        },
        { status: 200 }
      )
    }

    // If no draft survey found, return error (user should fill user details first)
    return NextResponse.json(
      { error: 'No draft survey found. Please fill user details first.' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error saving survey:', error)
    return NextResponse.json(
      { error: 'Failed to save survey', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('userEmail')
    const status = searchParams.get('status')

    // Build query
    const query = {}
    if (userEmail) query.email = userEmail.toLowerCase()
    if (status) query.status = status

    const surveys = await Survey.find(query)
      .sort({ submittedAt: -1 })
      .limit(100)

    return NextResponse.json(
      { success: true, surveys },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching surveys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch surveys', details: error.message },
      { status: 500 }
    )
  }
}

