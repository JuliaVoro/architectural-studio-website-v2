import { list } from "@vercel/blob";
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
