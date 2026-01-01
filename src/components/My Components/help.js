import { NextResponse } from "next/server";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
    try {
        console.log('📸 Image upload endpoint called');
        
        const formdata = await request.formData();
        const file = formdata.get("file") as File;

        if (!file) {
            console.log("❌ No file uploaded");
            return NextResponse.json({ 
                success: false, 
                message: "No file uploaded" 
            }, { status: 400 });
        }

        if (!file.type.startsWith("image/")) {
            console.log("❌ Invalid file type:", file.type);
            return NextResponse.json({ 
                success: false, 
                message: "Invalid file type. Only images are allowed." 
            }, { status: 400 });
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            console.log("❌ File too large:", file.size);
            return NextResponse.json({
                success: false,
                message: "File too large. Maximum size is 10MB"
            }, { status: 400 });
        }

        console.log('📁 File details:', {
            name: file.name,
            size: file.size,
            type: file.type
        });

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = path.extname(file.name);
        const filename = `${timestamp}-${randomString}${fileExtension}`;

        // Define upload directory
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'images');
        
        // Create directory if it doesn't exist
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
            console.log('📁 Created uploads directory:', uploadsDir);
        }

        // Save file
        const filePath = path.join(uploadsDir, filename);
        await writeFile(filePath, buffer);
        
        console.log('✅ File saved successfully:', filePath);

        // Return public URL
        const publicUrl = `/uploads/images/${filename}`;
        
        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename: filename,
            size: file.size,
            type: file.type,
            message: "Image uploaded successfully"
        }, { status: 200 });

    } catch (error) {
        console.error('❌ Upload error:', error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}