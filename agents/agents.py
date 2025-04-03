from typing import Dict, List, Tuple
from langgraph.graph import Graph, StateGraph
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from pydantic import BaseModel
import supabase
from slack_sdk import WebClient
from airtable import Airtable
from datetime import datetime
import os
from config import Config

class ProjectState(BaseModel):
    messages: List[str] = []
    current_status: Dict[str, str] = {}
    pending_tasks: List[Dict] = []
    alerts: List[str] = []

class SolarFluidityAgents:
    def __init__(self, config: Config):
        self.config = config
        self.llm = ChatOpenAI(api_key=config.OPENAI_API_KEY)
        self.slack = WebClient(token=config.SLACK_BOT_TOKEN)
        self.airtable = Airtable(config.AIRTABLE_BASE_ID, config.AIRTABLE_TABLE_NAME, config.AIRTABLE_API_KEY)
        self.supabase = supabase.create_client(config.SUPABASE_URL, config.SUPABASE_KEY)
        self.zapier_channel = "your-channel"  # Replace with actual channel
        
        # Initialize the agent graph
        self.graph = self._create_agent_graph()

    def _create_agent_graph(self) -> StateGraph:
        # Create the graph
        graph = StateGraph(ProjectState)

        # Add nodes
        graph.add_node("project_monitor", self.project_monitor_agent)
        graph.add_node("integration_checker", self.integration_checker_agent)
        graph.add_node("task_manager", self.task_manager_agent)
        graph.add_node("notification_handler", self.notification_handler_agent)

        # Define the flow
        graph.add_edge("project_monitor", "integration_checker")
        graph.add_edge("integration_checker", "task_manager")
        graph.add_edge("task_manager", "notification_handler")

        # Conditional edges
        graph.add_conditional_edges(
            "notification_handler",
            self.should_continue_monitoring,
            {
                True: "project_monitor",
                False: "END"
            }
        )

        return graph.compile()

    async def project_monitor_agent(self, state: ProjectState) -> ProjectState:
        """Monitor project structure and git repository status"""
        try:
            # Check repository structure
            missing_files = self.check_required_files()
            if missing_files:
                state.alerts.append(f"Missing required files: {', '.join(missing_files)}")

            # Check git status
            repo_status = self.check_git_status()
            state.current_status["git"] = repo_status

            # Update Airtable with current status
            self.update_airtable_status(state.current_status)

            return state
        except Exception as e:
            state.alerts.append(f"Project monitoring error: {str(e)}")
            return state

    async def integration_checker_agent(self, state: ProjectState) -> ProjectState:
        """Check integration points status"""
        try:
            # Check Supabase connection
            supabase_status = self.check_supabase_connection()
            state.current_status["supabase"] = supabase_status

            # Check other integrations
            for integration, checks in self.config.INTEGRATION_CHECKS.items():
                status = self.check_integration_status(integration, checks)
                state.current_status[integration] = status

            return state
        except Exception as e:
            state.alerts.append(f"Integration check error: {str(e)}")
            return state

    async def task_manager_agent(self, state: ProjectState) -> ProjectState:
        """Manage and prioritize tasks based on monitoring results"""
        try:
            # Analyze current status and create tasks
            new_tasks = self.analyze_and_create_tasks(state.current_status)
            state.pending_tasks.extend(new_tasks)

            # Update Airtable with tasks
            self.update_airtable_tasks(new_tasks)

            return state
        except Exception as e:
            state.alerts.append(f"Task management error: {str(e)}")
            return state

    async def notification_handler_agent(self, state: ProjectState) -> ProjectState:
        """Handle notifications and alerts"""
        try:
            # Send alerts to appropriate Slack channels
            for alert in state.alerts:
                self.send_slack_alert(alert)

            # Update project status in Slack
            self.update_slack_status(state.current_status)

            # Clear processed alerts
            state.alerts = []

            return state
        except Exception as e:
            print(f"Notification error: {str(e)}")
            return state

    async def send_direct_message(self, user: str, message: str):
        """Send a direct message using Zapier's send_direct_message tool"""
        try:
            response = await self.zapier.send_direct_message(
                channel=user,
                text=message,
                send_multi="false",
                as_bot="true",
                add_edit_link="false",
                image_url="",
                unfurl="false",
                link_names="false",
                post_at=""
            )
            if not response["ok"]:
                print(f"Failed to send direct message: {response['error']}")
        except Exception as e:
            print(f"Zapier direct message error: {str(e)}")

    def should_continue_monitoring(self, state: ProjectState) -> bool:
        """Determine if monitoring should continue"""
        # Add logic to determine if monitoring should continue
        return True

    # Utility methods
    def check_required_files(self) -> List[str]:
        """Check for required files in the project"""
        missing_files = []
        for file_path in self.config.REQUIRED_FILES:
            if not os.path.exists(file_path):
                missing_files.append(file_path)
        return missing_files

    def check_git_status(self) -> str:
        """Check git repository status"""
        # Implement git status check
        return "active"

    def check_supabase_connection(self) -> str:
        """Check Supabase connection status"""
        try:
            # Test Supabase connection
            self.supabase.table("users").select("*").limit(1).execute()
            return "connected"
        except Exception as e:
            return f"error: {str(e)}"

    def check_integration_status(self, integration: str, checks: List[str]) -> str:
        """Check status of specific integration"""
        # Implement integration check
        return "active"

    def analyze_and_create_tasks(self, status: Dict[str, str]) -> List[Dict]:
        """Analyze status and create tasks"""
        tasks = []
        for component, state in status.items():
            if state != "active":
                tasks.append({
                    "component": component,
                    "status": state,
                    "priority": "high" if "error" in state else "medium",
                    "created_at": datetime.now().isoformat()
                })
        return tasks

    def update_airtable_status(self, status: Dict[str, str]):
        """Update project status in Airtable"""
        try:
            self.airtable.insert({
                "Status": str(status),
                "Timestamp": datetime.now().isoformat()
            })
        except Exception as e:
            print(f"Airtable update error: {str(e)}")

    def update_airtable_tasks(self, tasks: List[Dict]):
        """Update tasks in Airtable"""
        try:
            for task in tasks:
                self.airtable.insert(task)
        except Exception as e:
            print(f"Airtable tasks update error: {str(e)}")

    def send_slack_alert(self, alert: str):
        """Send alert to appropriate Slack channel"""
        try:
            response = self.slack.chat_postMessage(
                channel=self.config.MONITORING_CHANNELS["alerts"],
                text=alert
            )
            if not response["ok"]:
                print(f"Failed to send alert: {response['error']}")
        except Exception as e:
            print(f"Slack alert error: {str(e)}")

    def update_slack_status(self, status: Dict[str, str]):
        """Update project status in Slack"""
        try:
            status_message = "Project Status Update:\n" + \
                "\n".join([f"{k}: {v}" for k, v in status.items()])
            
            response = self.slack.chat_postMessage(
                channel=self.config.MONITORING_CHANNELS["development"],
                text=status_message
            )
            if not response["ok"]:
                print(f"Failed to update status: {response['error']}")
        except Exception as e:
            print(f"Slack status update error: {str(e)}")
