import { writeFile, mkdir, unlink } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { existsSync } from "fs";

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
        })

        // Here we are converting the file to a buffer means binary data as all the files are stored in binary format so here image to binary and storing in bytes and converting buffer to nodejs buffer

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;
        const randomstring = Math.random().toString(36).substring(2, 8);
        // here we are just giving it address so it can use it, we are not uploading the file here


        const uploadsDir = path.join(process.cwd(), "public", "uploads", "images");

        //eg : /home/piyush/my-next-app/public/uploads/images/17045592123-abcd123.png
        const filePath = path.join(uploadsDir, fileName);

        await writeFile(filePath, buffer);

        const fileUrl = `/uploads/images/${fileName}`;

        return NextResponse.json({
            success: true,
            url: fileUrl,
            fileName: fileName,
            size: file.size,
            type: file.type,
            message: "File uploaded successfully",
        }, {
            status: 200
        }); 

    } catch(error){ 
        console.error("Error uploading file:", error);
        return NextResponse.json({ success: false, message: "Error uploading file" }, { status: 500 });
    }
    

}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const fileName = searchParams.get('fileName');
        
        if (!fileName) {
            return NextResponse.json({ 
                success: false, 
                message: "Filename required" 
            }, { status: 400 });
        }

        // Construct file path
        const filePath = path.join(process.cwd(), "public", "uploads", "images", fileName);
        
        // Check if file exists
        if (!existsSync(filePath)) {
            return NextResponse.json({ 
                success: false, 
                message: "File not found" 
            }, { status: 404 });
        }

        // Delete the file
        await unlink(filePath);
        
        console.log(`File deleted: ${fileName}`);
        
        return NextResponse.json({
            success: true,
            message: "File deleted successfully"
        });
        
    } catch (error) {
        console.error("Error deleting file:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Error deleting file" 
        }, { status: 500 });
    }
}