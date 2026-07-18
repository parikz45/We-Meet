const cloudinary = require("cloudinary").v2;

// Configured from environment variables (set these in .env locally and in the
// Render dashboard). Get the values from your Cloudinary account dashboard.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload a file buffer to Cloudinary and resolve with the result (incl. secure_url).
const uploadToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });

module.exports = { cloudinary, uploadToCloudinary };
