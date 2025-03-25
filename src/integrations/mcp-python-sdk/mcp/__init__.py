"""
MCP Python SDK - Implementación mínima para Solar Fluidity
"""

import json
import sys
import asyncio
from typing import Dict, Any, List, Optional, Callable, Union

class MCPServer:
    """Implementación básica de un servidor MCP."""
    
    def __init__(self):
        self.resources = {}
        self.tools = {}
        self.running = False
    
    def register_resource(self, resource_path: str, handler: Callable):
        """Registra un recurso en el servidor MCP."""
        self.resources[resource_path] = handler
    
    def register_tool(self, tool_name: str, handler: Callable):
        """Registra una herramienta en el servidor MCP."""
        self.tools[tool_name] = handler
    
    async def handle_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Maneja una solicitud JSON-RPC."""
        method = request.get("method", "")
        params = request.get("params", {})
        req_id = request.get("id")
        
        if method == "initialize":
            return {
                "jsonrpc": "2.0",
                "result": {
                    "capabilities": {
                        "resources": True,
                        "tools": True
                    }
                },
                "id": req_id
            }
        
        elif method == "mcp/listResources":
            return {
                "jsonrpc": "2.0",
                "result": list(self.resources.keys()),
                "id": req_id
            }
        
        elif method == "mcp/listTools":
            return {
                "jsonrpc": "2.0",
                "result": list(self.tools.keys()),
                "id": req_id
            }
        
        elif method == "mcp/readResource":
            resource_path = params.get("path", "")
            if resource_path in self.resources:
                handler = self.resources[resource_path]
                result = await handler(params)
                return {
                    "jsonrpc": "2.0",
                    "result": result,
                    "id": req_id
                }
            else:
                return {
                    "jsonrpc": "2.0",
                    "error": {
                        "code": -32601,
                        "message": f"Resource not found: {resource_path}"
                    },
                    "id": req_id
                }
        
        elif method == "mcp/callTool":
            tool_name = params.get("name", "")
            tool_args = params.get("args", {})
            if tool_name in self.tools:
                handler = self.tools[tool_name]
                result = await handler(tool_args)
                return {
                    "jsonrpc": "2.0",
                    "result": result,
                    "id": req_id
                }
            else:
                return {
                    "jsonrpc": "2.0",
                    "error": {
                        "code": -32601,
                        "message": f"Tool not found: {tool_name}"
                    },
                    "id": req_id
                }
        
        else:
            return {
                "jsonrpc": "2.0",
                "error": {
                    "code": -32601,
                    "message": f"Method not found: {method}"
                },
                "id": req_id
            }
    
    async def run(self):
        """Ejecuta el servidor MCP."""
        self.running = True
        
        # Leer de stdin y escribir a stdout
        while self.running:
            try:
                line = await self._read_line()
                if not line:
                    continue
                
                request = json.loads(line)
                response = await self.handle_request(request)
                
                await self._write_line(json.dumps(response))
                
                # Si recibimos un método de cierre, terminamos
                if request.get("method") == "shutdown":
                    self.running = False
                    break
                
            except Exception as e:
                error_response = {
                    "jsonrpc": "2.0",
                    "error": {
                        "code": -32603,
                        "message": f"Internal error: {str(e)}"
                    },
                    "id": None
                }
                await self._write_line(json.dumps(error_response))
    
    async def _read_line(self) -> str:
        """Lee una línea de stdin."""
        return await asyncio.get_event_loop().run_in_executor(None, sys.stdin.readline)
    
    async def _write_line(self, line: str):
        """Escribe una línea a stdout."""
        print(line, flush=True)

def create_server() -> MCPServer:
    """Crea y devuelve una instancia del servidor MCP."""
    return MCPServer()
