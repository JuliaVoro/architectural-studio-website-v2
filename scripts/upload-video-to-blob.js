const { put } = require("@vercel/blob");
const { readFileSync } = require("fs");
const { join } = require("path");

async function uploadVideo() {
  const videoPath = join(process.cwd(), "public/videos/sequence-01.mp4");
  
  console.log("Reading video file from:", videoPath);
  
  const fileBuffer = readFileSync(videoPath);
  const blob = new Blob([fileBuffer], { type: "video/mp4" });
  
  console.log("Uploading to Vercel Blob...");
  
  const result = await put("header-videos/sequence-01.mp4", blob, {
    access: "public",
    contentType: "video/mp4",
  });
  
  console.log("Upload complete!");
  console.log("Blob URL:", result.url);
  console.log("Pathname:", result.pathname);
  
  return result;
}

uploadVideo().catch(console.error);
