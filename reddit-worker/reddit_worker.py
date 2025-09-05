import praw
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client
import time
import logging

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Reddit API
reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)

# Initialize Supabase
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

def sanitize_content(text):
    """Sanitize Reddit content for compliance"""
    if not text:
        return ""
    
    # Remove PII patterns
    text = text.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, "[CARD_NUMBER]")
    text = text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL]")
    text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN]")
    
    # Limit length for Reddit compliance
    return text[:5000] + "..." if len(text) > 5000 else text

def fetch_reddit_data(query, subreddits, limit=100):
    """Fetch Reddit data using PRAW"""
    posts = []
    
    for subreddit_name in subreddits:
        try:
            logger.info(f"Fetching from r/{subreddit_name}")
            subreddit = reddit.subreddit(subreddit_name)
            
            # Search for posts
            for submission in subreddit.search(query, time_filter="all", limit=limit):
                posts.append({
                    "reddit_id": submission.id,
                    "subreddit": subreddit_name,
                    "title": sanitize_content(submission.title),
                    "selftext": sanitize_content(submission.selftext),
                    "author": str(submission.author) if submission.author else "[deleted]",
                    "score": submission.score,
                    "num_comments": submission.num_comments,
                    "created_utc": datetime.fromtimestamp(submission.created_utc),
                    "url": submission.url,
                    "permalink": f"https://reddit.com{submission.permalink}",
                    "sanitized_content": sanitize_content(f"{submission.title} {submission.selftext}"),
                    "compliance_note": "Data collected in compliance with Reddit API terms using PRAW"
                })
                
                # Rate limiting
                time.sleep(0.1)
                
        except Exception as e:
            logger.error(f"Error fetching from r/{subreddit_name}: {e}")
            continue
    
    return posts

def save_to_supabase(posts):
    """Save Reddit posts to Supabase"""
    if not posts:
        return
    
    try:
        # Insert posts in batches
        batch_size = 50
        for i in range(0, len(posts), batch_size):
            batch = posts[i:i + batch_size]
            result = supabase.table("reddit_posts").insert(batch).execute()
            logger.info(f"Saved {len(batch)} posts to Supabase")
            
    except Exception as e:
        logger.error(f"Error saving to Supabase: {e}")

def main():
    """Main function to run Reddit data collection"""
    logger.info("Starting Reddit Validation Worker")
    
    # Target subreddits for startup validation
    subreddits = [
        "startups", "entrepreneur", "SaaS", "indiehackers", 
        "business", "smallbusiness", "marketing", "productivity"
    ]
    
    # Search queries
    queries = [
        "startup idea", "business idea", "SaaS idea", "app idea",
        "pain point", "problem", "frustration", "challenge"
    ]
    
    all_posts = []
    
    for query in queries:
        logger.info(f"Searching for: {query}")
        posts = fetch_reddit_data(query, subreddits, limit=50)
        all_posts.extend(posts)
        
        # Rate limiting between queries
        time.sleep(2)
    
    # Remove duplicates based on reddit_id
    unique_posts = {}
    for post in all_posts:
        unique_posts[post["reddit_id"]] = post
    
    final_posts = list(unique_posts.values())
    logger.info(f"Found {len(final_posts)} unique posts")
    
    # Save to Supabase
    save_to_supabase(final_posts)
    
    logger.info("Reddit Validation Worker completed successfully")

if __name__ == "__main__":
    main()