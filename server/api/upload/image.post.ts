import { nanoid } from 'nanoid'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const form = await readMultipartFormData(event)

  if (!form || form.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No file provided',
    })
  }

  const file = form[0]

  if (!file.filename || !file.data) {
    throw createError({
      statusCode: 400,
      message: 'Invalid file',
    })
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type || '')) {
    throw createError({
      statusCode: 400,
      message: 'Only image files are allowed',
    })
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.data.length > maxSize) {
    throw createError({
      statusCode: 400,
      message: 'File size must be less than 5MB',
    })
  }

  try {
    // Generate unique filename
    const ext = file.filename.split('.').pop()
    const uniqueFilename = `${nanoid()}.${ext}`

    // Upload to Cloudflare R2
    // @ts-expect-error - Cloudflare R2 binding
    const bucket = process.env.ASSETS

    if (!bucket) {
      throw new Error('R2 bucket not configured')
    }

    await bucket.put(uniqueFilename, file.data, {
      httpMetadata: {
        contentType: file.type,
      },
    })

    // Return public URL
    // In production, you'd use a custom domain or R2 public bucket URL
    const config = useRuntimeConfig()
    const publicUrl = `https://${config.assetsDomain}/${uniqueFilename}`

    return {
      success: true,
      data: {
        url: publicUrl,
        filename: uniqueFilename,
      },
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to upload file',
    })
  }
})
