import asyncio
from dotenv import load_dotenv
import os
from agents import SolarFluidityAgents
from config import Config

async def main():
    # Load environment variables
    load_dotenv()
    
    # Initialize configuration
    config = Config(
        SUPABASE_URL=os.getenv("SUPABASE_URL"),
        SUPABASE_KEY=os.getenv("SUPABASE_KEY"),
        SLACK_BOT_TOKEN=os.getenv("SLACK_BOT_TOKEN"),
        SLACK_CHANNEL_ID=os.getenv("SLACK_CHANNEL_ID"),
        AIRTABLE_API_KEY=os.getenv("AIRTABLE_API_KEY"),
        AIRTABLE_BASE_ID=os.getenv("AIRTABLE_BASE_ID"),
        AIRTABLE_TABLE_NAME=os.getenv("AIRTABLE_TABLE_NAME"),
        OPENAI_API_KEY=os.getenv("OPENAI_API_KEY"),
        GITHUB_TOKEN=os.getenv("GITHUB_TOKEN")
    )
    
    # Initialize agents
    agents = SolarFluidityAgents(config)
    
    # Start monitoring loop
    while True:
        try:
            # Run the agent graph
            final_state = await agents.graph.arun({})
            
            # Log the final state
            print("Monitoring cycle completed:")
            print(f"Status: {final_state.current_status}")
            print(f"Pending Tasks: {len(final_state.pending_tasks)}")
            print(f"Alerts: {len(final_state.alerts)}")
            
            # Wait before next cycle
            await asyncio.sleep(300)  # 5 minutes between cycles
            
        except Exception as e:
            print(f"Error in monitoring cycle: {str(e)}")
            await asyncio.sleep(60)  # Wait 1 minute before retry

if __name__ == "__main__":
    asyncio.run(main())
