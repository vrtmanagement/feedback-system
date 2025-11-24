'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { formatSurveyData } from '@/lib/surveyUtils'
import { toast } from 'react-toastify'

const Page = () => {
  const router = useRouter()
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
    q8: '',
    q9: '',
    q10: ''
  })
  const [loading, setLoading] = useState(false)
  const [fabPosition, setFabPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const questions = [
    {
      id: 'q1',
      question: 'How satisfied are you with our product/service?',
      options: [
        'Very Satisfied',
        'Satisfied',
        'Neutral',
        'Dissatisfied'
      ]
    },
    {
      id: 'q2',
      question: 'What features do you find most valuable?',
      options: [
        'User Interface',
        'Performance & Speed',
        'Customer Support',
        'Pricing & Value'
      ]
    },
    {
      id: 'q3',
      question: 'How likely are you to recommend us to others?',
      options: [
        'Very Likely',
        'Likely',
        'Unlikely',
        'Very Unlikely'
      ]
    },
    {
      id: 'q4',
      question: 'What improvements would you like to see?',
      options: [
        'Better User Experience',
        'More Features',
        'Lower Pricing',
        'Better Documentation'
      ]
    },
    {
      id: 'q5',
      question: 'How would you rate our customer support?',
      options: [
        'Excellent',
        'Good',
        'Average',
        'Poor'
      ]
    },
    {
      id: 'q6',
      question: 'What challenges have you faced while using our product?',
      options: [
        'Learning Curve',
        'Technical Issues',
        'Limited Features',
        'No Major Challenges'
      ]
    },
    {
      id: 'q7',
      question: 'How does our product compare to competitors?',
      options: [
        'Much Better',
        'Better',
        'Similar',
        'Worse'
      ]
    },
    {
      id: 'q8',
      question: 'What additional features would you like us to add?',
      options: [
        'Advanced Analytics',
        'Mobile App',
        'Integration Options',
        'Customization Tools'
      ]
    },
    {
      id: 'q9',
      question: 'How would you describe your overall experience?',
      options: [
        'Excellent',
        'Good',
        'Average',
        'Poor'
      ]
    },
    {
      id: 'q10',
      question: 'Any additional comments or feedback?',
      options: [] // Empty array indicates this is a text input question
    }
  ]

  const handleOptionChange = (id, value) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get surveyId and email from localStorage
      const surveyId = localStorage.getItem('surveyId')
      const email = localStorage.getItem('userEmail')

      if (!surveyId && !email) {
        toast.info('Please fill user details first', )
        setLoading(false)
        router.push('/user-details')
        return
      }

      // Format the survey data - includes all 10 questions with their answers
      const questionsAndAnswers = formatSurveyData(answers, questions)
      
      console.log('Submitting survey for user:', email)
      console.log('Survey ID:', surveyId)
      console.log('Questions and Answers:', questionsAndAnswers)

      // Submit to API - this will update the existing draft survey with questions and answers
      // The survey is linked to the user via surveyId or email
      const response = await axios.post('/api/survey', {
        questionsAndAnswers,
        surveyId,
        email
      })

      if (response.data.success) {
        console.log('Survey submitted successfully for:', response.data.userEmail)
        toast.success('Survey submitted successfully!')
        // Navigate to thank you page
        router.push('/thank-you')
      }
    } catch (err) {
      console.error('Error submitting survey:', err)
      toast.error(
        err.response?.data?.error || 
        err.message || 
        'Failed to submit survey. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const answeredCount = Object.values(answers).filter(answer => answer !== '').length
  const progress = (answeredCount / questions.length) * 100

  // Initialize FAB position to bottom-right on mount
  useEffect(() => {
    const updateFabPosition = () => {
      setFabPosition({ 
        x: Math.max(window.innerWidth - 120, 0), 
        y: Math.max(window.innerHeight - 120, 0) 
      })
    }
    updateFabPosition()
    window.addEventListener('resize', updateFabPosition)
    return () => window.removeEventListener('resize', updateFabPosition)
  }, [])

  // Handle drag start
  const handleDragStart = (e) => {
    e.preventDefault()
    setIsDragging(true)
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left - 45, // 45 is half of FAB width (90px)
      y: e.clientY - rect.top - 45
    })
  }

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Attach global mouse events for dragging
  useEffect(() => {
    if (!isDragging) return

    const handleDrag = (e) => {
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y
      
      // Keep FAB within screen bounds
      const maxX = window.innerWidth - 90
      const maxY = window.innerHeight - 90
      
      setFabPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }

    window.addEventListener('mousemove', handleDrag)
    window.addEventListener('mouseup', handleDragEnd)
    
    return () => {
      window.removeEventListener('mousemove', handleDrag)
      window.removeEventListener('mouseup', handleDragEnd)
    }
  }, [isDragging, dragOffset])

  return (
    <div className="min-h-screen bg-white">
      {/* Centered Header with Logo */}
      <div className="pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center">
          <img 
            src="/asset/logo.png" 
            alt="Logo" 
            className="h-14 w-auto object-contain mb-4" 
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-12">
        {/* Page Title */}
        <div className="mb-8 text-center px-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mt-2">Feedback Survey</h1>
          <p className="text-gray-600 text-sm md:text-base mt-2">Your opinion matters to us. Please take a few minutes to share your feedback.</p>
        </div>

        {/* Survey Questions Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((item, index) => (
            <div key={item.id}>
              <div className="flex items-start mb-3">
                <span className="inline-flex items-center justify-center w-7 h-7 bg-red-600 text-white rounded-full text-sm font-semibold mr-3 flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <label className="flex-1 text-base font-medium text-black">
                  <span className="text-xl">
                    {item.question}</span>
                </label>
              </div>
              <div className="ml-10">
                {item.id === 'q10' ? (
                  // Text input for last question
                  <textarea
                    name={item.id}
                    value={answers[item.id]}
                    onChange={(e) => handleOptionChange(item.id, e.target.value)}
                    placeholder="Enter your additional comments or feedback..."
                    rows={5}
                    className={`w-full px-5 py-4 bg-[#FAF9F6] border-2 rounded-lg text-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all shadow-sm resize-none ${
                      answers[item.id] 
                        ? 'border-red-600' 
                        : 'border-transparent'
                    }`}
                  />
                ) : (
                  // Radio buttons for other questions
                  <div className="space-y-3">
                    {item.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`flex items-center px-4 md:px-5 py-3 md:py-4 rounded-lg cursor-pointer transition-all duration-200 ${
                          answers[item.id] === option
                            ? 'bg-red-50 border-2 border-red-600 shadow-sm'
                            : 'bg-[#FAF9F6] border-2 border-transparent hover:border-red-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={item.id}
                          value={option}
                          checked={answers[item.id] === option}
                          onChange={(e) => handleOptionChange(item.id, e.target.value)}
                          className="w-5 h-5 accent-red-600 cursor-pointer flex-shrink-0"
                          style={{
                            accentColor: '#DC2626'
                          }}
                        />
                        <span className={`ml-3 md:ml-4 text-base md:text-lg ${
                          answers[item.id] === option ? 'text-red-900 font-medium' : 'text-black'
                        }`}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Action Button */}
          <div className="flex justify-end pt-10">
            <button
              type="submit"
              className="px-8 md:px-12 py-4 md:py-5 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-all font-semibold shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2 text-base md:text-lg"
              disabled={answeredCount < questions.length - 1 || loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Survey
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <p className="text-center text-base text-gray-500 mt-8">
          All responses are confidential and will be used to improve our services.
        </p>
      </div>

      {/* Floating Action Button - Progress Indicator (Draggable) - Desktop Only */}
      <div 
        className="fixed z-50 cursor-move select-none hidden lg:block"
        style={{ 
          left: `${fabPosition.x}px`, 
          top: `${fabPosition.y}px`,
          transform: 'translate(0, 0)'
        }}
        onMouseDown={handleDragStart}
      >
        <div className="bg-red-600 text-white rounded-full shadow-2xl p-5 flex flex-col items-center justify-center w-[90px] h-[90px] hover:bg-red-700 transition-colors relative">
          {/* Progress Ring Background */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          {/* Content */}
          <div className="relative z-10 text-center pointer-events-none">
            <div className="text-3xl font-bold">{answeredCount}</div>
            <div className="text-xs font-medium mt-1">of {questions.length}</div>
            <div className="text-xs opacity-90 mt-0.5">{Math.round(progress)}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page