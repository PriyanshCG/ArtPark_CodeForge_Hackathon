/**
 * @file uploadMiddleware.js
 * @description Multer upload middleware for resume + JD — adapted from SkillSense upload.middleware.ts
 */
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10);
const UPLOAD_DIR = path.join(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads');

const ALLOWED_MIMETYPES = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/** Disk storage — saves file with a unique name */
const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

/** Memory storage — for text/JD content */
const memoryStorage = multer.memoryStorage();

/** File filter: allow PDF, TXT, DOC, DOCX */
const fileFilter = (_req, file, cb) => {
  if (
    ALLOWED_MIMETYPES.includes(file.mimetype) ||
    file.originalname.endsWith('.pdf') ||
    file.originalname.endsWith('.txt') ||
    file.originalname.endsWith('.doc') ||
    file.originalname.endsWith('.docx')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, TXT, DOC, and DOCX files are allowed'));
  }
};

/** Upload middleware for resume file (saved to disk) */
const uploadResume = multer({
  storage: diskStorage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).single('resume');

/** Upload middleware for both resume + JD (memory storage) */
const uploadBoth = multer({
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).fields([
  { name: 'resume', maxCount: 1 },
  { name: 'jobDescription', maxCount: 1 },
]);

module.exports = { uploadResume, uploadBoth };
