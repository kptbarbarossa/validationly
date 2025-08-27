// Job Tailor Extension Popup Script

const API_BASE = 'https://validationly.com';

// DOM Elements
const authSection = document.getElementById('auth-section');
const mainApp = document.getElementById('main-app');
const emailInput = document.getElementById('email');
const loginBtn = document.getElementById('login-btn');
const statusDiv = document.getElementById('status');
const jobTitle = document.getElementById('job-title');
const jobCompany = document.getElementById('job-company');
const cvTextArea = document.getElementById('cv-text');
const toneSelect = document.getElementById('tone-select');
const optimizeBtn = document.getElementById('optimize-btn');
const openWebBtn = document.getElementById('open-web-btn');
const resultsSection = document.getElementById('results-section');
const optimizedCvArea = document.getElementById('optimized-cv');
const copyBtn = document.getElementById('copy-btn');

let currentJobData = null;
let userToken = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await loadUserToken();
  await loadJobData();
  setupEventListeners();
  
  if (userToken) {
    showMainApp();
  } else {
    showAuthSection();
  }
});

// Load user token from storage
async function loadUserToken() {
  try {
    const result = await chrome.storage.sync.get(['userToken']);
    userToken = result.userToken;
  } catch (error) {
    console.error('Failed to load token:', error);
  }
}

// Load job data for current tab
async function loadJobData() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const result = await chrome.storage.local.get([`job_${tab.id}`]);
    
    if (result[`job_${tab.id}`]) {
      currentJobData = result[`job_${tab.id}`];
      updateJobDisplay();
    }
  } catch (error) {
    console.error('Failed to load job data:', error);
  }
}

// Setup event listeners
function setupEventListeners() {
  loginBtn.addEventListener('click', handleLogin);
  optimizeBtn.addEventListener('click', handleOptimize);
  openWebBtn.addEventListener('click', openJobTailorWeb);
  copyBtn.addEventListener('click', copyToClipboard);
  
  cvTextArea.addEventListener('input', updateOptimizeButton);
  
  // Enter key in email field
  emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  });
}

// Handle user login
async function handleLogin() {
  const email = emailInput.value.trim();
  
  if (!email) {
    showStatus('Please enter your email', 'error');
    return;
  }
  
  setLoading(loginBtn, true);
  
  try {
    const response = await fetch(`${API_BASE}/api/auth/issue-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      userToken = data.token;
      await chrome.storage.sync.set({ userToken: data.token });
      showMainApp();
      showStatus('Login successful!', 'success');
    } else {
      showStatus(data.error || 'Login failed', 'error');
    }
  } catch (error) {
    showStatus('Network error. Please try again.', 'error');
  } finally {
    setLoading(loginBtn, false);
  }
}

// Handle CV optimization
async function handleOptimize() {
  if (!currentJobData) {
    showStatus('No job detected. Please navigate to a job posting.', 'error');
    return;
  }
  
  const cvText = cvTextArea.value.trim();
  if (!cvText) {
    showStatus('Please enter your CV text', 'error');
    return;
  }
  
  setLoading(optimizeBtn, true);
  showStatus('Optimizing your CV...', 'loading');
  
  try {
    const response = await fetch(`${API_BASE}/api/rewrite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        jobDesc: `${currentJobData.title} at ${currentJobData.company}\n\n${currentJobData.description}`,
        cvText: cvText,
        tone: toneSelect.value
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      optimizedCvArea.value = data.revised;
      resultsSection.classList.remove('hidden');
      showStatus('CV optimized successfully!', 'success');
      
      // Scroll to results
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      showStatus(data.error || 'Optimization failed', 'error');
    }
  } catch (error) {
    showStatus('Network error. Please try again.', 'error');
  } finally {
    setLoading(optimizeBtn, false);
  }
}

// Open Job Tailor web app
function openJobTailorWeb() {
  chrome.tabs.create({ url: `${API_BASE}/job-tailor` });
}

// Copy optimized CV to clipboard
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(optimizedCvArea.value);
    showStatus('Copied to clipboard!', 'success');
    
    // Change button text temporarily
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  } catch (error) {
    showStatus('Failed to copy to clipboard', 'error');
  }
}

// Update job display
function updateJobDisplay() {
  if (currentJobData) {
    jobTitle.textContent = currentJobData.title;
    jobCompany.textContent = currentJobData.company;
    updateOptimizeButton();
  }
}

// Update optimize button state
function updateOptimizeButton() {
  const hasJob = currentJobData !== null;
  const hasCvText = cvTextArea.value.trim().length > 0;
  const hasToken = userToken !== null;
  
  optimizeBtn.disabled = !(hasJob && hasCvText && hasToken);
}

// Show main application
function showMainApp() {
  authSection.classList.add('hidden');
  mainApp.classList.remove('hidden');
  updateOptimizeButton();
}

// Show authentication section
function showAuthSection() {
  authSection.classList.remove('hidden');
  mainApp.classList.add('hidden');
}

// Show status message
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.classList.remove('hidden');
  
  // Auto-hide success messages
  if (type === 'success') {
    setTimeout(() => {
      statusDiv.classList.add('hidden');
    }, 3000);
  }
}

// Set loading state for buttons
function setLoading(button, loading) {
  if (loading) {
    button.disabled = true;
    const spinner = document.createElement('span');
    spinner.className = 'loading-spinner';
    button.insertBefore(spinner, button.firstChild);
  } else {
    button.disabled = false;
    const spinner = button.querySelector('.loading-spinner');
    if (spinner) {
      spinner.remove();
    }
  }
}

// Listen for job detection updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'JOB_DETECTED') {
    currentJobData = message.data;
    updateJobDisplay();
  }
});