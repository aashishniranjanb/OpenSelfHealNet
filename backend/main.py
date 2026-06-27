"""
OpenSelfHealNet Backend — FastAPI + NetworkX
Provides simulation engine, routing algorithms, and WebSocket updates.
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json

from simulator.network import NetworkSimulator

app = FastAPI(
    title="OpenSelfHealNet API",
    description="Backend simulation engine for the OpenSelfHealNet digital twin",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

simulator = NetworkSimulator()


class FailureRequest(BaseModel):
    node_id: str
    failure_type: str = "power"  # power, fiber, storm, cyber


class RecoveryRequest(BaseModel):
    strategy: str = "mesh"  # mesh, drone, repair, satellite
    target_node: Optional[str] = None


@app.get("/")
async def root():
    return {
        "name": "OpenSelfHealNet API",
        "version": "1.0.0",
        "status": "operational",
    }


@app.get("/api/network")
async def get_network():
    """Get current network state."""
    return simulator.get_state()


@app.get("/api/stats")
async def get_stats():
    """Get network statistics."""
    return simulator.get_stats()


@app.post("/api/failure")
async def trigger_failure(req: FailureRequest):
    """Trigger a failure on a specific node."""
    result = simulator.trigger_failure(req.node_id, req.failure_type)
    return result


@app.post("/api/recover")
async def trigger_recovery(req: RecoveryRequest):
    """Execute a recovery strategy."""
    result = simulator.recover(req.strategy, req.target_node)
    return result


@app.post("/api/reset")
async def reset_network():
    """Reset network to default state."""
    simulator.reset()
    return {"status": "reset", "message": "Network restored to default state"}


@app.get("/api/path/{source}/{target}")
async def find_path(source: str, target: str):
    """Find shortest path between two nodes."""
    path = simulator.find_shortest_path(source, target)
    return {"source": source, "target": target, "path": path}


from fastapi.staticfiles import StaticFiles

# WebSocket for live updates
connected_clients: list[WebSocket] = []


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            action = message.get("action")

            if action == "get_state":
                state = simulator.get_state()
                await websocket.send_json({"type": "state", "data": state})
            elif action == "failure":
                result = simulator.trigger_failure(
                    message.get("node_id", ""),
                    message.get("failure_type", "power"),
                )
                for client in connected_clients:
                    await client.send_json({"type": "failure", "data": result})
            elif action == "recover":
                result = simulator.recover(
                    message.get("strategy", "mesh"),
                    message.get("target_node"),
                )
                for client in connected_clients:
                    await client.send_json({"type": "recovery", "data": result})
            elif action == "reset":
                simulator.reset()
                state = simulator.get_state()
                for client in connected_clients:
                    await client.send_json({"type": "reset", "data": state})

    except WebSocketDisconnect:
        connected_clients.remove(websocket)


# Mount Next.js static build directory (frontend/out) to serve the user interface on port 8000
app.mount("/", StaticFiles(directory="../frontend/out", html=True), name="static")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
