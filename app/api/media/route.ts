import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// GET - List all media files
export async function GET() {
  try {
    const { promises: fs } = await import("fs");
    const path = await import("path");

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const files = await fs.readdir(uploadsDir);

    const mediaFiles = files.map(file => ({
      name: file,
      path: `/uploads/${file}`,
      url: `/uploads/${file}`
    }));

    return NextResponse.json({ success: true, data: mediaFiles });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to read media files" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a media file
export async function DELETE(request: NextRequest) {
  try {
    const { filename } = await request.json();

    if (!filename || filename.includes("..")) {
      return NextResponse.json(
        { success: false, error: "Invalid filename" },
        { status: 400 }
      );
    }

    // Check if file is referenced in database
    const profile = await prisma.profile.findFirst({
      where: {
        OR: [
          { profileImage: `/uploads/${filename}` }
        ]
      }
    });

    const project = await prisma.project.findFirst({
      where: { imageUrl: `/uploads/${filename}` }
    });

    const testimonial = await prisma.testimonial.findFirst({
      where: { imageUrl: `/uploads/${filename}` }
    });

    if (profile || project || testimonial) {
      return NextResponse.json(
        { 
          success: false, 
          error: "File is in use. Remove it from all places before deleting.",
          inUse: true 
        },
        { status: 409 }
      );
    }

    // Delete the file
    const { promises: fs } = await import("fs");
    const path = await import("path");

    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    await fs.unlink(filePath);

    revalidatePath("/admin/media");

    return NextResponse.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
