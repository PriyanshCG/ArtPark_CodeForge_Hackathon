export const mockProfiles = [
  {
    id: 'frontend',
    name: 'Frontend Developer',
    role: 'Senior Frontend Engineer',
    company: 'TechCorp Inc.',
    readinessScore: 67,
    matchPercentage: 72,
    missingSkills: 2,
    weakSkills: 3,
    userResume: "Senior Frontend Developer with 5+ years of experience. Expert in JavaScript and React. Skilled in Deep Learning and building AI-powered interfaces. Extensive experience with Tailwind CSS and TypeScript.",
    skills: [
      { name: 'JavaScript', requiredLevel: 5, yourLevel: 4, category: 'Core' },
      { name: 'React', requiredLevel: 5, yourLevel: 4, category: 'Framework' },
      { name: 'TypeScript', requiredLevel: 4, yourLevel: 3, category: 'Core' },
      { name: 'CSS/Tailwind', requiredLevel: 4, yourLevel: 5, category: 'Styling' },
      { name: 'Node.js', requiredLevel: 3, yourLevel: 2, category: 'Backend' },
      { name: 'GraphQL', requiredLevel: 4, yourLevel: 1, category: 'API' },
      { name: 'Neural Networks', requiredLevel: 4, yourLevel: 0, category: 'AI/ML' },
      { name: 'Testing (Jest)', requiredLevel: 4, yourLevel: 3, category: 'Quality' },
      { name: 'Git/Version Control', requiredLevel: 4, yourLevel: 5, category: 'Tools' },
      { name: 'Docker', requiredLevel: 3, yourLevel: 0, category: 'DevOps' },
      { name: 'AWS', requiredLevel: 3, yourLevel: 0, category: 'Cloud' },
    ],
    marketTrends: {
      demand: "High",
      growth: "+24% Year-over-Year",
      insight: "React and Next.js demand is skyrocketing in enterprise applications."
    },
    roadmap: [
      { step: 1, title: 'Master Docker', description: 'Essential for modern deployment.', resource: 'Docker Docs', duration: '2 weeks', priority: 'high', type: 'technical', style: 'Hands-on' },
      { step: 2, title: 'GraphQL Deep Dive', description: 'Schema design and Apollo Client.', resource: 'Apollo Tutorial', duration: '3 weeks', priority: 'high', type: 'technical', style: 'Video' },
      { step: 3, title: 'AWS Cloud', description: 'EC2, S3, and Lambda architecture.', resource: 'AWS Portal', duration: '3 weeks', priority: 'high', type: 'technical', style: 'Interactive' },
    ],
    reasoning: [
      { skill: 'Docker', reason: 'Missing from resume but required for CI/CD.', type: 'missing' },
      { skill: 'AWS', reason: 'Industry standard for cloud-native roles.', type: 'missing' },
    ],
    skillGraph: [
      { id: "JavaScript", dependsOn: [] },
      { id: "React", dependsOn: ["JavaScript"] },
      { id: "TypeScript", dependsOn: ["JavaScript"] },
      { id: "Node.js", dependsOn: ["JavaScript"] },
      { id: "GraphQL", dependsOn: ["Node.js"] },
      { id: "AWS", dependsOn: [] }
    ]
  },
  {
    id: 'marketing',
    name: 'Growth Marketer',
    role: 'Head of Growth',
    company: 'SkyRocket Ads',
    readinessScore: 54,
    matchPercentage: 62,
    missingSkills: 3,
    weakSkills: 2,
    userResume: "Growth Marketer with 4 years experience in SEO and Content. Skilled in Google Analytics and basic SQL. Looking to transition into data-driven performance marketing.",
    skills: [
      { name: 'SEO Strategy', requiredLevel: 5, yourLevel: 4, category: 'Organic' },
      { name: 'PPC / Meta Ads', requiredLevel: 5, yourLevel: 2, category: 'Performance' },
      { name: 'Google Analytics 4', requiredLevel: 4, yourLevel: 5, category: 'Data' },
      { name: 'Tableau / Data Viz', requiredLevel: 4, yourLevel: 1, category: 'Data' },
      { name: 'Copywriting', requiredLevel: 5, yourLevel: 4, category: 'Creative' },
      { name: 'Python for Mkting', requiredLevel: 3, yourLevel: 0, category: 'Automation' },
    ],
    marketTrends: {
      demand: "Very High",
      growth: "+31% Year-over-Year",
      insight: "Data-driven marketing and Python automation are the top skills for 2024."
    },
    roadmap: [
      { step: 1, title: 'Python for Performance', description: 'Automate ad spend reporting.', resource: 'Python for Marketers', duration: '4 weeks', priority: 'high', style: 'Hands-on' },
      { step: 2, title: 'Advanced Tableau', description: 'Build high-impact marketing dashboards.', resource: 'Tableau Desktop', duration: '2 weeks', priority: 'medium', style: 'Visual' },
      { step: 3, title: 'PPC Mastery', description: 'Focus on Meta Pixel and conversion API.', resource: 'Meta Blueprint', duration: '3 weeks', priority: 'high', style: 'Interactive' },
    ],
    reasoning: [
      { skill: 'Python', reason: 'Market trend shows 85% of high-paying roles now require Python automation.', type: 'missing' },
      { skill: 'PPC', reason: 'Core performance skill missing from your recent resume projects.', type: 'weak' },
    ],
    skillGraph: [
      { id: "SEO Strategy", dependsOn: [] },
      { id: "Google Analytics 4", dependsOn: ["SEO Strategy"] },
      { id: "Python for Mkting", dependsOn: ["Google Analytics 4"] },
      { id: "Tableau / Data Viz", dependsOn: ["Google Analytics 4"] }
    ]
  },
  {
    id: 'hr',
    name: 'HR Analyst',
    role: 'People Analytics Lead',
    company: 'InterScale Global',
    readinessScore: 78,
    matchPercentage: 81,
    missingSkills: 1,
    weakSkills: 2,
    userResume: "HR Specialist with strong background in recruitment and employee relations. Expert in Workday and performance management. Transitioning into People Analytics role.",
    skills: [
      { name: 'Recruitment Ops', requiredLevel: 5, yourLevel: 5, category: 'Core' },
      { name: 'Employee Relations', requiredLevel: 5, yourLevel: 4, category: 'Core' },
      { name: 'Workday / HRIS', requiredLevel: 4, yourLevel: 5, category: 'Tools' },
      { name: 'Predictive Modeling', requiredLevel: 4, yourLevel: 1, category: 'Data' },
      { name: 'Policy Drafting', requiredLevel: 4, yourLevel: 4, category: 'Admin' },
    ],
    marketTrends: {
      demand: "Moderate",
      growth: "+12% Year-over-Year",
      insight: "Retention modeling using AI is becoming a critical requirement for HR leads."
    },
    roadmap: [
      { step: 1, title: 'Intro to People Data', description: 'Learn logic behind retention metrics.', resource: 'Coursera HR Data', duration: '2 weeks', priority: 'high', style: 'Reading' },
      { step: 2, title: 'Predictive Modeling', description: 'Apply simple statistics to employee data.', resource: 'Stat Academy', duration: '4 weeks', priority: 'high', style: 'Hands-on' },
    ],
    reasoning: [
      { skill: 'Predictive Modeling', reason: 'Role requires data-driven recruitment forecasting.', type: 'weak' },
    ],
    skillGraph: [
      { id: "Recruitment Ops", dependsOn: [] },
      { id: "Workday / HRIS", dependsOn: ["Recruitment Ops"] },
      { id: "Predictive Modeling", dependsOn: ["Workday / HRIS"] }
    ]
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
    skillGraph: [
      { id: "JavaScript", dependsOn: [] },
      { id: "React", dependsOn: ["JavaScript"] },
      { id: "Node.js", dependsOn: ["JavaScript"] },
      { id: "PostgreSQL", dependsOn: [] },
      { id: "MongoDB", dependsOn: [] },
      { id: "Redis", dependsOn: ["Node.js"] },
      { id: "Docker", dependsOn: [] },
      { id: "Kubernetes", dependsOn: ["Docker"] },
      { id: "CI/CD", dependsOn: ["Git/Version Control"] },
      { id: "System Design", dependsOn: ["Node.js", "PostgreSQL", "Docker"] }
    ]
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
    userResume: "Data Scientist with experience in building predictive models using Python and SQL. Proficient in PyTorch for deep learning and NLP tasks. Skilled in data visualization and statistical analysis. Working knowledge of Apache Spark for distributed computing.",
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
    skillGraph: [
      { id: "Python", dependsOn: [] },
      { id: "SQL", dependsOn: [] },
      { id: "Statistics", dependsOn: ["Python"] },
      { id: "Machine Learning", dependsOn: ["Python", "Statistics"] },
      { id: "TensorFlow/PyTorch", dependsOn: ["Machine Learning"] },
      { id: "Deep Learning", dependsOn: ["TensorFlow/PyTorch"] },
      { id: "NLP", dependsOn: ["Deep Learning"] },
      { id: "Spark/Big Data", dependsOn: ["SQL"] },
      { id: "MLOps", dependsOn: ["Machine Learning", "Spark/Big Data"] },
      { id: "Data Visualization", dependsOn: ["Python"] }
    ]
  },
];

