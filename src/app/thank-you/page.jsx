'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'

const Page = () => {
  const router = useRouter()
  const [referralData, setReferralData] = useState({
    name: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // NEW: Text animation states
  const [visibleChars, setVisibleChars] = useState([])
  const [textPhase, setTextPhase] = useState('appearing')
  const [currentAnimatedText, setCurrentAnimatedText] = useState('Thank you')
  
  const firstText = 'AThank you'
  const secondText = 'ARefer others'

  // Confetti explosion on page load - left side only
  useEffect(() => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 180, ticks: 60, zIndex: 0, angle: 45 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Red and black confetti from left side only
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0, 0.3), y: Math.random() * 0.5 + 0.2 },
        colors: ['#DC2626', '#000000', '#FFFFFF']
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  // NEW: Text animation effect
  useEffect(() => {
    let interval = null
    let timeout = null
    
    if (textPhase === 'appearing') {
      // Reset visible chars and set current text
      setVisibleChars([])
      setCurrentAnimatedText(firstText)
      
      // Small delay to ensure state is reset before starting animation
      timeout = setTimeout(() => {
        let index = 0
        interval = setInterval(() => {
          if (index < firstText.length) {
            setVisibleChars(prev => [...prev, firstText[index]])
            index++
          } else {
            clearInterval(interval)
            setTimeout(() => setTextPhase('disappearing'), 2000)
          }
        }, 100)
      }, 50)
    } 
    else if (textPhase === 'disappearing') {
      interval = setInterval(() => {
        setVisibleChars(prev => {
          if (prev.length > 0) {
            return prev.slice(0, -1)
          } else {
            clearInterval(interval)
            setTextPhase('showingSecond')
            return []
          }
        })
      }, 80)
    }
    else if (textPhase === 'showingSecond') {
      // Reset visible chars and set current text
      setVisibleChars([])
      setCurrentAnimatedText(secondText)
      
      // Small delay to ensure state is reset before starting animation
      timeout = setTimeout(() => {
        let index = 0
        interval = setInterval(() => {
          if (index < secondText.length) {
            setVisibleChars(prev => [...prev, secondText[index]])
            index++
          } else {
            clearInterval(interval)
            // After showing second text, wait 2 seconds then restart cycle
            setTimeout(() => {
              setTextPhase('appearing')
            }, 2000)
          }
        }, 100)
      }, 50)
    }
    
    return () => {
      if (interval) clearInterval(interval)
      if (timeout) clearTimeout(timeout)
    }
  }, [textPhase])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setReferralData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleReferralSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const surveyId = localStorage.getItem('surveyId')

      if (!surveyId) {
        toast.error('Survey ID not found. Please complete the survey first.')
        setLoading(false)
        return
      }

      const response = await axios.post('/api/referrals', {
        surveyId,
        name: referralData.name,
        email: referralData.email
      })

      if (response.data.success) {
        setSubmitted(true)
        toast.success('Referral submitted successfully!')
      }
    } catch (err) {
      console.error('Error submitting referral:', err)
      toast.error(
        err.response?.data?.error || 
        'Failed to submit referral. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleAddMoreReferral = () => {
    setSubmitted(false)
    setReferralData({
      name: '',
      email: ''
    })
  }

  return (
    <div 
      className="min-h-screen py-12 px-4 bg-cover bg-center bg-no-repeat bg-fixed relative"
      style={{ backgroundImage: 'url(/asset/background.jpg)' }}
    >
      <div className="absolute inset-0 bg-white/60"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-12">
          {/* Left Section - Thank You Message */}
          <div className="flex flex-col justify-center">
            {/* Success Icon - Animated Red Tick */}
            <div className="mb-6 flex justify-center md:justify-start">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  duration: 0.6
                }}
                className="relative w-32 h-32 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 12,
                    delay: 0.2
                  }}
                  className="absolute inset-0 bg-red-600 rounded-full"
                />
                
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ 
                    scale: [0.8, 1.2, 1.2],
                    opacity: [0.8, 0, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 bg-red-600 rounded-full"
                />
                
                <motion.svg
                  className="w-16 h-16 text-white relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 0.8, delay: 0.4, ease: "easeInOut" },
                    opacity: { duration: 0.3, delay: 0.4 }
                  }}
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.4,
                      ease: "easeInOut"
                    }}
                  />
                </motion.svg>
                
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: Math.cos((i * Math.PI * 2) / 6) * 50,
                      y: Math.sin((i * Math.PI * 2) / 6) * 50
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.6 + i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    className="absolute w-2 h-2 bg-white rounded-full"
                  />
                ))}
              </motion.div>
            </div>
            
            {/* UPDATED: Animated text section */}
            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl font-bold text-red-600">
                {visibleChars.map((char, index) => (
                  <span
                    key={index}
                    className="inline-block animate-bounce-in"
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      animationFillMode: 'both'
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
                {visibleChars.length < currentAnimatedText.length && (
                  <span className="inline-block w-1 h-12 bg-black ml-1 animate-blink" />
                )}
              </h1>
            </div>
            
            <p className="text-xl text-gray-700 mb-4">
              Your feedback has been submitted successfully
            </p>
            <p className="text-lg text-gray-600 mb-8">
              We appreciate you taking the time to share your thoughts with us. Your responses help us improve our services.
            </p>
          </div>

          {/* Right Section - Referral Form */}
          <div className="flex flex-col justify-center">
            <div className="bg-transparent rounded-lg p-6">
              {/* UPDATED: Conditional heading */}
              <h3 className="text-2xl font-semibold text-black mb-2">
                {textPhase === 'showingSecond' ? (
                  'Share the experience!'
                ) : (
                  'Know someone who might be interested?'
                )}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Refer others by sharing their details below.
              </p>

              {submitted ? (
                <div className="space-y-4">
                  <div className="bg-red-600 border border-red-600 text-white px-4 py-3 rounded-md text-center">
                    <p className="font-medium">Thank you for the referral!</p>
                    <p className="text-sm mt-1">We'll reach out to them soon.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMoreReferral}
                    className="w-full px-8 py-4 bg-white border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add More Referral
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReferralSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="referralName" className="block text-xl font-medium text-black mb-2">
                      Full name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="referralName"
                      name="name"
                      value={referralData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-0 py-3 bg-white border-0 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none focus:ring-0 text-black transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="referralEmail" className="block text-xl font-medium text-black mb-2">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="referralEmail"
                      name="email"
                      value={referralData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-0 py-3 bg-white border-0 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none focus:ring-0 text-black transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
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
                        Submit Referral
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
        </div>

        {/* Footer */}
        <div className="border-t border-gray-400 px-8 md:px-12 py-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-black mb-2">Connect with us</h3>
              <a href="mailto:coachrajesh@vrt9.com" className="text-gray-600 hover:text-red-600 transition-colors">
                coachrajesh@vrt9.com
              </a>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-black mb-2">Address</h3>
              <p className="text-gray-600 hover:text-red-600 transition-colors">
                1 Botsford Hill Road PO BOX 150 Botsford, CT 06404
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-black mb-2">Telephone</h3>
              <p className="text-gray-600 hover:text-red-600 transition-colors">
                +1-203-304-1918
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: CSS animations */}
      <style jsx>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(20px);
          }
          50% {
            transform: scale(1.05) translateY(-5px);
          }
          70% {
            transform: scale(0.95) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }

        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  )
}

export default Page