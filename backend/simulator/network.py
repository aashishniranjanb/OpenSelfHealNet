"""
Network Simulator using NetworkX
Provides graph-based simulation of communication network topology.
"""

import networkx as nx
import random
from typing import Optional


class NetworkSimulator:
    def __init__(self):
        self.graph = nx.Graph()
        self._build_default_network()
        self.events: list[dict] = []

    def _build_default_network(self):
        """Build default network topology."""
        # Nodes
        nodes = [
            ("gateway-1", {"type": "gateway", "label": "Internet Gateway", "status": "healthy", "capacity": 100, "load": 35, "latency": 5, "connected_users": 0, "battery": 100, "x": 500, "y": 50}),
            ("core-1", {"type": "core", "label": "Core Network A", "status": "healthy", "capacity": 100, "load": 45, "latency": 8, "connected_users": 0, "battery": 100, "x": 300, "y": 180}),
            ("core-2", {"type": "core", "label": "Core Network B", "status": "healthy", "capacity": 100, "load": 40, "latency": 10, "connected_users": 0, "battery": 100, "x": 700, "y": 180}),
            ("router-1", {"type": "router", "label": "Regional Router 1", "status": "healthy", "capacity": 80, "load": 55, "latency": 12, "connected_users": 0, "battery": 100, "x": 150, "y": 320}),
            ("router-2", {"type": "router", "label": "Regional Router 2", "status": "healthy", "capacity": 80, "load": 50, "latency": 14, "connected_users": 0, "battery": 100, "x": 500, "y": 320}),
            ("router-3", {"type": "router", "label": "Regional Router 3", "status": "healthy", "capacity": 80, "load": 48, "latency": 11, "connected_users": 0, "battery": 100, "x": 850, "y": 320}),
            ("tower-1", {"type": "tower", "label": "Cell Tower Alpha", "status": "healthy", "capacity": 70, "load": 60, "latency": 18, "connected_users": 542, "battery": 95, "x": 80, "y": 480}),
            ("tower-2", {"type": "tower", "label": "Cell Tower Beta", "status": "healthy", "capacity": 70, "load": 72, "latency": 22, "connected_users": 891, "battery": 88, "x": 280, "y": 480}),
            ("tower-3", {"type": "tower", "label": "Cell Tower Gamma", "status": "healthy", "capacity": 70, "load": 45, "latency": 15, "connected_users": 634, "battery": 100, "x": 500, "y": 480}),
            ("tower-4", {"type": "tower", "label": "Cell Tower Delta", "status": "healthy", "capacity": 70, "load": 38, "latency": 20, "connected_users": 423, "battery": 92, "x": 720, "y": 480}),
            ("tower-5", {"type": "tower", "label": "Cell Tower Epsilon", "status": "healthy", "capacity": 70, "load": 65, "latency": 25, "connected_users": 756, "battery": 78, "x": 920, "y": 480}),
        ]

        for node_id, attrs in nodes:
            self.graph.add_node(node_id, **attrs)

        # Edges
        edges = [
            ("gateway-1", "core-1", {"type": "fiber", "bandwidth": 100, "latency": 3, "status": "active"}),
            ("gateway-1", "core-2", {"type": "fiber", "bandwidth": 100, "latency": 4, "status": "active"}),
            ("core-1", "core-2", {"type": "fiber", "bandwidth": 100, "latency": 5, "status": "active"}),
            ("core-1", "router-1", {"type": "fiber", "bandwidth": 80, "latency": 6, "status": "active"}),
            ("core-1", "router-2", {"type": "fiber", "bandwidth": 80, "latency": 7, "status": "active"}),
            ("core-2", "router-2", {"type": "fiber", "bandwidth": 80, "latency": 6, "status": "active"}),
            ("core-2", "router-3", {"type": "fiber", "bandwidth": 80, "latency": 8, "status": "active"}),
            ("router-1", "tower-1", {"type": "backhaul", "bandwidth": 50, "latency": 8, "status": "active"}),
            ("router-1", "tower-2", {"type": "backhaul", "bandwidth": 50, "latency": 9, "status": "active"}),
            ("router-2", "tower-2", {"type": "backhaul", "bandwidth": 50, "latency": 7, "status": "active"}),
            ("router-2", "tower-3", {"type": "backhaul", "bandwidth": 50, "latency": 8, "status": "active"}),
            ("router-2", "tower-4", {"type": "backhaul", "bandwidth": 50, "latency": 10, "status": "active"}),
            ("router-3", "tower-4", {"type": "backhaul", "bandwidth": 50, "latency": 9, "status": "active"}),
            ("router-3", "tower-5", {"type": "backhaul", "bandwidth": 50, "latency": 11, "status": "active"}),
            ("tower-1", "tower-2", {"type": "wireless", "bandwidth": 30, "latency": 5, "status": "active"}),
            ("tower-2", "tower-3", {"type": "wireless", "bandwidth": 30, "latency": 5, "status": "active"}),
            ("tower-3", "tower-4", {"type": "wireless", "bandwidth": 30, "latency": 5, "status": "active"}),
            ("tower-4", "tower-5", {"type": "wireless", "bandwidth": 30, "latency": 5, "status": "active"}),
        ]

        for src, tgt, attrs in edges:
            self.graph.add_edge(src, tgt, **attrs)

    def get_state(self) -> dict:
        """Return full network state."""
        nodes = []
        for node_id, data in self.graph.nodes(data=True):
            nodes.append({"id": node_id, **data})

        edges = []
        for src, tgt, data in self.graph.edges(data=True):
            edges.append({"source": src, "target": tgt, **data})

        return {"nodes": nodes, "edges": edges}

    def get_stats(self) -> dict:
        """Calculate network statistics."""
        all_nodes = list(self.graph.nodes(data=True))
        healthy = [n for n in all_nodes if n[1].get("status") == "healthy"]
        offline = [n for n in all_nodes if n[1].get("status") == "offline"]
        degraded = [n for n in all_nodes if n[1].get("status") == "degraded"]

        active_edges = [(u, v) for u, v, d in self.graph.edges(data=True) if d.get("status") != "broken"]
        broken_edges = [(u, v) for u, v, d in self.graph.edges(data=True) if d.get("status") == "broken"]

        avg_latency = 0
        active_nodes = [n for n in all_nodes if n[1].get("status") != "offline"]
        if active_nodes:
            avg_latency = round(sum(n[1].get("latency", 0) for n in active_nodes) / len(active_nodes))

        total_users = sum(n[1].get("connected_users", 0) for n in active_nodes)
        coverage = round((len(healthy) + len(degraded)) / max(len(all_nodes), 1) * 100)

        return {
            "total_nodes": len(all_nodes),
            "healthy": len(healthy),
            "offline": len(offline),
            "degraded": len(degraded),
            "coverage": coverage,
            "avg_latency": avg_latency,
            "total_users": total_users,
            "active_edges": len(active_edges),
            "broken_edges": len(broken_edges),
        }

    def trigger_failure(self, node_id: str, failure_type: str = "power") -> dict:
        """Trigger a failure on a specific node."""
        if node_id not in self.graph:
            return {"error": f"Node {node_id} not found"}

        self.graph.nodes[node_id]["status"] = "offline"
        self.graph.nodes[node_id]["connected_users"] = 0
        self.graph.nodes[node_id]["load"] = 0

        # Break connected edges
        for neighbor in list(self.graph.neighbors(node_id)):
            self.graph.edges[node_id, neighbor]["status"] = "broken"
            # Increase load on neighbors
            if self.graph.nodes[neighbor]["status"] != "offline":
                self.graph.nodes[neighbor]["latency"] = min(
                    self.graph.nodes[neighbor]["latency"] + 15, 200
                )
                self.graph.nodes[neighbor]["load"] = min(
                    self.graph.nodes[neighbor]["load"] + 20, 100
                )
                if self.graph.nodes[neighbor]["load"] > 85:
                    self.graph.nodes[neighbor]["status"] = "degraded"

        event = {
            "type": "failure",
            "node_id": node_id,
            "failure_type": failure_type,
            "message": f"Node {node_id} went offline ({failure_type})",
        }
        self.events.append(event)
        return {**event, "stats": self.get_stats()}

    def recover(self, strategy: str = "mesh", target_node: Optional[str] = None) -> dict:
        """Execute recovery strategy."""
        if strategy == "mesh":
            # Add mesh node near offline nodes
            offline = [n for n, d in self.graph.nodes(data=True) if d.get("status") == "offline"]
            if offline:
                mesh_id = f"mesh-{len([n for n in self.graph.nodes if 'mesh' in n]) + 1}"
                target = offline[0]
                target_data = self.graph.nodes[target]
                self.graph.add_node(
                    mesh_id,
                    type="mesh",
                    label=f"Mesh {mesh_id}",
                    status="healthy",
                    capacity=40,
                    load=10,
                    latency=20,
                    connected_users=0,
                    battery=100,
                    x=target_data.get("x", 500) + random.randint(-50, 50),
                    y=target_data.get("y", 400) + random.randint(-50, 50),
                )
                # Connect to nearest healthy nodes
                healthy_nodes = [
                    (n, d) for n, d in self.graph.nodes(data=True)
                    if d.get("status") == "healthy" and d.get("type") != "phone"
                ]
                healthy_nodes.sort(
                    key=lambda nd: abs(nd[1].get("x", 0) - target_data.get("x", 0))
                    + abs(nd[1].get("y", 0) - target_data.get("y", 0))
                )
                for node, _ in healthy_nodes[:2]:
                    self.graph.add_edge(
                        mesh_id, node,
                        type="mesh", bandwidth=30, latency=15, status="active"
                    )

        elif strategy == "full":
            # Recover everything
            for node_id in self.graph.nodes:
                self.graph.nodes[node_id]["status"] = "healthy"
                if self.graph.nodes[node_id]["type"] == "tower":
                    self.graph.nodes[node_id]["connected_users"] = random.randint(300, 800)
                    self.graph.nodes[node_id]["latency"] = random.randint(12, 25)
                self.graph.nodes[node_id]["load"] = max(
                    self.graph.nodes[node_id]["load"] - 20, 10
                )
            for u, v in self.graph.edges:
                self.graph.edges[u, v]["status"] = "active"

        event = {
            "type": "recovery",
            "strategy": strategy,
            "message": f"Recovery executed: {strategy}",
        }
        self.events.append(event)
        return {**event, "stats": self.get_stats()}

    def find_shortest_path(self, source: str, target: str) -> list[str]:
        """Find shortest path using only active nodes and edges."""
        active_graph = nx.Graph()
        for node_id, data in self.graph.nodes(data=True):
            if data.get("status") != "offline":
                active_graph.add_node(node_id)
        for u, v, data in self.graph.edges(data=True):
            if data.get("status") != "broken" and u in active_graph and v in active_graph:
                active_graph.add_edge(u, v, weight=data.get("latency", 1))

        try:
            return nx.shortest_path(active_graph, source, target, weight="weight")
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            return []

    def reset(self):
        """Reset to default state."""
        self.graph.clear()
        self._build_default_network()
        self.events.clear()
