/**
 * @file cosineSimilarity.js
 * @description Cosine similarity calculation for embedding vectors
 */

/**
 * Calculate cosine similarity between two numeric vectors.
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number} Similarity score between -1 and 1
 */
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    throw new Error('Vectors must be non-null and of equal length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
};

/**
 * Find the most similar item from a list of candidates using embeddings.
 * @param {number[]} queryEmbedding
 * @param {Array<{name: string, embedding: number[]}>} candidates
 * @param {number} [threshold=0.75]
 * @returns {{name: string, similarity: number} | null}
 */
const findMostSimilar = (queryEmbedding, candidates, threshold = 0.75) => {
  let best = null;
  let bestScore = -Infinity;

  for (const candidate of candidates) {
    const score = cosineSimilarity(queryEmbedding, candidate.embedding);
    if (score > bestScore) {
      bestScore = score;
      best = { name: candidate.name, similarity: score };
    }
  }

  return best && bestScore >= threshold ? best : null;
};

module.exports = { cosineSimilarity, findMostSimilar };
