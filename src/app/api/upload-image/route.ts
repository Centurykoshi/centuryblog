import { writeFile, mkdir, unlink } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { existsSync } from "fs";
import { v2 as cloudinary } from "cloudinary";
import { error } from "console";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

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
            size: file.size / 8,
            type: file.type
        })

        // Here we are converting the file to a buffer means binary data as all the files are stored in binary format so here image to binary and storing in bytes and converting buffer to nodejs buffer

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);





        const uploadedResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "centuryblog/uploads",
                    resource_type: "image",
                    quality: "auto",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });


        const result = uploadedResponse as any;



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
        const { searchParams } = new URL(request.url); // this lets the server know which file to delete by destructring the whole the link when user clicks on the item 

        const fileName = searchParams.get("fileName");
        // so basically we are getting thte name of the file here "sfdsafawesfsafas.png"

        if (!fileName) {
            return NextResponse.json({ success: false, message: "File name is required" }, { status: 400 });
        }

        await cloudinary.uploader.destroy(fileName);

        console.log("This file has be deleted : " + { fileName })


        return NextResponse.json({ success: true, message: "File deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error deleting file: ", error);
        return NextResponse.json({
            success: false,
            message: "Getter better delete file something went wrong"
        }, { status: 500 });
    }

}