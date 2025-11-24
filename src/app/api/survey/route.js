import connectDB from '@/lib/db'
import Survey from '@/models/Survey'
import { NextResponse } from 'next/server'
import { sendThankYouEmail } from '@/lib/emailService'

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

    // Validate that all questions have required fields
    const invalidQuestions = questionsAndAnswers.filter(q => 
      !q.questionId || !q.question || q.answer === undefined
    )
    
    if (invalidQuestions.length > 0) {
      return NextResponse.json(
        { error: 'All questions must have questionId, question, and answer fields' },
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
      console.log(`Updating survey for user: ${survey.email}, Survey ID: ${survey._id}`)
      console.log(`Previous questions count: ${survey.questionsAndAnswers.length}`)
      
      survey.questionsAndAnswers = questionsAndAnswers
      survey.status = 'submitted'
      survey.submittedAt = new Date()
      survey.completedAt = new Date()
      
      const savedSurvey = await survey.save()
      
      console.log(`Survey updated successfully for user: ${savedSurvey.email}`)
      console.log(`New questions count: ${savedSurvey.questionsAndAnswers.length}`)
      console.log(`Status changed from 'draft' to 'submitted'`)
      
      // Send thank you email asynchronously (non-blocking)
      sendThankYouEmail(savedSurvey).then(result => {
        if (result.success) {
          console.log(`📧 Email sent successfully to ${savedSurvey.email}`)
        } else {
          console.error(`📧 Email failed for ${savedSurvey.email}:`, result.error)
        }
      }).catch(error => {
        console.error(`📧 Email error for ${savedSurvey.email}:`, error)
      })
      
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

