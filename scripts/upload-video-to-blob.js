const { put } = require("@vercel/blob");

async function uploadVideo() {
  const sourceUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sequence%2001_4-Hmvrdzy5kIi1wvHPEBlAZhdtynK6KJ.mp4";
  
  console.log("Fetching video from source URL...");
  
  const response = await fetch(sourceUrl);
  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: "video/mp4" });
  
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
