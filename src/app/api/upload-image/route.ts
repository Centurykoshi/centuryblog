import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
        name : file.name,
        size: file.size,
        type: file.type
    })

    
}