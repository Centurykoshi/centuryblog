
            // Trigger revalidation only when status changes or when publishing
            const statusChanged = input.status && input.status !== existingDocument.status;
            if (statusChanged) {
                try {
                    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
                    await fetch(`${baseUrl}/api/revalidate?secret=${process.env.REVALIDATION_SECRET}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            slug: finalSlug,
                            paths: ['/', '/Posts']
                        }),
                    });
                } catch (error) {
                    console.error('Revalidation failed:', error);
                    // Don't throw error, just log it - the update was successful
                }
            }
