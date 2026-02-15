/**
 * @file pdfExtractor.js
 * @description Extracts plain text from PDF buffers using pdf-parse
 */
const pdfParse = require('pdf-parse');
const logger = require('./logger');

/**
 * Extract text content from a PDF file buffer.
 * @param {Buffer} fileBuffer - Raw PDF file buffer
 * @returns {Promise<string>} Extracted plain text
 */
const extractTextFromPDF = async (fileBuffer) => {
  try {
    const data = await pdfParse(fileBuffer);
    const text = data.text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    logger.debug(`PDF extracted: ${text.length} chars, ${data.numpages} pages`);
    return text;
  } catch (err) {
    logger.error('PDF extraction failed:', err.message);
    throw new Error(`Failed to extract text from PDF: ${err.message}`);
  }
};

/**
 * Extract text from either a PDF or plain text file buffer.
 * @param {Buffer} fileBuffer
 * @param {string} mimetype
 * @param {string} [originalname='']
 * @returns {Promise<string>}
 */
const extractTextFromFile = async (fileBuffer, mimetype, originalname = '') => {
  const isPdf =
    mimetype === 'application/pdf' ||
    originalname.toLowerCase().endsWith('.pdf');

  if (isPdf) {
    return extractTextFromPDF(fileBuffer);
  }

  // Treat as plain text
  return fileBuffer.toString('utf-8').trim();
};

module.exports = { extractTextFromPDF, extractTextFromFile };
