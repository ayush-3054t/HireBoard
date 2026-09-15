const cloudinary = require('cloudinary').v2;

const requiredVariables = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];

const assertCloudinaryConfig = () => {
  const missing = requiredVariables.filter((name) => !process.env[name]);
  if (missing.length) throw new Error(`Cloudinary is not configured: ${missing.join(', ')}`);
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const uploadFile = (file, options) => new Promise((resolve, reject) => {
  assertCloudinaryConfig();
  const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
    if (error) return reject(error);
    resolve(result);
  });
  stream.end(file.buffer);
});

module.exports = { cloudinary, uploadFile };
