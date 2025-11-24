'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'

const Page = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        company: ''
    })
    const [profilePicture, setProfilePicture] = useState(null)
    const [profilePictureUrl, setProfilePictureUrl] = useState(null)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showImagePreview, setShowImagePreview] = useState(false)
    const router = useRouter()
    
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file')
            return
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            toast.error('Image size must be less than 5MB')
            return
        }

        setUploadingImage(true)

        try {
            // Create preview immediately
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfilePicture(reader.result)
            }
            reader.readAsDataURL(file)

            // Upload to Vercel Blob (pass old URL to delete it)
            const formData = new FormData()
            formData.append('file', file)
            if (profilePictureUrl) {
                formData.append('oldUrl', profilePictureUrl)
            }

            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (response.data.success) {
                setProfilePictureUrl(response.data.url)
            }
        } catch (err) {
            console.error('Error uploading image:', err)
            toast.error(
                err.response?.data?.error || 
                'Failed to upload image. Please try again.'
            )
            setProfilePicture(null)
            setProfilePictureUrl(null)
        } finally {
            setUploadingImage(false)
        }
    }

    const handleRemoveImage = async () => {
        // Delete from Vercel Blob if URL exists
        if (profilePictureUrl) {
            try {
                await axios.delete(`/api/upload?url=${encodeURIComponent(profilePictureUrl)}`)
                console.log('Image deleted from blob storage')
            } catch (err) {
                console.error('Error deleting image:', err)
                // Don't show error toast, just log it
            }
        }
        setProfilePicture(null)
        setProfilePictureUrl(null)
    }

    // Check if all required fields are filled
    const isFormValid = formData.fullName.trim() !== '' && 
                       formData.email.trim() !== '' && 
                       formData.company.trim() !== ''

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Get existing surveyId from localStorage if available
            const existingSurveyId = localStorage.getItem('surveyId')
            
            const response = await axios.post('/api/userdetails', {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                company: formData.company,
                profilePicture: profilePictureUrl || null,
                surveyId: existingSurveyId || null
            })

            if (response.data.success) {
                toast.success('User details saved successfully!')
                // Store survey ID in localStorage for use in survey
                if (response.data.surveyId) {
                    localStorage.setItem('surveyId', response.data.surveyId)
                    localStorage.setItem('userEmail', formData.email)
                    localStorage.setItem('userName', formData.fullName)
                }
                // Navigate to survey page
                router.push('/survey')
            }
        } catch (err) {
            console.error('Error submitting form:', err)
            toast.error(
                err.response?.data?.error || 
                err.message || 
                'Failed to save user details. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Centered Header with Logo and Branding */}
            <div className="pt-16 pb-12 px-6">
                <div className="max-w-2xl mx-auto flex flex-col items-center justify-center">
                    <div className="flex items-center space-x-4">
                        <img 
                            src="/asset/logo.png" 
                            alt="Logo" 
                            className="h-14 w-auto object-contain" 
                        />
                    </div>
                </div>
            </div>

            {/* Main Form Content */}
            <div className="max-w-2xl mx-auto px-6 pb-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture Upload - Moved to Top */}
                    <div className="pt-4">
                        <label className="block text-xl font-medium text-black mb-4">
                            Profile photo
                        </label>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Profile Picture Display */}
                            <div className="relative inline-block group flex-shrink-0">
                                <div 
                                    className={`w-40 h-40 md:w-48 md:h-48 bg-[#FAF9F6] border-2 border-gray-200 rounded-lg flex items-center justify-center overflow-hidden ${
                                        profilePicture ? 'cursor-pointer hover:border-red-400 transition-colors' : ''
                                    }`}
                                    onClick={() => profilePicture && setShowImagePreview(true)}
                                >
                                    {profilePicture ? (
                                        <>
                                            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                            {/* Tooltip */}
                                            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <span className="text-white text-sm font-medium px-3 py-2 bg-black/70 rounded-md">
                                                    Click for preview
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <svg className="w-16 h-16 md:w-20 md:h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            
                            {/* Upload Controls */}
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-black mb-2">
                                    Upload your photo
                                </h3>
                                <p className="text-sm text-black mb-4">
                                file size should be less than 5MB
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploadingImage}
                                        className="hidden"
                                        id="profile-upload"
                                    />
                                    <label
                                        htmlFor="profile-upload"
                                        className={`px-6 py-2.5 bg-white border-2 border-red-600 text-red-600 rounded-lg cursor-pointer hover:bg-red-50 transition-colors font-medium text-center ${
                                            uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {uploadingImage ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Uploading...
                                            </span>
                                        ) : (
                                            'Choose image'
                                        )}
                                    </label>
                                    {profilePicture && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            disabled={uploadingImage}
                                            className="px-6 py-2.5 text-black hover:text-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Full Name Field */}
                    <div>
                        <label className="block text-xl font-medium text-black mb-3">
                            Full name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your full name"
                            className="w-full px-5 py-5 bg-[#FAF9F6] border-0 rounded-lg text-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all shadow-sm"
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-xl font-medium text-black mb-3">
                            Company Email Address <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your company email address"
                            className="w-full px-5 py-5 bg-[#FAF9F6] border-0 rounded-lg text-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all shadow-sm"
                        />
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label className="block text-xl font-medium text-black mb-3">
                            Phone number (including country code)
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number with country code"
                            className="w-full px-5 py-5 bg-[#FAF9F6] border-0 rounded-lg text-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all shadow-sm"
                        />
                    </div>

                    {/* Company Field */}
                    <div>
                        <label className="block text-xl font-medium text-black mb-3">
                            What's your current job title at your company? <span className="text-red-600">*</span>
                        </label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                required
                                placeholder="Select an option"
                                className="w-full px-5 py-5 bg-[#FAF9F6] border-0 rounded-lg text-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all shadow-sm pr-12"
                            />
                    </div>

                    {/* Address Field */}
                    <div>
                        <label className="block text-xl font-medium text-black mb-3">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter your address"
                            className="w-full px-5 py-5 bg-[#FAF9F6] border-0 rounded-lg text-lg text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all shadow-sm"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-10">
                        <button
                            type="submit"
                            disabled={loading || !isFormValid}
                            className="px-12 py-5 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-all font-semibold shadow-lg hover:shadow-xl disabled:bg-white disabled:cursor-not-allowed disabled:shadow-none disabled:text-red-600 disabled:border-3 disabled:border-red-600 flex items-center gap-2 text-lg"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Next
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Image Preview Modal */}
            {showImagePreview && profilePicture && (
                <div 
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowImagePreview(false)}
                >
                    <div 
                        className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowImagePreview(false)}
                            className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white p-2 rounded-full transition-colors z-10"
                            aria-label="Close preview"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        {/* Full Size Image */}
                        <img 
                            src={profilePicture} 
                            alt="Profile Preview" 
                            className="w-full h-auto max-h-[90vh] object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Page