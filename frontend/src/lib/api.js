const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with auth handling
 */
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('artpark_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Important for cookies
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'API request failed');
  }

  return result.data;
}

export const uploadDocuments = async (resumeFile, jobDescriptionText, jobDescriptionFile = null) => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  if (jobDescriptionFile) {
    formData.append('jobDescription', jobDescriptionFile);
  }
  if (jobDescriptionText) {
    formData.append('jobDescriptionText', jobDescriptionText);
  }

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Upload failed');
  return result.data;
};

export const runAnalysis = async (sessionId) => {
  return apiFetch('/analysis/run', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });
};

export const generatePathway = async (sessionId) => {
  return apiFetch('/analysis/roadmap/generate', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });
};

export const parseResume = async (resumeFile, text = null) => {
  if (resumeFile) {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    const response = await fetch(`${API_URL}/analysis/parse/resume`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Resume parsing failed');
    return result.data;
  }
  return apiFetch('/analysis/parse/resume', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
};

export const parseJD = async (jdText, jdFile = null) => {
  if (jdFile) {
    const formData = new FormData();
    formData.append('jobDescription', jdFile);
    const response = await fetch(`${API_URL}/analysis/parse/jd`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'JD parsing failed');
    return result.data;
  }
  return apiFetch('/analysis/parse/jd', {
    method: 'POST',
    body: JSON.stringify({ text: jdText }),
  });
};

export const analyzeSkillGap = async (resumeProfile, jdProfile) => {
  return apiFetch('/analysis/analyze/skill-gap', {
    method: 'POST',
    body: JSON.stringify({ resumeProfile, jdProfile }),
  });
};

export const generateRoadmap = async (resumeProfile, jdProfile, skillGap) => {
  return apiFetch('/analysis/roadmap/generate', {
    method: 'POST',
    body: JSON.stringify({ resumeProfile, jdProfile, skillGap }),
  });
};

export const getCurrentUser = async () => {
  return apiFetch('/auth/me');
};

export const checkAuthStatus = async () => {
  return apiFetch('/auth/status');
};

export const logout = async () => {
  localStorage.removeItem('artpark_token');
  return apiFetch('/auth/logout', { method: 'POST' });
};

export const loginWithGoogle = () => {
  window.location.href = `${API_URL}/auth/google`;
};

/**
 * Send a message to the AI Mentor
 */
export const sendChatMessage = async (message, context = null) => {
  return apiFetch('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  });
};

/**
 * Generate expert Q&A for interview prep
 */
export const generateQA = async (profileData) => {
  return apiFetch('/interview/qa', {
    method: 'POST',
    body: JSON.stringify(profileData),
  });
};

/**
 * Send conversation to interview chat
 */
export const sendInterviewChat = async (systemPrompt, messages) => {
  return apiFetch('/interview/chat', {
    method: 'POST',
    body: JSON.stringify({ systemPrompt, messages }),
  });
};
