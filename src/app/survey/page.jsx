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
    q10: '',
    q11: '',
    q12: '',
    q13: '',
    q14: ''
  })
  const [loading, setLoading] = useState(false)
  const [fabPosition, setFabPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const questions = [
    {
      id: 'q1',
      question: 'On a scale of 1–10, how likely are you to recommend the EGA program to a friend or colleague?',
      type: 'scale',
      scale: { min: 1, max: 10, minLabel: 'Least Likely', maxLabel: 'Most Likely' }
    },
    {
      id: 'q2',
      question: 'On a scale of 1–10, how effective was the module Change or Die for helping you in your business?',
      type: 'scale',
      scale: { min: 1, max: 10, minLabel: 'Least Effective', maxLabel: 'Very Effective' }
    },
    {
      id: 'q3',
      question: 'On a scale of 1–10, how effective was the module How to Build Trust with Stakeholders for helping you in your business?',
      type: 'scale',
      scale: { min: 1, max: 10, minLabel: 'Least Effective', maxLabel: 'Very Effective' }
    },
    {
      id: 'q4',
      question: 'On a scale of 1–10, how effective was the module Dynamic Communication (DISC and Platinum Rule) for helping you in your business?',
      type: 'scale',
      scale: { min: 1, max: 10, minLabel: 'Least Effective', maxLabel: 'Very Effective' }
    },
    {
      id: 'q5',
      question: 'On a scale of 1–10, how effective was the module Seven Stages of Growth for helping you in your business?',
      type: 'scale',
      scale: { min: 1, max: 10, minLabel: 'Least Effective', maxLabel: 'Very Effective' }
    },
    {
      id: 'q6',
      question: 'On a scale of 1–10, how effective was the module Project Charters for helping you in your business?',
      type: 'scale',
      scale: { min: 1, max: 10, minLabel: 'Least Effective', maxLabel: 'Very Effective' }
    },
    {
      id: 'q7',
      question: 'On a scale of 1–10, how effective was the module 1- and 3-Year Strategic Plan for helping you in your business?',
      type: 'scale',
      scale: { min: 1, max: 10, minLabel: 'Least Effective', maxLabel: 'Very Effective' }
    },
    {
      id: 'q8',
      question: 'On a scale of 1–10, how effective was the module Growth as a Process – Strategy Execution Calendar for helping you in your business?',
      type: 'scale',
      scale: { min: 1, max: 10, minLabel: 'Least Effective', maxLabel: 'Very Effective' }
    },
    {
      id: 'q9',
      question: 'On a scale of 1–10, how effective was the module Emotional Intelligence (EQ) for helping you in your business?',
      type: 'scale',
      scale: { min: 1, max: 10, minLabel: 'Least Effective', maxLabel: 'Very Effective' }
    },
    {
      id: 'q10',
      question: 'On a scale of 1–10, how effective was the module Building Your Company Culture for helping you in your business?',
      type: 'scale',
      scale: { min: 1, max: 10, minLabel: 'Least Effective', maxLabel: 'Very Effective' }
    },
    {
      id: 'q11',
      question: 'On a scale of 1–10, how effective was the module Talent Management – Foundations for Recruiting for helping you in your business? ?',
      type: 'scale', scale: { min: 1, max: 10, minLabel: 'Least Effective', maxLabel: 'Very Effective' }
    },
    {
      id: 'q12',
      question: 'Would you like to refer someone who could benefit from EGA Program?',
      type: 'yesno',
      options: ['Yes', 'No']
    },
    {
      id: 'q13',
      question: 'May we use your feedback for marketing as a testimonial?',
      type: 'choice',
      options: [
        { value: 'Yes, with my name and company', label: 'A' },
        { value: 'Yes, but anonymized (no name/company shown)', label: 'B' },
        { value: 'No', label: 'C' },
        { value: 'Other', label: 'D' }
      ]
    },
    {
      id: 'q14',
      question: 'Can we contact you for a short follow-up case study?',
      type: 'yesno',
      options: ['Yes', 'No']
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
        toast.info('Please fill user details first',)
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
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mt-2"
          >EGA™ Participant Feedback Survey</h1>
          <p className="text-gray-600 text-sm md:text-base mt-2">Your opinion matters to us. Please take a few minutes to share your feedback.</p>
        </div>

        {/* Survey Questions Section */}
        <form onSubmit={handleSubmit} className="space-y-10">
          {questions.map((item, index) => (
            <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-start mb-4">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full text-sm font-semibold mr-3 flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <label className="flex-1 text-base font-medium text-black">
                  <span className="text-xl">
                    {item.question} <span className="text-red-600">*</span>
                  </span>
                </label>
              </div>
              <div className="ml-11">
                {item.type === 'text' ? (
                  // Text input for feedback question
                  <textarea
                    name={item.id}
                    value={answers[item.id]}
                    onChange={(e) => handleOptionChange(item.id, e.target.value)}
                    placeholder="Enter your additional comments or feedback..."
                    rows={5}
                    className={`w-full px-5 py-4 bg-[#FAF9F6] border-2 rounded-lg text-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all shadow-sm resize-none ${answers[item.id]
                      ? 'border-red-600'
                      : 'border-transparent'
                      }`}
                  />
                ) : item.type === 'scale' ? (
                  // Scale rating (1-10)
                  <div className="space-y-4">
                    {/* Scale buttons - 2 rows on mobile (5-5), 1 row on desktop */}
                    <div className="grid grid-cols-5 lg:grid-cols-10 gap-2 lg:gap-3">
                      {Array.from({ length: item.scale.max - item.scale.min + 1 }, (_, i) => {
                        const value = item.scale.min + i
                        const isSelected = answers[item.id] === String(value)
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleOptionChange(item.id, String(value))}
                            className={`
                              aspect-square flex items-center justify-center rounded-lg text-lg md:text-xl font-semibold
                              transition-all duration-200 border-2
                              ${isSelected
                                ? 'bg-red-600 text-white border-red-600 shadow-md scale-105'
                                : 'bg-[#FAF9F6] text-black border-gray-200 hover:border-red-300 hover:bg-red-50'
                              }
                            `}
                          >
                            {value}
                          </button>
                        )
                      })}
                    </div>
                    {/* Labels */}
                    <div className="flex justify-between text-sm md:text-base text-gray-600 px-1">
                      <span className="text-red-400 font-medium">{item.scale.minLabel}</span>
                      <span className="text-red-600 font-medium">{item.scale.maxLabel}</span>
                    </div>
                  </div>
                ) : item.type === 'yesno' ? (
                  // Yes/No with thumbs up/down
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                      {item.options.map((option) => {
                        const isSelected = answers[item.id] === option
                        const isYes = option === 'Yes'
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleOptionChange(item.id, option)}
                            className={`
                              relative flex flex-col items-center justify-center p-8 rounded-xl
                              transition-all duration-200 border-2
                              ${isSelected
                                ? 'bg-red-50 border-red-600 shadow-md'
                                : 'bg-[#FAF9F6] border-gray-200 hover:border-red-300'
                              }
                            `}
                          >
                            {/* Icon */}
                            <div className={`mb-4 ${isSelected ? 'text-red-600' : 'text-red-500'}`}>
                              {isYes ? (
                                // Thumbs up icon
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                </svg>
                              ) : (
                                // Thumbs down icon
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                                </svg>
                              )}
                            </div>
                            {/* Text */}
                            <span className={`text-xl font-semibold ${isSelected ? 'text-red-600' : 'text-gray-700'}`}>
                              {option}
                            </span>
                            {/* Badge */}
                            <div className={`
                              absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center
                              text-white font-bold text-lg
                              ${isSelected ? 'bg-red-600' : 'bg-gray-400'}
                            `}>
                              {option.charAt(0).toUpperCase()}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : item.type === 'choice' ? (
                  // Multiple choice with letter badges
                  <div className="space-y-3 max-w-2xl">
                    {item.options.map((option) => {
                      const isSelected = answers[item.id] === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleOptionChange(item.id, option.value)}
                          className={`
                            relative w-full flex items-center gap-4 px-6 py-4 rounded-xl
                            transition-all duration-200 border-2 text-left
                            ${isSelected
                              ? 'bg-red-50 border-red-600 shadow-md'
                              : 'bg-[#FAF9F6] border-gray-200 hover:border-red-300'
                            }
                          `}
                        >
                          {/* Letter Badge - now on left */}
                          <div className={`
                            flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                            text-white font-bold text-lg
                            ${isSelected ? 'bg-red-600' : 'bg-red-500'}
                          `}>
                            {option.label}
                          </div>
                          {/* Text */}
                          <span className={`text-base md:text-lg flex-1 ${isSelected ? 'text-red-600 font-medium' : 'text-gray-800'}`}>
                            {option.value}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  // Radio buttons for other question types (if any)
                  <div className="space-y-3">
                    {item.options?.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`flex items-center px-4 md:px-5 py-3 md:py-4 rounded-lg cursor-pointer transition-all duration-200 ${answers[item.id] === option
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
                        <span className={`ml-3 md:ml-4 text-base md:text-lg ${answers[item.id] === option ? 'text-red-900 font-medium' : 'text-black'
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
          <div className="space-y-4 pt-10">
            {answeredCount < questions.length && (
              <div className="flex items-center justify-end gap-2 text-red-600 text-sm font-medium">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Please answer all {questions.length - answeredCount} remaining question{questions.length - answeredCount !== 1 ? 's' : ''} to submit</span>
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-12 py-5 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-all font-semibold shadow-lg hover:shadow-xl disabled:bg-white disabled:cursor-not-allowed disabled:shadow-none disabled:text-red-600 disabled:border-3 disabled:border-red-600 flex items-center gap-2 text-lg"
                disabled={answeredCount < questions.length || loading}
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
          </div>
        </form>

        {/* Footer Note */}
        <div className="mt-8 space-y-3">
          <p className="text-center text-base text-gray-500">
            All responses are confidential and will be used to improve our services.
          </p>
        </div>
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