// Job Tailor Content Script - Job Detection

(function() {
  'use strict';
  
  let jobData = null;
  let isProcessing = false;
  
  // Initialize job detection
  function init() {
    console.log('Job Tailor: Initializing job detection');
    
    // Wait for page to load completely
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', detectJob);
    } else {
      detectJob();
    }
    
    // Also detect on dynamic content changes
    const observer = new MutationObserver(debounce(detectJob, 2000));
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Detect job posting on current page
  function detectJob() {
    if (isProcessing) return;
    isProcessing = true;
    
    try {
      const hostname = window.location.hostname;
      let extractedData = null;
      
      if (hostname.includes('linkedin.com')) {
        extractedData = extractLinkedInJob();
      } else if (hostname.includes('indeed.com')) {
        extractedData = extractIndeedJob();
      } else if (hostname.includes('glassdoor.com')) {
        extractedData = extractGlassdoorJob();
      } else {
        extractedData = extractGenericJob();
      }
      
      if (extractedData && extractedData.title && extractedData.description) {
        jobData = extractedData;
        
        // Send to background script
        chrome.runtime.sendMessage({
          type: 'JOB_DETECTED',
          data: jobData
        });
        
        // Add floating action button
        addFloatingButton();
        
        console.log('Job Tailor: Job detected', jobData);
      }
    } catch (error) {
      console.error('Job Tailor: Detection error', error);
    } finally {
      isProcessing = false;
    }
  }
  
  // Extract job data from LinkedIn
  function extractLinkedInJob() {
    const selectors = {
      title: '.job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title',
      company: '.job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name',
      location: '.job-details-jobs-unified-top-card__bullet, .jobs-unified-top-card__bullet',
      description: '.job-details-jobs-unified-top-card__job-description, .jobs-description__content'
    };
    
    return extractWithSelectors(selectors);
  }
  
  // Extract job data from Indeed
  function extractIndeedJob() {
    const selectors = {
      title: '[data-testid="jobsearch-JobInfoHeader-title"], .jobsearch-JobInfoHeader-title',
      company: '[data-testid="inlineHeader-companyName"], .jobsearch-InlineCompanyRating',
      location: '[data-testid="job-location"], .jobsearch-JobInfoHeader-subtitle',
      description: '#jobDescriptionText, [data-testid="jobsearch-jobDescriptionText"]'
    };
    
    return extractWithSelectors(selectors);
  }
  
  // Extract job data from Glassdoor
  function extractGlassdoorJob() {
    const selectors = {
      title: '[data-test="job-title"], .jobTitle',
      company: '[data-test="employer-name"], .employerName',
      location: '[data-test="job-location"], .location',
      description: '[data-test="jobDescriptionContent"], .jobDescriptionContent'
    };
    
    return extractWithSelectors(selectors);
  }
  
  // Generic job extraction for unknown sites
  function extractGenericJob() {
    const titleSelectors = ['h1', '.job-title', '.position-title', '.title'];
    const companySelectors = ['.company-name', '.employer', '.company'];
    const descriptionSelectors = ['.job-description', '.description', '.job-content'];
    
    const title = findTextBySelectors(titleSelectors);
    const company = findTextBySelectors(companySelectors);
    const description = findTextBySelectors(descriptionSelectors);
    
    if (title && description) {
      return {
        title: title.trim(),
        company: company ? company.trim() : 'Unknown Company',
        location: 'Not specified',
        description: description.trim(),
        url: window.location.href
      };
    }
    
    return null;
  }
  
  // Extract job data using provided selectors
  function extractWithSelectors(selectors) {
    const title = findTextBySelectors([selectors.title]);
    const company = findTextBySelectors([selectors.company]);
    const location = findTextBySelectors([selectors.location]);
    const description = findTextBySelectors([selectors.description]);
    
    if (title && description) {
      return {
        title: title.trim(),
        company: company ? company.trim() : 'Unknown Company',
        location: location ? location.trim() : 'Not specified',
        description: description.trim(),
        url: window.location.href
      };
    }
    
    return null;
  }
  
  // Find text content using multiple selectors
  function findTextBySelectors(selectors) {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent && element.textContent.trim()) {
        return element.textContent.trim();
      }
    }
    return null;
  }
  
  // Add floating action button
  function addFloatingButton() {
    // Remove existing button
    const existing = document.getElementById('job-tailor-fab');
    if (existing) {
      existing.remove();
    }
    
    // Create floating action button
    const fab = document.createElement('div');
    fab.id = 'job-tailor-fab';
    fab.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #4F46E5, #06B6D4);
        border-radius: 50%;
        box-shadow: 0 4px 20px rgba(79, 70, 229, 0.3);
        cursor: pointer;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        border: none;
      " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      </div>
    `;
    
    // Add click handler
    fab.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        type: 'OPEN_POPUP',
        data: jobData
      });
    });
    
    document.body.appendChild(fab);
    
    // Add tooltip
    const tooltip = document.createElement('div');
    tooltip.innerHTML = 'Optimize CV for this job';
    tooltip.style.cssText = `
      position: fixed;
      bottom: 90px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 10001;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      white-space: nowrap;
    `;
    
    fab.addEventListener('mouseenter', () => {
      document.body.appendChild(tooltip);
      setTimeout(() => tooltip.style.opacity = '1', 10);
    });
    
    fab.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
      setTimeout(() => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      }, 300);
    });
  }
  
  // Utility: Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Start detection
  init();
  
})();