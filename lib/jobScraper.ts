import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export interface JobPosting {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string;
  jobType?: string;
  industry?: string;
  requirements?: string[];
  benefits?: string[];
  postedDate?: string;
}

export class JobScraper {
  private browser: any = null;

  async init() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // LinkedIn job scraping
  async scrapeLinkedInJob(jobUrl: string): Promise<JobPosting | null> {
    try {
      await this.init();
      const page = await this.browser.newPage();
      
      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      await page.goto(jobUrl, { waitUntil: 'networkidle2' });
      
      // Wait for content to load
      await page.waitForSelector('.job-details-jobs-unified-top-card__job-title', { timeout: 10000 });
      
      const content = await page.content();
      const $ = cheerio.load(content);
      
      const job: JobPosting = {
        title: $('.job-details-jobs-unified-top-card__job-title').text().trim(),
        company: $('.job-details-jobs-unified-top-card__company-name').text().trim(),
        location: $('.job-details-jobs-unified-top-card__bullet').first().text().trim(),
        description: $('.job-details-jobs-unified-top-card__job-description').text().trim() || 
                    $('.jobs-description__content').text().trim(),
        url: jobUrl
      };

      // Extract additional details
      const salaryElement = $('.job-details-jobs-unified-top-card__job-insight').filter((_, el) => 
        $(el).text().includes('$') || $(el).text().includes('salary')
      );
      if (salaryElement.length) {
        job.salary = salaryElement.text().trim();
      }

      // Extract job type
      const jobTypeElement = $('.job-details-jobs-unified-top-card__job-insight').filter((_, el) => 
        $(el).text().toLowerCase().includes('full-time') || 
        $(el).text().toLowerCase().includes('part-time') ||
        $(el).text().toLowerCase().includes('contract')
      );
      if (jobTypeElement.length) {
        job.jobType = jobTypeElement.text().trim();
      }

      await page.close();
      return job;
    } catch (error) {
      console.error('LinkedIn scraping error:', error);
      return null;
    }
  }

  // Indeed job scraping
  async scrapeIndeedJob(jobUrl: string): Promise<JobPosting | null> {
    try {
      await this.init();
      const page = await this.browser.newPage();
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      await page.goto(jobUrl, { waitUntil: 'networkidle2' });
      
      const content = await page.content();
      const $ = cheerio.load(content);
      
      const job: JobPosting = {
        title: $('[data-testid="jobsearch-JobInfoHeader-title"]').text().trim() || 
               $('.jobsearch-JobInfoHeader-title').text().trim(),
        company: $('[data-testid="inlineHeader-companyName"]').text().trim() ||
                $('.jobsearch-InlineCompanyRating').first().text().trim(),
        location: $('[data-testid="job-location"]').text().trim() ||
                 $('.jobsearch-JobInfoHeader-subtitle').text().trim(),
        description: $('#jobDescriptionText').text().trim() ||
                    $('[data-testid="jobsearch-jobDescriptionText"]').text().trim(),
        url: jobUrl
      };

      // Extract salary if available
      const salaryElement = $('.jobsearch-JobMetadataHeader-item').filter((_, el) => 
        $(el).text().includes('$') || $(el).text().toLowerCase().includes('salary')
      );
      if (salaryElement.length) {
        job.salary = salaryElement.text().trim();
      }

      await page.close();
      return job;
    } catch (error) {
      console.error('Indeed scraping error:', error);
      return null;
    }
  }

  // Generic job URL detection and scraping
  async scrapeJobPosting(url: string): Promise<JobPosting | null> {
    const domain = new URL(url).hostname.toLowerCase();
    
    if (domain.includes('linkedin.com')) {
      return this.scrapeLinkedInJob(url);
    } else if (domain.includes('indeed.com')) {
      return this.scrapeIndeedJob(url);
    } else {
      // Generic scraping for other sites
      return this.scrapeGenericJob(url);
    }
  }

  // Alias for scrapeJobPosting for API compatibility
  async scrapeJobDetails(url: string): Promise<JobPosting | null> {
    return this.scrapeJobPosting(url);
  }

