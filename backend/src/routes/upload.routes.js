/**
 * @file upload.routes.js
 */
const express = require('express');
const { uploadBoth } = require('../middleware/uploadMiddleware');
const { uploadFiles } = require('../controllers/upload.controller');

const router = express.Router();

/** POST /api/upload */
router.post('/', uploadBoth, uploadFiles);

module.exports = router;
