from pydantic import BaseModel
from typing import Optional, Dict, List

class Config(BaseModel):
    # Supabase
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    # Slack
    SLACK_BOT_TOKEN: str
    SLACK_CHANNEL_ID: str
    
    # Airtable
    AIRTABLE_API_KEY: str
    AIRTABLE_BASE_ID: str
    AIRTABLE_TABLE_NAME: str
    
    # OpenAI
    OPENAI_API_KEY: str = "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"
    
    # GitHub
    GITHUB_TOKEN: str
    GITHUB_REPO: str = "KevinCElizondo/proyectosolar"

    # Monitoring Channels
    MONITORING_CHANNELS = {
        "development": "C123...", # Replace with actual Slack channel IDs
        "production": "C456...",
        "errors": "C789..."
    }

    # Project Structure
    REQUIRED_DIRECTORIES = [
        "src/components",
        "src/pages",
        "src/services",
        "src/utils",
        "api/src/routes",
        "api/src/services",
        "docs",
        "scripts"
    ]

    REQUIRED_FILES = [
        ".env.example",
        "docker-compose.yml",
        "README.md",
        "package.json"
    ]

    # Integration Points
    INTEGRATION_CHECKS = {
        "supabase": ["database", "authentication", "storage"],
        "hacienda": ["certificates", "api_access"],
        "paypal": ["sandbox", "production"]
    }
