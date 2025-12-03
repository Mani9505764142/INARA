// src/routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const cloudinaryLib = require("cloudinary").v2;

const router = express.Router();

// Ensure Cloudinary is configured at runtime
if (process.env.CLOUDINARY_URL) {
  // If you set CLOUDINARY_URL, cloudinary will parse it automatically
  cloudinaryLib.config({ cloudinary_url: process.env.CLOUDINARY_URL });
} else {
  cloudinaryLib.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// multer setup (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } }); // 8MB

// helper: upload buffer to cloudinary using upload_stream
function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinaryLib.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload buffer to Cloudinary
    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "kanha-products",
      resource_type: "image",
    });

    if (!result || !result.secure_url) {
      console.error("Cloudinary upload returned no secure_url:", result);
      return res.status(502).json({ message: "Upload failed - provider returned no URL" });
    }

    // *** IMPORTANT: return `imageUrl` so frontend picks it up ***
    return res.json({ imageUrl: result.secure_url });
  } catch (err) {
    // Log full error to server logs for debugging (no secrets printed)
    console.error("Cloudinary upload error:", err && (err.message || err));
    // Give a helpful response to the client
    return res.status(500).json({ message: "Failed to upload image", error: err && err.message });
  }
});

module.exports = router;
