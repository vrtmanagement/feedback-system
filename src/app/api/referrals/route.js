import connectDB from '@/lib/db'
import Survey from '@/models/Survey'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()
    const { surveyId, name, email } = body

    // Validate required fields
    if (!surveyId || !name || !email) {
      return NextResponse.json(
        { error: 'Survey ID, name, and email are required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Find the survey
    const survey = await Survey.findById(surveyId)

    if (!survey) {
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      )
    }

    // Check if referral with this email already exists for this survey
    const existingReferral = survey.referrals.find(
      ref => ref.email.toLowerCase() === email.toLowerCase()
    )

    if (existingReferral) {
      return NextResponse.json(
        { error: 'A referral with this email already exists' },
        { status: 400 }
      )
    }

    // Add new referral to the array
    survey.referrals.push({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      submittedAt: new Date()
    })

    const savedSurvey = await survey.save()

    console.log(`Referral added to survey: ${savedSurvey._id}`)
    console.log(`Total referrals: ${savedSurvey.referrals.length}`)

    return NextResponse.json(
      {
        success: true,
        message: 'Referral added successfully',
        referral: savedSurvey.referrals[savedSurvey.referrals.length - 1],
        totalReferrals: savedSurvey.referrals.length
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error adding referral:', error)
    return NextResponse.json(
      { error: 'Failed to add referral', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const surveyId = searchParams.get('surveyId')

    if (!surveyId) {
      return NextResponse.json(
        { error: 'Survey ID is required' },
        { status: 400 }
      )
    }

    const survey = await Survey.findById(surveyId).select('referrals')

    if (!survey) {
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        referrals: survey.referrals || [],
        totalReferrals: survey.referrals?.length || 0
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching referrals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch referrals', details: error.message },
      { status: 500 }
    )
  }
}

