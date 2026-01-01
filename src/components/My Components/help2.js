 try {
    // Start progress
    onProgress?.({ progress: 10 })

    // Create FormData for upload
    const formData = new FormData()
    formData.append('file', file)

    onProgress?.({ progress: 30 })

    // Upload to your API endpoint
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
      signal: abortSignal
    })

    onProgress?.({ progress: 70 })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Upload failed')
    }