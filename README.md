# X (Twitter) Hashtag Scraper

A Python-based web scraper for X (formerly Twitter) that collects tweets from hashtags using Selenium WebDriver. The scraper intelligently detects whether login is required and handles both public and authenticated scenarios.

## Features

- 🤖 **Auto-detection**: Automatically detects if login is required based on page accessibility
- 🔓 **Smart Login**: Prompts for manual login only when necessary
- 📊 **Excel Export**: Saves scraped data to Excel files (.xlsx)
- 🔄 **Deduplication**: Automatically removes duplicate tweets
- 🕵️ **Stealth Mode**: Uses anti-detection techniques to avoid automation flags
- 📈 **Rich Data**: Extracts tweet ID, date, username, display name, content, URL, and engagement metrics (likes, retweets, replies)

## Requirements

- Python 3.7+
- Google Chrome browser installed
- Internet connection

## Installation

1. Clone this repository:
```bash
git clone https://github.com/your-username/repo-name.git
cd repo-name
```

2. Install required Python packages:
```bash
pip install -r requirements.txt
```

The installation will automatically download and install ChromeDriver using webdriver-manager.

## Configuration

Edit the configuration section in `main.py`:

```python
# Hashtags to scrape
HASHTAGS = ["GenZ002", "ثعالب_الوعي", "Viral_Foxes"]

# Output folder for Excel files
OUTPUT_FOLDER = r"C:\Users\Administrator\Downloads\bot_code\Scrapers\X"

# Maximum tweets to collect per hashtag
DEFAULT_MAX = 500
```

## Usage

Run the scraper:

```bash
python main.py
```

### How it Works

1. **Probe Phase**: The scraper first checks if the hashtag page is publicly accessible
2. **Login Phase** (if needed): Opens X login page and waits for manual login
3. **Scraping Phase**: Scrolls through the hashtag feed, collecting tweets
4. **Export Phase**: Saves collected data to Excel files

The scraper will create separate Excel files for each hashtag in the specified output folder.

## Output Format

Each Excel file contains the following columns:
- `tweet_id`: Unique tweet identifier
- `date`: Publication date
- `username`: Twitter username
- `display_name`: Display name
- `content`: Tweet text content
- `url`: Direct link to the tweet
- `replies`: Number of replies
- `retweets`: Number of retweets
- `likes`: Number of likes

## Features in Detail

### Anti-Detection Techniques
- Random scroll delays
- Automation flag concealment
- Human-like browser behavior

### Error Handling
- Automatic retry mechanisms
- Graceful failure handling
- Detailed error logging

### Data Quality
- Automatic deduplication by tweet ID
- Robust HTML parsing
- Fallback mechanisms for missing data

## Notes

- Be respectful of X's Terms of Service
- Use appropriate delays between requests
- Consider rate limits when scraping large datasets
- Some content may require authentication to access

## License

This project is provided as-is for educational and research purposes.

## Contributing

Contributions, issues, and feature requests are welcome!

## Disclaimer

This tool is for educational purposes only. Users are responsible for complying with X's Terms of Service and applicable laws. The authors are not responsible for any misuse of this software.

