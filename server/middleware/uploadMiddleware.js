const multer = require('multer');
const path = require('path');

const fileFilter = (_req, file, cb) => {
  if (file.fieldname === 'resume') {
    if (path.extname(file.originalname).toLowerCase() !== '.pdf') {
      return cb(new Error('Only PDFs are allowed for resume'), false);
    }
    return cb(null, true);
  }
  if (file.fieldname === 'profilePhoto') {
    const allowed = ['.png', '.jpg', '.jpeg'];
    if (!allowed.includes(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'), false);
    }
    return cb(null, true);
  }
  const allowed = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
  cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()));
};

module.exports = multer({ storage: multer.memoryStorage(), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
