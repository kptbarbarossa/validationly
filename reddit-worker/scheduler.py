import schedule
import time
import logging
from reddit_worker import main

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def job():
    """Scheduled job to run Reddit data collection"""
    logger.info("Starting scheduled Reddit data collection")
    try:
        main()
        logger.info("Scheduled job completed successfully")
    except Exception as e:
        logger.error(f"Scheduled job failed: {e}")

# Schedule the job to run every 6 hours
schedule.every(6).hours.do(job)

# Also run once immediately for testing
logger.info("Running initial Reddit data collection")
job()

logger.info("Reddit Validation Scheduler started")
logger.info("Next run scheduled in 6 hours")

# Keep the scheduler running
while True:
    schedule.run_pending()
    time.sleep(60)  # Check every minute