  // Generic job scraping for unknown sites
  private async scrapeGenericJob(jobUrl: string): Promise<JobPosting | null> {
    try {
      await this.init();
      const page = await this.browser.newPage();
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      await page.goto(jobUrl, { waitUntil: 'networkidle2' });
      
      const content = await page.content();
      const $ = cheerio.load(content);
      
      // Try to extract job information using common selectors
      const possibleTitles = [
        'h1', '.job-title', '.position-title', '[data-testid*="title"]',
        '.title', '#job-title', '.job-header h1'
      ];
      
      const possibleCompanies = [
        '.company-name', '.employer', '[data-testid*="company"]',
        '.company', '#company', '.job-company'
      ];
      
      const possibleDescriptions = [
        '.job-description', '.description', '.job-content',
        '#job-description', '[data-testid*="description"]'
      ];

      let title = '';
      let company = '';
      let description = '';

      // Try to find title
      for (const selector of possibleTitles) {
        const element = $(selector).first();
        if (element.length && element.text().trim()) {
          title = element.text().trim();
          break;
        }
      }

      // Try to find company
      for (const selector of possibleCompanies) {
        const element = $(selector).first();
        if (element.length && element.text().trim()) {
          company = element.text().trim();
          break;
        }
      }

      // Try to find description
      for (const selector of possibleDescriptions) {
        const element = $(selector).first();
        if (element.length && element.text().trim()) {
          description = element.text().trim();
          break;
        }
      }

      // Fallback: use page title and meta description
      if (!title) {
        title = $('title').text().trim();
      }
      
      if (!description) {
        description = $('meta[name="description"]').attr('content') || '';
      }

      await page.close();

      if (title && description) {
        return {
          title,
          company: company || 'Unknown Company',
          location: 'Not specified',
          description,
          url: jobUrl
        };
      }

      return null;
    } catch (error) {
      console.error('Generic scraping error:', error);
      return null;
    }
  }

  // Search jobs on LinkedIn (requires authentication - for future implementation)
  async searchLinkedInJobs(_query: string, _location: string = '', _limit: number = 10): Promise<JobPosting[]> {
    // This would require LinkedIn API access or authenticated scraping
    // For now, return empty array
    console.log('LinkedIn job search not implemented yet');
    return [];
  }

  // Search jobs on Indeed
  async searchIndeedJobs(query: string, location: string = '', limit: number = 10): Promise<JobPosting[]> {
    try {
      await this.init();
      const page = await this.browser.newPage();
      
      const searchUrl = `https://www.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`;
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
      
      const content = await page.content();
      const $ = cheerio.load(content);
      
      const jobs: JobPosting[] = [];
      
      $('.job_seen_beacon, .slider_container .slider_item').each((_index, element) => {
        if (jobs.length >= limit) return false;
        
        const $job = $(element);
        const titleElement = $job.find('[data-testid="job-title"] a, .jobTitle a');
        const companyElement = $job.find('[data-testid="company-name"], .companyName');
        const locationElement = $job.find('[data-testid="job-location"], .companyLocation');
        const summaryElement = $job.find('[data-testid="job-snippet"], .summary');
        
        const title = titleElement.text().trim();
        const company = companyElement.text().trim();
        const location = locationElement.text().trim();
        const description = summaryElement.text().trim();
        const jobUrl = titleElement.attr('href');
        
        if (title && company && jobUrl) {
          jobs.push({
            title,
            company,
            location,
            description,
            url: jobUrl.startsWith('http') ? jobUrl : `https://www.indeed.com${jobUrl}`
          });
        }
      });
      
      await page.close();
      return jobs;
    } catch (error) {
      console.error('Indeed search error:', error);
      return [];
    }
  }

  // Extract job requirements from description
  static extractRequirements(description: string): string[] {
    const requirements: string[] = [];
    const text = description.toLowerCase();
    
    // Common requirement patterns
    const patterns = [
      /(?:require[sd]?|must have|need|looking for)[:\s]*([^.!?]+)/gi,
      /(?:experience with|knowledge of|proficient in)[:\s]*([^.!?]+)/gi,
      /(?:\d+\+?\s*years?)[^.!?]*/gi,
      /(?:bachelor|master|phd|degree)[^.!?]*/gi
    ];
    
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        requirements.push(...matches.map(match => match.trim()));
      }
    });
    
    return [...new Set(requirements)].slice(0, 10); // Remove duplicates and limit
  }

  // Extract benefits from description
  static extractBenefits(description: string): string[] {
    const benefits: string[] = [];
    const text = description.toLowerCase();
    
    const benefitKeywords = [
      'health insurance', 'dental', 'vision', '401k', 'retirement',
      'vacation', 'pto', 'paid time off', 'flexible hours', 'remote work',
      'work from home', 'bonus', 'stock options', 'equity', 'gym membership',
      'free lunch', 'coffee', 'learning budget', 'conference', 'training'
    ];
    
    benefitKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        benefits.push(keyword);
      }
    });
    
    return benefits;
  }
}