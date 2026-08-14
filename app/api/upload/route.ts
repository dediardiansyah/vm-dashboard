import { NextResponse } from 'next/server'
import { createApiResponse, handleApiError, ApiError } from '@/lib/api-response'
import { API_ERRORS } from '@/lib/constants/errors'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string

    if (!file) {
      throw new ApiError(
        API_ERRORS.USER.VALIDATION_ERROR,
        'No file uploaded'
      )
    }

    // Create unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${uuidv4()}-${file.name}`
    
    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', folder)
    fs.mkdirSync(uploadDir, { recursive: true })
    
    // Write file
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)
    
    // Return public URL
    const url = `/uploads/${folder}/${filename}`
    
    return NextResponse.json(createApiResponse({ url }))
  } catch (error) {
    return handleApiError(error)
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}