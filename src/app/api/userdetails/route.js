import connectDB from '@/lib/db'
import Survey from '@/models/Survey'
import { NextResponse } from 'next/server'
import { del } from '@vercel/blob'

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()
    const { fullName, email, phone, address, company, profilePicture, surveyId } = body

    // Validate required fields
    if (!fullName || !email || !company) {
      return NextResponse.json(
        { error: 'Full name, email, and company are required fields' },
        { status: 400 }
      )
    }

    let survey
    let oldProfilePictureUrl = null

    // Check if there's an existing draft survey
    if (surveyId) {
      survey = await Survey.findById(surveyId)
      if (survey && survey.status === 'draft') {
        // Store old profile picture URL for deletion
        oldProfilePictureUrl = survey.profilePicture
        
        // Update existing survey
        survey.fullName = fullName
        survey.email = email.toLowerCase()
        survey.phone = phone || ''
        survey.address = address || ''
        survey.company = company
        survey.profilePicture = profilePicture || null
      }
    }

    // If no existing survey found, create new one
    if (!survey) {
      survey = new Survey({
        fullName,
        email: email.toLowerCase(),
        phone: phone || '',
        address: address || '',
        company,
        profilePicture: profilePicture || null,
        questionsAndAnswers: [], // Empty array - will be filled when user completes survey
        status: 'draft' // Will be changed to 'submitted' when survey is completed
      })
    }

    const savedSurvey = await survey.save()

    // Delete old profile picture if it exists and is different from new one
    if (oldProfilePictureUrl && 
        oldProfilePictureUrl !== profilePicture && 
        oldProfilePictureUrl.trim() !== '') {
      try {
        await del(oldProfilePictureUrl)
        console.log('Old profile picture deleted:', oldProfilePictureUrl)
      } catch (deleteError) {
        // Log error but don't fail the save if deletion fails
        console.warn('Failed to delete old profile picture:', deleteError.message)
      }
    }
    
    console.log(`User details saved for: ${savedSurvey.email}, Survey ID: ${savedSurvey._id}, Status: ${savedSurvey.status}`)
    console.log(`Questions and Answers count: ${savedSurvey.questionsAndAnswers.length} (empty array)`)

    return NextResponse.json(
      { 
        success: true, 
        message: 'User details saved successfully',
        surveyId: savedSurvey._id,
        survey: savedSurvey
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving user details:', error)
    
    return NextResponse.json(
      { error: 'Failed to save user details', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const surveyId = searchParams.get('surveyId')

    // Build query
    const query = {}
    if (email) query.email = email.toLowerCase()
    if (surveyId) query._id = surveyId

    const surveys = await Survey.find(query)
      .sort({ createdAt: -1 })
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

