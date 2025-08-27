# Reddit RSS Integration

## Overview
Added live Reddit posts integration to the homepage that displays the latest 10 posts from startup and entrepreneur communities.

## Implementation

### 1. Reddit RSS API (`/api/reddit-rss.ts`)
- Fetches posts from 5 startup-related subreddits:
  - r/startups
  - r/entrepreneur  
  - r/SideProject
  - r/indiehackers
  - r/business
- Returns top 10 posts sorted by engagement (score + comments)
- Includes fallback data if Reddit API fails
- Caches responses for 5 minutes
- Handles timeouts and errors gracefully

### 2. Reddit Posts Component (`/src/components/RedditPosts.tsx`)
- Displays posts in a glassmorphism card design
- Auto-refreshes every 5 minutes
- Shows post metadata (subreddit, score, comments, time)
- Handles loading states and errors
- Responsive design with scrollable content
- Manual refresh button

### 3. Homepage Integration
- Added Reddit posts section below the prompt gallery
- Positioned after the main validation form
- Maintains consistent design with existing components

## Features

### Live Updates
- Posts refresh automatically every 5 minutes
- Manual refresh button available
- Real-time timestamps showing "Xm ago", "Xh ago", etc.

### Fallback System
- If Reddit API fails, shows sample startup-related posts
- Indicates when fallback data is being used
- Ensures the component always displays content

### Performance
- 5-second timeout per subreddit request
- Caches API responses to reduce load
- Limits to 3 posts per subreddit to avoid rate limits

### Design
- Consistent glassmorphism styling
- Hover effects and transitions
- Truncated titles for better layout
- Color-coded subreddit badges
- Engagement metrics display

## Usage
The Reddit posts automatically appear on the homepage below the prompt gallery. Users can:
- Click on any post to open it in a new tab
- See which subreddit each post is from
- View engagement metrics (upvotes, comments)
- Manually refresh the feed
- Scroll through the posts if there are many

## Technical Details
- Uses Reddit's public JSON API (no authentication required)
- Handles CORS properly for browser requests
- TypeScript interfaces for type safety
- Error boundaries and graceful degradation
- Mobile-responsive design

## Future Enhancements
- Add more subreddits based on user preferences
- Filter posts by keywords related to validation
- Add post categories or tags
- Implement user voting/favoriting
- Add search functionality within posts