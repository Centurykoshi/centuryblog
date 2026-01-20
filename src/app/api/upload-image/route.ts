
import { error } from "console";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary'
import { resolve } from "path";
import { success } from "zod";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {


    try {


        const formData = await request.formData();
        const file = formData.get("file") as File;


        if (!file) {
            return NextResponse.json({ error: "No File" }, { status: 400 });
        }

        if (!file.type.startsWith("image/")) {

            return NextResponse.json({ error: "Only Images are allowed" }, { status: 400 });

        }

        console.log("File Details :", {
            size: file.size / 1024,
            name: file.name,
            file: file.type,
        });


        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const cloudupload = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                folder: "CenturyBlogs/Uploads",
                resource_type: "image",
                quality: "auto"

            }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            }).end(buffer);
        });

        const result = cloudupload as any;

        return NextResponse.json({
            success: true,
            url: result.secure_url,
            filename: result.public_id,
            type: file.type,
            size: file.size,
            message: "File Uploaded Successfully hehe",
        }, {
            status: 200,
        })

    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ success: false, message: "Error uploading file" }, { status: 500 });
    }

}

export async function DELETE(request: Request) {

    let filename: string | null = null;

    try {


        const { searchParams } = new URL(request.url);

        filename = searchParams.get("filename");

        if (!filename) {
            return NextResponse.json({ error: "Missing FileName" }, { status: 400 });
        }

        await cloudinary.uploader.destroy(filename);

        return NextResponse.json({ success: true, name: filename }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, filename: filename, message: "Failed to delete file" }, { status: 400 });
    }


}