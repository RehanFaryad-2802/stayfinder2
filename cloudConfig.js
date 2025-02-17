const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_CLOUD_KEY,
  api_secret: process.env.API_SECRET_KEY,
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'StayFinder',
      allowedFormats:['jpg', 'png', 'jpeg']
    },
  });

module.exports = {
  cloudinary,
  storage,
};
