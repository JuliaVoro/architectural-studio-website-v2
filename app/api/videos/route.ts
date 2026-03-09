import { list, put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { blobs } = await list({
      prefix: "header-videos/",
    });

    const videos = blobs.map((blob) => ({
      url: blob.url,
      pathname: blob.pathname,
      filename: blob.pathname.split("/").pop() || "unknown",
      size: blob.size,
      uploadedAt: blob.uploadedAt,
    }));

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Error listing videos:", error);
    return NextResponse.json({ error: "Failed to list videos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("video/")) {
      return NextResponse.json({ error: "File must be a video" }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name}`;
    const blob = await put(`header-videos/${filename}`, file, {
      access: "public",
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      filename: filename,
      size: blob.size,
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    return NextResponse.json({ error: "Failed to upload video" }, { status: 500 });
  }
}
