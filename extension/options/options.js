// Job Tailor Extension Options Script

// DOM Elements
const autoDetectToggle = document.getElementById('auto-detect');
const notificationsToggle = document.getElementById('notifications');
const defaultToneSelect = document.getElementById('default-tone');
const autoOptimizeToggle = document.getElementById('auto-optimize');
const apiEndpointInput = document.getElementById('api-endpoint');
const clearTokenBtn = document.getElementById('clear-token');
const saveSettingsBtn = document.getElementById('save-settings');
const resetSettingsBtn = document.getElementById('reset-settings');
const statusDiv = document.getElementById('status');

// Default settings
const defaultSettings = {
  autoDetect: true,
  notifications: true,
  defaultTone: 'formal',
  autoOptimize: false,
  apiEndpoint: 'https://validationly.com'
};

// Initialize options page
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  setupEventListeners();
});

// Load settings from storage
async function loadSettings() {
  try {
    const settings = await chrome.storage.sync.get([
      'autoDetect',
      'notifications',
      'defaultTone',
      'autoOptimize',
      'apiEndpoint'
    ]);
    
    // Apply settings to UI
    autoDetectToggle.checked = settings.autoDetect ?? defaultSettings.autoDetect;
    notificationsToggle.checked = settings.notifications ?? defaultSettings.notifications;
    defaultToneSelect.value = settings.defaultTone ?? defaultSettings.defaultTone;
    autoOptimizeToggle.checked = settings.autoOptimize ?? defaultSettings.autoOptimize;
    apiEndpointInput.value = settings.apiEndpoint ?? defaultSettings.apiEndpoint;
    
  } catch (error) {
    console.error('Failed to load settings:', error);
    showStatus('Failed to load settings', 'error');
  }
}

// Setup event listeners
function setupEventListeners() {
  saveSettingsBtn.addEventListener('click', saveSettings);
  resetSettingsBtn.addEventListener('click', resetSettings);
  clearTokenBtn.addEventListener('click', clearToken);
  
  // Auto-save on change
  autoDetectToggle.addEventListener('change', autoSave);
  notificationsToggle.addEventListener('change', autoSave);
  defaultToneSelect.addEventListener('change', autoSave);
  autoOptimizeToggle.addEventListener('change', autoSave);
  
  // Validate API endpoint on blur
  apiEndpointInput.addEventListener('blur', validateApiEndpoint);
}

// Save settings to storage
async function saveSettings() {
  try {
    const settings = {
      autoDetect: autoDetectToggle.checked,
      notifications: notificationsToggle.checked,
      defaultTone: defaultToneSelect.value,
      autoOptimize: autoOptimizeToggle.checked,
      apiEndpoint: apiEndpointInput.value.trim() || defaultSettings.apiEndpoint
    };
    
    await chrome.storage.sync.set(settings);
    showStatus('Settings saved successfully!', 'success');
    
    // Notify background script of settings change
    chrome.runtime.sendMessage({
      type: 'SETTINGS_UPDATED',
      data: settings
    });
    
  } catch (error) {
    console.error('Failed to save settings:', error);
    showStatus('Failed to save settings', 'error');
  }
}

// Auto-save settings on change
async function autoSave() {
  await saveSettings();
}

// Reset settings to defaults
async function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    try {
      await chrome.storage.sync.set(defaultSettings);
      await loadSettings();
      showStatus('Settings reset to defaults', 'success');
    } catch (error) {
      console.error('Failed to reset settings:', error);
      showStatus('Failed to reset settings', 'error');
    }
  }
}

// Clear authentication token
async function clearToken() {
  if (confirm('Are you sure you want to clear your authentication token? You will need to login again.')) {
    try {
      await chrome.storage.sync.remove(['userToken']);
      showStatus('Authentication token cleared', 'success');
    } catch (error) {
      console.error('Failed to clear token:', error);
      showStatus('Failed to clear token', 'error');
    }
  }
}

// Validate API endpoint
function validateApiEndpoint() {
  const url = apiEndpointInput.value.trim();
  
  if (!url) {
    apiEndpointInput.value = defaultSettings.apiEndpoint;
    return;
  }
  
  try {
    new URL(url);
    // URL is valid
    apiEndpointInput.style.borderColor = '';
  } catch (error) {
    // Invalid URL
    apiEndpointInput.style.borderColor = '#ef4444';
    showStatus('Invalid API endpoint URL', 'error');
  }
}

// Show status message
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.classList.remove('hidden');
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    statusDiv.classList.add('hidden');
  }, 3000);
}

// Request notification permission
async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      notificationsToggle.checked = false;
      showStatus('Notification permission denied', 'error');
    }
  }
}

// Check notification permission on toggle
notificationsToggle.addEventListener('change', () => {
  if (notificationsToggle.checked) {
    requestNotificationPermission();
  }
});