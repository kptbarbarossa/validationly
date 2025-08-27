// Job Tailor Chrome Extension Background Script

const API_BASE = 'https://validationly.com';

// Extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Job Tailor extension installed');
  
  // Set default settings
  chrome.storage.sync.set({
    autoDetect: true,
    notifications: true,
    apiEndpoint: API_BASE
  });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'JOB_DETECTED':
      handleJobDetected(message.data, sender.tab);
      sendResponse({ success: true });
      break;
      
    case 'OPTIMIZE_CV':
      handleCVOptimization(message.data, sendResponse);
      return true; // Keep message channel open for async response
      
    case 'GET_SETTINGS':
      getSettings(sendResponse);
      return true;
      
    case 'SAVE_SETTINGS':
      saveSettings(message.data, sendResponse);
      return true;
      
    default:
      sendResponse({ error: 'Unknown message type' });
  }
});

// Handle job detection
async function handleJobDetected(jobData, tab) {
  try {
    // Store detected job data
    await chrome.storage.local.set({
      [`job_${tab.id}`]: {
        ...jobData,
        url: tab.url,
        timestamp: Date.now()
      }
    });
    
    // Show notification if enabled
    const settings = await chrome.storage.sync.get(['notifications']);
    if (settings.notifications) {
      showJobDetectedNotification(jobData.title, jobData.company);
    }
    
    // Update badge
    chrome.action.setBadgeText({
      text: '!',
      tabId: tab.id
    });
    chrome.action.setBadgeBackgroundColor({
      color: '#4F46E5',
      tabId: tab.id
    });
    
  } catch (error) {
    console.error('Error handling job detection:', error);
  }
}

// Handle CV optimization request
async function handleCVOptimization(data, sendResponse) {
  try {
    const { jobDescription, cvText, tone, token } = data;
    
    if (!token) {
      sendResponse({ error: 'Authentication required. Please login in the popup.' });
      return;
    }
    
    // Call Job Tailor API
    const response = await fetch(`${API_BASE}/api/rewrite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        jobDesc: jobDescription,
        cvText: cvText,
        tone: tone
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      sendResponse({ success: true, optimizedCV: result.revised });
      
      // Show success notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'assets/icon48.png',
        title: 'CV Optimized!',
        message: 'Your CV has been optimized for this job posting.'
      });
    } else {
      sendResponse({ error: result.error || 'Optimization failed' });
    }
    
  } catch (error) {
    console.error('CV optimization error:', error);
    sendResponse({ error: 'Network error. Please try again.' });
  }
}

// Get user settings
async function getSettings(sendResponse) {
  try {
    const settings = await chrome.storage.sync.get([
      'autoDetect',
      'notifications',
      'apiEndpoint',
      'defaultTone',
      'autoOptimize'
    ]);
    
    sendResponse({ 
      settings: {
        autoDetect: settings.autoDetect ?? true,
        notifications: settings.notifications ?? true,
        apiEndpoint: settings.apiEndpoint ?? API_BASE,
        defaultTone: settings.defaultTone ?? 'formal',
        autoOptimize: settings.autoOptimize ?? false
      }
    });
  } catch (error) {
    sendResponse({ error: 'Failed to load settings' });
  }
}

// Save user settings
async function saveSettings(newSettings, sendResponse) {
  try {
    await chrome.storage.sync.set(newSettings);
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ error: 'Failed to save settings' });
  }
}

// Show job detected notification
function showJobDetectedNotification(jobTitle, company) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'assets/icon48.png',
    title: 'Job Detected!',
    message: `${jobTitle} at ${company}`,
    buttons: [
      { title: 'Optimize CV' },
      { title: 'Ignore' }
    ]
  });
}

// Handle notification clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) { // Optimize CV button
    // Open popup or redirect to Job Tailor
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.action.openPopup();
      }
    });
  }
  
  chrome.notifications.clear(notificationId);
});

// Clean up old job data (keep only last 10 jobs)
chrome.runtime.onStartup.addListener(async () => {
  try {
    const data = await chrome.storage.local.get();
    const jobKeys = Object.keys(data).filter(key => key.startsWith('job_'));
    
    if (jobKeys.length > 10) {
      // Sort by timestamp and remove oldest
      const jobs = jobKeys.map(key => ({ key, timestamp: data[key].timestamp }));
      jobs.sort((a, b) => b.timestamp - a.timestamp);
      
      const keysToRemove = jobs.slice(10).map(job => job.key);
      await chrome.storage.local.remove(keysToRemove);
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
});

// Handle tab updates (clear badge when navigating away from job pages)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const isJobPage = /linkedin\.com\/jobs|indeed\.com\/viewjob|glassdoor\.com\/job-listing/.test(tab.url);
    
    if (!isJobPage) {
      chrome.action.setBadgeText({ text: '', tabId: tabId });
    }
  }
});