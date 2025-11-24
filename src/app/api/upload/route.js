import { put, del } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const oldUrl = formData.get('oldUrl') // URL of old image to delete

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Delete old image if provided
    if (oldUrl && typeof oldUrl === 'string' && oldUrl.trim() !== '') {
      try {
        await del(oldUrl)
        console.log('Old image deleted:', oldUrl)
      } catch (deleteError) {
        // Log error but don't fail the upload if deletion fails
        console.warn('Failed to delete old image:', deleteError.message)
      }
    }

    // Generate unique filename with user identifier
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const filename = `profile-pictures/${timestamp}-${randomString}.${fileExtension}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
    })

    return NextResponse.json(
      {
        success: true,
        url: blob.url,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE endpoint to remove a blob
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }

    await del(url)
    
    return NextResponse.json(
      { success: true, message: 'Image deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file', details: error.message },
      { status: 500 }
    )
  }
}

