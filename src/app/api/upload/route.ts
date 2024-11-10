import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const UPLOAD_DIR = path.resolve(process.cwd(), "public/assets/img");

export const POST = async (req: NextRequest) => {
  try {
    // Check if the content-type is multipart/form-data
    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json({
        success: false,
        message: "Invalid content-type. Expected multipart/form-data.",
      });
    }

    // Get form data from the request
    const formData = await req.formData();
    
    // Get individual form fields
    let title = formData.get("title") as string | null;
    let content = formData.get("content") as string | null;
    let userId = formData.get("userId") as string | null;
    let file = formData.get("image") as File | null; // Expecting the file field to be named "image"

    // Log the individual fields to verify they're being captured correctly
    console.log("Title:", title);
    console.log("Content:", content);
    console.log("UserId:", userId);
    console.log("File:", file);

    // Ensure all required fields are provided
    if (!title || !content || !userId) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields: title, content, or userId",
      });
    }

    // Handle file upload
    let fileName = "default-image.jpg"; // Default image if none is uploaded
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }
      fileName = `${Date.now()}-${file.name}`; // Generate a unique file name
      fs.writeFileSync(path.resolve(UPLOAD_DIR, fileName), buffer); // Save the file
    }

    // Insert article into the database using Prisma
    const newArticle = await prisma.article.create({
      data: {
        title: title, // Assign title
        content: content, // Assign content
        image: `/assets/img/${fileName}`, // Store the image path
        userId: parseInt(userId), // Ensure userId is a number
      },
    });

    // Return a success response
    return NextResponse.json({
      success: true,
      message: "Article created successfully",
      article: newArticle,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred while creating the article",
      // error: error.message,
    });
  }
};
