import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        const formdata = await request.formData();
        const file = formdata.get("file") as File;

        if (!file) {
            console.log("No file uploaded");
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ success: false, message: "Invalid file type. Only images are allowed." }, { status: 400 });
        }

        console.log("File Details : ", {
            name: file.name,
            size: file.size,
            type: file.type
        });

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "centuryblog/uploads",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        const result = uploadResponse as any;

        return NextResponse.json({
            success: true,
            url: result.secure_url,
            fileName: result.public_id,
            size: file.size,
            type: file.type,
            message: "File uploaded successfully",
        }, {
            status: 200
        });

    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ success: false, message: "Error uploading file" }, { status: 500 });
    }
}


export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const fileName = searchParams.get("fileName");

        if (!fileName) {
            return NextResponse.json({ success: false, message: "File name is required" }, { status: 400 });
        }

        // Delete from Cloudinary using public_id
        await cloudinary.uploader.destroy(fileName);

        console.log(`File deleted from Cloudinary: ${fileName}`);

        return NextResponse.json({ success: true, message: "File deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error deleting file: ", error);
        return NextResponse.json({
            success: false,
            message: "Error deleting file"
        }, { status: 500 });
    }

}