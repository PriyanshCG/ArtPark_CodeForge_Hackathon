import { pipeline } from '@xenova/transformers';

class SemanticMatcher {
    static instance = null;

    static async getInstance() {
        if (this.instance === null) {
            this.instance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        }
        return this.instance;
    }

    static async getEmbedding(text) {
        const extractor = await this.getInstance();
        const output = await extractor(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    }

    static cosineSimilarity(v1, v2) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < v1.length; i++) {
            dotProduct += v1[i] * v2[i];
            normA += v1[i] * v1[i];
            normB += v2[i] * v2[i];
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    static async matchSkills(resumeSkills, requiredSkills, threshold = 0.75) {
        const matches = [];

        // Get embeddings for all skills
        const resumeEmbeddings = await Promise.all(resumeSkills.map(s => this.getEmbedding(s)));
        const requiredEmbeddings = await Promise.all(requiredSkills.map(s => this.getEmbedding(s)));

        for (let i = 0; i < requiredSkills.length; i++) {
            let bestMatch = { similarity: 0, skill: null };

            for (let j = 0; j < resumeSkills.length; j++) {
                const sim = this.cosineSimilarity(requiredEmbeddings[i], resumeEmbeddings[j]);
                if (sim > bestMatch.similarity) {
                    bestMatch = { similarity: sim, skill: resumeSkills[j] };
                }
            }

            if (bestMatch.similarity >= threshold) {
                matches.push({
                    requiredSkill: requiredSkills[i],
                    yourSkill: bestMatch.skill,
                    similarity: bestMatch.similarity,
                    isSemantic: requiredSkills[i].toLowerCase() !== bestMatch.skill.toLowerCase()
                });
            }
        }

        return matches;
    }
}

export default SemanticMatcher;
