export async function uploadImage(file: File, folder: string): Promise<string> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
  
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
  
      if (!response.ok) {
        throw new Error('Failed to upload image')
      }
  
      const data = await response.json()
      return data.data.url
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }