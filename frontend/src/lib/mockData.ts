export interface Skill {
  name: string;
  requiredLevel: number;
  yourLevel: number;
  category: string;
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  resource?: string;
  resourceUrl?: string;
  duration: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ReasoningItem {
  skill: string;
  reason: string;
  type: 'missing' | 'weak' | 'matched';
}

export interface MockDataSet {
  id: string;
  name: string;
  role: string;
  company: string;
  skills: Skill[];
  readinessScore: number;
  matchPercentage: number;
  missingSkills: number;
  weakSkills: number;
  roadmap: RoadmapStep[];
  reasoning: ReasoningItem[];
}

export const mockDataSets: MockDataSet[] = [
  {
    id: 'frontend',
    name: 'Frontend Developer',
    role: 'Senior Frontend Engineer',
    company: 'TechCorp Inc.',
    readinessScore: 67,
    matchPercentage: 72,
    missingSkills: 2,
    weakSkills: 3,
    skills: [
      { name: 'JavaScript', requiredLevel: 5, yourLevel: 4, category: 'Core' },
      { name: 'React', requiredLevel: 5, yourLevel: 4, category: 'Framework' },
      { name: 'TypeScript', requiredLevel: 4, yourLevel: 3, category: 'Core' },
      { name: 'CSS/Tailwind', requiredLevel: 4, yourLevel: 5, category: 'Styling' },
      { name: 'Node.js', requiredLevel: 3, yourLevel: 2, category: 'Backend' },
      { name: 'GraphQL', requiredLevel: 4, yourLevel: 1, category: 'API' },
      { name: 'Testing (Jest)', requiredLevel: 4, yourLevel: 3, category: 'Quality' },
      { name: 'Git/Version Control', requiredLevel: 4, yourLevel: 5, category: 'Tools' },
      { name: 'Docker', requiredLevel: 3, yourLevel: 0, category: 'DevOps' },
      { name: 'AWS', requiredLevel: 3, yourLevel: 0, category: 'Cloud' },
    ],
    roadmap: [
      {
        step: 1,
        title: 'Master Docker Fundamentals',
        description: 'Learn containerization basics, Dockerfile creation, and container orchestration. Essential for modern deployment workflows.',
        resource: 'Docker Official Docs',
        resourceUrl: '#',
        duration: '2 weeks',
        priority: 'high',
      },
      {
        step: 2,
        title: 'Deep Dive into GraphQL',
        description: 'Understand GraphQL schema design, queries, mutations, and integration with React using Apollo Client.',
        resource: 'Apollo GraphQL Tutorial',
        resourceUrl: '#',
        duration: '3 weeks',
        priority: 'high',
      },
      {
        step: 3,
        title: 'Strengthen TypeScript Skills',
        description: 'Advanced type patterns, generics, and type-safe React components. Focus on real-world enterprise patterns.',
        resource: 'TypeScript Deep Dive',
        resourceUrl: '#',
        duration: '2 weeks',
        priority: 'medium',
      },
      {
        step: 4,
        title: 'AWS Cloud Essentials',
        description: 'Learn AWS core services: EC2, S3, Lambda, and CloudFront. Understand serverless architecture patterns.',
        resource: 'AWS Training Portal',
        resourceUrl: '#',
        duration: '3 weeks',
        priority: 'high',
      },
      {
        step: 5,
        title: 'Advanced Testing Strategies',
        description: 'Implement comprehensive testing with Jest, React Testing Library, and E2E testing with Cypress.',
        resource: 'Testing JavaScript Course',
        resourceUrl: '#',
        duration: '2 weeks',
        priority: 'medium',
      },
      {
        step: 6,
        title: 'Node.js Backend Integration',
        description: 'Build RESTful APIs and understand full-stack development patterns for better frontend-backend collaboration.',
        resource: 'Node.js Best Practices',
        resourceUrl: '#',
        duration: '2 weeks',
        priority: 'low',
      },
    ],
    reasoning: [
      { skill: 'Docker', reason: 'Docker is required for this role but not found in your resume. Container knowledge is essential for CI/CD pipelines.', type: 'missing' },
      { skill: 'AWS', reason: 'Cloud deployment experience is a key requirement. No AWS experience detected in your background.', type: 'missing' },
      { skill: 'GraphQL', reason: 'Your GraphQL level (1/4) is significantly below the required proficiency (4/4). This is a core skill for the role.', type: 'weak' },
      { skill: 'TypeScript', reason: 'TypeScript skills need strengthening. Advanced patterns are used extensively in the codebase.', type: 'weak' },
      { skill: 'React', reason: 'Strong React foundation detected. Focus on advanced patterns and performance optimization.', type: 'matched' },
    ],
  },
  {
    id: 'fullstack',
    name: 'Full Stack Developer',
    role: 'Full Stack Engineer',
    company: 'StartupXYZ',
    readinessScore: 78,
    matchPercentage: 81,
    missingSkills: 1,
    weakSkills: 2,
    skills: [
      { name: 'JavaScript', requiredLevel: 5, yourLevel: 5, category: 'Core' },
      { name: 'React', requiredLevel: 5, yourLevel: 5, category: 'Framework' },
      { name: 'Node.js', requiredLevel: 5, yourLevel: 4, category: 'Backend' },
      { name: 'PostgreSQL', requiredLevel: 4, yourLevel: 4, category: 'Database' },
      { name: 'MongoDB', requiredLevel: 4, yourLevel: 3, category: 'Database' },
      { name: 'Redis', requiredLevel: 3, yourLevel: 0, category: 'Cache' },
      { name: 'Docker', requiredLevel: 4, yourLevel: 3, category: 'DevOps' },
      { name: 'Kubernetes', requiredLevel: 3, yourLevel: 1, category: 'DevOps' },
      { name: 'CI/CD', requiredLevel: 4, yourLevel: 4, category: 'Tools' },
      { name: 'System Design', requiredLevel: 4, yourLevel: 3, category: 'Architecture' },
    ],
    roadmap: [
      {
        step: 1,
        title: 'Learn Redis Caching',
        description: 'Master in-memory caching strategies, session management, and performance optimization with Redis.',
        resource: 'Redis University',
        resourceUrl: '#',
        duration: '1 week',
        priority: 'high',
      },
      {
        step: 2,
        title: 'Kubernetes Fundamentals',
        description: 'Understand container orchestration, deployments, services, and scaling strategies for production systems.',
        resource: 'Kubernetes.io Docs',
        resourceUrl: '#',
        duration: '3 weeks',
        priority: 'high',
      },
      {
        step: 3,
        title: 'Advanced Docker Patterns',
        description: 'Multi-stage builds, Docker Compose for local development, and production-ready container configurations.',
        resource: 'Docker Mastery Course',
        resourceUrl: '#',
        duration: '2 weeks',
        priority: 'medium',
      },
      {
        step: 4,
        title: 'System Design Mastery',
        description: 'Design scalable systems, understand trade-offs, and prepare for architectural discussions.',
        resource: 'System Design Primer',
        resourceUrl: '#',
        duration: '3 weeks',
        priority: 'medium',
      },
      {
        step: 5,
        title: 'MongoDB Advanced',
        description: 'Aggregation pipelines, indexing strategies, and performance tuning for NoSQL databases.',
        resource: 'MongoDB University',
        resourceUrl: '#',
        duration: '2 weeks',
        priority: 'low',
      },
    ],
    reasoning: [
      { skill: 'Redis', reason: 'Redis experience is required for caching strategies but completely missing from your skill set.', type: 'missing' },
      { skill: 'Kubernetes', reason: 'Your Kubernetes knowledge (1/3) is below the required level. Container orchestration is crucial for this role.', type: 'weak' },
      { skill: 'System Design', reason: 'System design skills need improvement. You\'ll be expected to lead architectural decisions.', type: 'weak' },
      { skill: 'JavaScript/React', reason: 'Excellent frontend skills! Your strong foundation allows focus on backend technologies.', type: 'matched' },
      { skill: 'CI/CD', reason: 'Strong CI/CD background detected. This will help with deployment automation tasks.', type: 'matched' },
    ],
  },
  {
    id: 'datascience',
    name: 'Data Scientist',
    role: 'Senior Data Scientist',
    company: 'DataDriven AI',
    readinessScore: 52,
    matchPercentage: 58,
    missingSkills: 3,
    weakSkills: 3,
    skills: [
      { name: 'Python', requiredLevel: 5, yourLevel: 4, category: 'Core' },
      { name: 'SQL', requiredLevel: 5, yourLevel: 4, category: 'Database' },
      { name: 'Machine Learning', requiredLevel: 5, yourLevel: 2, category: 'AI/ML' },
      { name: 'TensorFlow/PyTorch', requiredLevel: 4, yourLevel: 1, category: 'AI/ML' },
      { name: 'Statistics', requiredLevel: 5, yourLevel: 3, category: 'Math' },
      { name: 'Data Visualization', requiredLevel: 4, yourLevel: 4, category: 'Tools' },
      { name: 'Spark/Big Data', requiredLevel: 4, yourLevel: 0, category: 'Big Data' },
      { name: 'Deep Learning', requiredLevel: 4, yourLevel: 0, category: 'AI/ML' },
      { name: 'NLP', requiredLevel: 3, yourLevel: 1, category: 'AI/ML' },
      { name: 'MLOps', requiredLevel: 3, yourLevel: 0, category: 'DevOps' },
    ],
    roadmap: [
      {
        step: 1,
        title: 'Machine Learning Foundations',
        description: 'Master supervised/unsupervised learning, model evaluation, and feature engineering techniques.',
        resource: 'Coursera ML Course',
        resourceUrl: '#',
        duration: '6 weeks',
        priority: 'high',
      },
      {
        step: 2,
        title: 'Deep Learning Specialization',
        description: 'Neural networks, CNNs, RNNs, and practical deep learning with TensorFlow/PyTorch.',
        resource: 'Deep Learning AI',
        resourceUrl: '#',
        duration: '8 weeks',
        priority: 'high',
      },
      {
        step: 3,
        title: 'Big Data with Spark',
        description: 'Apache Spark for distributed data processing, DataFrames, and MLlib for large-scale ML.',
        resource: 'Databricks Academy',
        resourceUrl: '#',
        duration: '4 weeks',
        priority: 'high',
      },
      {
        step: 4,
        title: 'Statistical Analysis Mastery',
        description: 'Advanced statistics, hypothesis testing, and experimental design for data-driven decisions.',
        resource: 'Statistical Learning',
        resourceUrl: '#',
        duration: '3 weeks',
        priority: 'medium',
      },
      {
        step: 5,
        title: 'NLP Fundamentals',
        description: 'Text processing, sentiment analysis, and transformer models for natural language understanding.',
        resource: 'Hugging Face Course',
        resourceUrl: '#',
        duration: '4 weeks',
        priority: 'medium',
      },
      {
        step: 6,
        title: 'MLOps & Model Deployment',
        description: 'Deploy ML models to production, monitoring, and maintaining ML systems at scale.',
        resource: 'Made With ML',
        resourceUrl: '#',
        duration: '3 weeks',
        priority: 'medium',
      },
    ],
    reasoning: [
      { skill: 'Spark/Big Data', reason: 'Big data processing is critical for this role but completely absent from your experience.', type: 'missing' },
      { skill: 'Deep Learning', reason: 'Deep learning expertise is required for AI projects. No prior experience detected.', type: 'missing' },
      { skill: 'MLOps', reason: 'Model deployment and monitoring skills are essential but missing from your background.', type: 'missing' },
      { skill: 'Machine Learning', reason: 'ML skills (2/5) need significant improvement. This is the core competency for the role.', type: 'weak' },
      { skill: 'TensorFlow/PyTorch', reason: 'Framework experience (1/4) is below requirements. Hands-on project work needed.', type: 'weak' },
      { skill: 'Statistics', reason: 'Statistical foundation needs strengthening for rigorous data analysis.', type: 'weak' },
      { skill: 'Data Visualization', reason: 'Good visualization skills will help communicate insights effectively.', type: 'matched' },
    ],
  },
];

export const getGapStatus = (skill: Skill): 'matched' | 'weak' | 'missing' => {
  const gap = skill.requiredLevel - skill.yourLevel;
  if (gap <= 0) return 'matched';
  if (skill.yourLevel === 0) return 'missing';
  return 'weak';
};

export const getGapColor = (status: 'matched' | 'weak' | 'missing') => {
  switch (status) {
    case 'matched':
      return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' };
    case 'weak':
      return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' };
    case 'missing':
      return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' };
  }
};

export const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high':
      return { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' };
    case 'medium':
      return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
    case 'low':
      return { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' };
  }
};
