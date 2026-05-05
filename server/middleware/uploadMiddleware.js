const path = require('path');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    let dir = 'uploads/';
    if (file.fieldname === 'profilePhoto') {
      dir = 'uploads/profile/';
    } else if (file.fieldname === 'resume') {
      dir = 'uploads/resumes/';
    }
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
  }
});

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

module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
