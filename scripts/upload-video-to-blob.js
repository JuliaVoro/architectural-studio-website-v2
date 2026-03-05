const { put } = require("@vercel/blob");

async function uploadVideo() {
  const sourceUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/office%20video-fCvgkSM60iYpFyOH8LP2R3SrBKhkcZ.mp4";
  
  console.log("Fetching video from source URL...");
  
  const response = await fetch(sourceUrl);
  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: "video/mp4" });
  
  console.log("Uploading to Vercel Blob...");
  
  const result = await put("header-videos/office-termoindustria.mp4", blob, {
    access: "public",
    contentType: "video/mp4",
    allowOverwrite: true,
  });
  
  console.log("Upload complete!");
  console.log("Blob URL:", result.url);
  console.log("Pathname:", result.pathname);
  
  return result;
}

uploadVideo().catch(console.error);
