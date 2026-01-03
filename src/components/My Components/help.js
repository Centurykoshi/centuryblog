// Utility functions to extract content from Tiptap editor

export function extractFirstHeading(editor: any): string | null {
    try {
        const json = editor.getJSON();
        
        function findFirstHeading(node: any): string | null {
            if (node.type === 'heading' && node.content && node.content.length > 0) {
                // Extract text from heading content
                return node.content
                    .filter((item: any) => item.type === 'text')
                    .map((item: any) => item.text)
                    .join('');
            }
            
            if (node.content && Array.isArray(node.content)) {
                for (const child of node.content) {
                    const heading = findFirstHeading(child);
                    if (heading) return heading;
                }
            }
            
            return null;
        }
        
        return findFirstHeading(json);
    } catch (error) {
        console.error('Error extracting first heading:', error);
        return null;
    }
}

export function extractFirstImage(editor: any): string | null {
    try {
        const json = editor.getJSON();
        
        function findFirstImage(node: any): string | null {
            if (node.type === 'image' && node.attrs && node.attrs.src) {
                return node.attrs.src;
            }
            
            if (node.content && Array.isArray(node.content)) {
                for (const child of node.content) {
                    const image = findFirstImage(child);
                    if (image) return image;
                }
            }
            
            return null;
        }
        
        return findFirstImage(json);
    } catch (error) {
        console.error('Error extracting first image:', error);
        return null;
    }
}

// Alternative: Extract from JSON content directly
export function extractFirstHeadingFromJSON(contentJSON: string): string | null {
    try {
        const content = JSON.parse(contentJSON);
        
        function findFirstHeading(node: any): string | null {
            if (node.type === 'heading' && node.content && node.content.length > 0) {
                return node.content
                    .filter((item: any) => item.type === 'text')
                    .map((item: any) => item.text)
                    .join('');
            }
            
            if (node.content && Array.isArray(node.content)) {
                for (const child of node.content) {
                    const heading = findFirstHeading(child);
                    if (heading) return heading;
                }
            }
            
            return null;
        }
        
        return findFirstHeading(content);
    } catch (error) {
        console.error('Error parsing contentJSON:', error);
        return null;
    }
}

export function extractFirstImageFromJSON(contentJSON: string): string | null {
    try {
        const content = JSON.parse(contentJSON);
        
        function findFirstImage(node: any): string | null {
            if (node.type === 'image' && node.attrs && node.attrs.src) {
                return node.attrs.src;
            }
            
            if (node.content && Array.isArray(node.content)) {
                for (const child of node.content) {
                    const image = findFirstImage(child);
                    if (image) return image;
                }
            }
            
            return null;
        }
        
        return findFirstImage(content);
    } catch (error) {
        console.error('Error parsing contentJSON for image:', error);
        return null;
    }
}