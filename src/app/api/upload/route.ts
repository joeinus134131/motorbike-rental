import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.json();
    const { image, fileName } = formData;

    if (!image) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 });
    }

    // Since we are receiving base64 from the client (easier for simple upload without multer/formidable)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalExtension = fileName.split(".").pop();
    const cleanFileName = `bike-${uniqueSuffix}.${originalExtension}`;
    
    const uploadDir = join(process.cwd(), "public", "uploads");
    const filePath = join(uploadDir, cleanFileName);

    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      url: `/uploads/${cleanFileName}`,
      message: "Image uploaded successfully" 
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Error uploading image" }, { status: 500 });
  }
}