export const careerPaths = [
  {
    id: 'frontend',
    name: 'Frontend Developer',
    requiredSkills: ['JavaScript', 'React', 'TypeScript', 'CSS/Tailwind', 'Git/Version Control', 'Testing (Jest)'],
  },
  {
    id: 'backend',
    name: 'Backend Developer',
    requiredSkills: ['Node.js', 'SQL', 'PostgreSQL', 'Docker', 'Redis', 'System Design', 'Git/Version Control'],
  },
  {
    id: 'fullstack',
    name: 'Full Stack Developer',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'CI/CD', 'System Design'],
  },
  {
    id: 'datascientist',
    name: 'Data Scientist',
    requiredSkills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization', 'Deep Learning'],
  },
  {
    id: 'devops',
    name: 'DevOps Engineer',
    requiredSkills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'Terraform', 'Monitoring'],
  },
];

export const getGapStatus = (skill) => {
  const gap = skill.requiredLevel - skill.yourLevel;
  if (gap <= 0) return 'matched';
  if (skill.yourLevel === 0) return 'missing';
  return 'weak';
};

export const getGapColor = (status) => {
  switch (status) {
    case 'matched':
      return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' };
    case 'weak':
      return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' };
    case 'missing':
      return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' };
    default:
      return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', dot: 'bg-slate-500' };
  }
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' };
    case 'medium':
      return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
    case 'low':
      return { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
  }
};

export const getScoreColor = (score) => {
  if (score >= 80) return { text: 'text-emerald-600', stroke: '#10b981', bg: 'from-emerald-500/20' };
  if (score >= 60) return { text: 'text-amber-600', stroke: '#f59e0b', bg: 'from-amber-500/20' };
  return { text: 'text-rose-600', stroke: '#f43f5e', bg: 'from-rose-500/20' };
};
