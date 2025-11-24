'use client'

import React, { useState } from 'react'

const Page = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    inquiryReason: '',
    projectBudget: '',
    projectDetails: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const budgetOptions = [
    'Less than $3K',
    '$3K-$5K',
    '$5K-$10K',
    '$10K-20K',
    'More than 20K'
  ]

  const inquiryReasons = [
    'General Inquiry',
    'Project Consultation',
    'Partnership',
    'Support',
    'Other'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError(null)
  }

  const handleBudgetSelect = (budget) => {
    setFormData(prev => ({
      ...prev,
      projectBudget: budget
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log('Form submitted:', formData)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitted(true)
    } catch (err) {
      console.error('Error submitting form:', err)
      setError('Failed to submit form. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-red-600 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
            {/* Left Section - Information */}
            <div className="flex flex-col justify-center">
              <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
                Let's Make Problems Nervous.
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Tell us what keeps you stuck we'll turn it into your next competitive advantage.
              </p>
              
              {/* Illustration */}
              <div className="mt-8">
                <svg 
                  className="w-full max-w-md h-auto" 
                  viewBox="0 0 400 300" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Person */}
                  <circle cx="150" cy="120" r="40" stroke="black" strokeWidth="3" fill="white"/>
                  {/* Body */}
                  <rect x="130" y="160" width="40" height="60" stroke="black" strokeWidth="3" fill="white"/>
                  {/* Arms */}
                  <line x1="130" y1="180" x2="100" y2="200" stroke="black" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="170" y1="180" x2="200" y2="150" stroke="black" strokeWidth="3" strokeLinecap="round"/>
                  {/* Legs */}
                  <line x1="140" y1="220" x2="120" y2="260" stroke="black" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="160" y1="220" x2="180" y2="260" stroke="black" strokeWidth="3" strokeLinecap="round"/>
                  {/* Laptop */}
                  <rect x="220" y="200" width="120" height="80" rx="5" stroke="black" strokeWidth="3" fill="white"/>
                  <rect x="230" y="210" width="100" height="60" fill="gray-200"/>
                  {/* Paper Airplane */}
                  <path d="M200 150 L230 140 L220 160 Z" fill="black" stroke="black" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            {/* Right Section - Form */}
            <div className="flex flex-col justify-center">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-black mb-4">Thank You!</h2>
                  <p className="text-gray-600">We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Full name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-0 py-3 bg-gray-50 border-0 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none focus:ring-0 text-black transition-colors"
                    />
                  </div>

                  {/* Email and Phone Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-0 py-3 bg-gray-50 border-0 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none focus:ring-0 text-black transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-0 py-3 bg-gray-50 border-0 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none focus:ring-0 text-black transition-colors"
                      />
                    </div>
                  </div>

                  {/* Company and Inquiry Reason Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Company name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full px-0 py-3 bg-gray-50 border-0 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none focus:ring-0 text-black transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Inquiry Reason <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="inquiryReason"
                          value={formData.inquiryReason}
                          onChange={handleInputChange}
                          required
                          className="w-full px-0 py-3 bg-gray-50 border-0 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none focus:ring-0 text-black appearance-none transition-colors pr-8"
                        >
                          <option value="">Select reason</option>
                          {inquiryReasons.map((reason) => (
                            <option key={reason} value={reason}>{reason}</option>
                          ))}
                        </select>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Budget */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-3">
                      Project budget <span className="text-red-600">*</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {budgetOptions.map((budget) => (
                        <button
                          key={budget}
                          type="button"
                          onClick={() => handleBudgetSelect(budget)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            formData.projectBudget === budget
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-white text-black border-gray-300 hover:border-red-600'
                          }`}
                        >
                          {budget}
                        </button>
                      ))}
                    </div>
                    {!formData.projectBudget && (
                      <p className="text-xs text-red-600 mt-1">Please select a budget range</p>
                    )}
                  </div>

                  {/* Project Details */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Project details <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      name="projectDetails"
                      value={formData.projectDetails}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none focus:ring-0 text-black resize-none transition-colors"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !formData.projectBudget}
                    className="w-full px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        Let's Connect
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-8 md:px-12 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-black mb-2">Start a project</h3>
                <a href="mailto:sales@orfactor.com" className="text-gray-600 hover:text-red-600 transition-colors">
                  sales@orfactor.com
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black mb-2">Partner with us</h3>
                <a href="mailto:sales@orfactor.com" className="text-gray-600 hover:text-red-600 transition-colors">
                  sales@orfactor.com
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black mb-2">Work with us</h3>
                <a href="mailto:career@orfactor.com" className="text-gray-600 hover:text-red-600 transition-colors">
                  career@orfactor.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page

