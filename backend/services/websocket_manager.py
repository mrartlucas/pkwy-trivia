"""
WebSocket Manager for Real-time Game Communication
Handles Director <-> TV Display <-> Players sync
"""
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List, Set, Optional
import json
import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)


class ConnectionManager:
    """Manages WebSocket connections for real-time game communication"""
    
    def __init__(self):
        # Store connections by game code
        # Structure: {game_code: {"directors": set(), "tv_displays": set(), "players": {player_id: websocket}}}
        self.game_rooms: Dict[str, Dict] = {}
    
    def _ensure_room(self, game_code: str):
        """Ensure game room exists"""
        if game_code not in self.game_rooms:
            self.game_rooms[game_code] = {
                "directors": set(),
                "tv_displays": set(),
                "players": {}
            }
    
    async def connect_director(self, websocket: WebSocket, game_code: str):
        """Connect a director to a game room"""
        await websocket.accept()
        self._ensure_room(game_code)
        self.game_rooms[game_code]["directors"].add(websocket)
        logger.info(f"Director connected to game {game_code}")
    
    async def connect_tv(self, websocket: WebSocket, game_code: str):
        """Connect a TV display to a game room"""
        await websocket.accept()
        self._ensure_room(game_code)
        self.game_rooms[game_code]["tv_displays"].add(websocket)
        logger.info(f"TV display connected to game {game_code}")
    
    async def connect_player(self, websocket: WebSocket, game_code: str, player_id: str):
        """Connect a player to a game room"""
        await websocket.accept()
        self._ensure_room(game_code)
        self.game_rooms[game_code]["players"][player_id] = websocket
        logger.info(f"Player {player_id} connected to game {game_code}")
        
        # Notify others of new player
        await self.broadcast_to_game(game_code, {
            "event": "player:joined",
            "data": {
                "player_id": player_id,
                "players_count": len(self.game_rooms[game_code]["players"])
            }
        })
    
    def disconnect_director(self, websocket: WebSocket, game_code: str):
        """Disconnect a director"""
        if game_code in self.game_rooms:
            self.game_rooms[game_code]["directors"].discard(websocket)
            logger.info(f"Director disconnected from game {game_code}")
    
    def disconnect_tv(self, websocket: WebSocket, game_code: str):
        """Disconnect a TV display"""
        if game_code in self.game_rooms:
            self.game_rooms[game_code]["tv_displays"].discard(websocket)
            logger.info(f"TV display disconnected from game {game_code}")
    
    def disconnect_player(self, game_code: str, player_id: str):
        """Disconnect a player"""
        if game_code in self.game_rooms:
            self.game_rooms[game_code]["players"].pop(player_id, None)
            logger.info(f"Player {player_id} disconnected from game {game_code}")
    
    async def broadcast_to_game(self, game_code: str, message: dict, exclude_websocket: Optional[WebSocket] = None):
        """Broadcast message to all connections in a game room"""
        if game_code not in self.game_rooms:
            return
        
        room = self.game_rooms[game_code]
        message_json = json.dumps(message)
        
        # Send to directors
        for ws in room["directors"]:
            if ws != exclude_websocket:
                try:
                    await ws.send_text(message_json)
                except Exception as e:
                    logger.error(f"Error sending to director: {e}")
        
        # Send to TV displays
        for ws in room["tv_displays"]:
            if ws != exclude_websocket:
                try:
                    await ws.send_text(message_json)
                except Exception as e:
                    logger.error(f"Error sending to TV: {e}")
        
        # Send to players
        for player_id, ws in room["players"].items():
            if ws != exclude_websocket:
                try:
                    await ws.send_text(message_json)
                except Exception as e:
                    logger.error(f"Error sending to player {player_id}: {e}")
    
    async def send_to_directors(self, game_code: str, message: dict):
        """Send message only to directors"""
        if game_code not in self.game_rooms:
            return
        
        message_json = json.dumps(message)
        for ws in self.game_rooms[game_code]["directors"]:
            try:
                await ws.send_text(message_json)
            except Exception as e:
                logger.error(f"Error sending to director: {e}")
    
    async def send_to_tvs(self, game_code: str, message: dict):
        """Send message only to TV displays"""
        if game_code not in self.game_rooms:
            return
        
        message_json = json.dumps(message)
        for ws in self.game_rooms[game_code]["tv_displays"]:
            try:
                await ws.send_text(message_json)
            except Exception as e:
                logger.error(f"Error sending to TV: {e}")
    
    async def send_to_players(self, game_code: str, message: dict):
        """Send message only to players"""
        if game_code not in self.game_rooms:
            return
        
        message_json = json.dumps(message)
        for player_id, ws in self.game_rooms[game_code]["players"].items():
            try:
                await ws.send_text(message_json)
            except Exception as e:
                logger.error(f"Error sending to player {player_id}: {e}")
    
    async def send_to_player(self, game_code: str, player_id: str, message: dict):
        """Send message to a specific player"""
        if game_code not in self.game_rooms:
            return
        
        ws = self.game_rooms[game_code]["players"].get(player_id)
        if ws:
            try:
                await ws.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error sending to player {player_id}: {e}")
    
    def get_player_count(self, game_code: str) -> int:
        """Get number of connected players"""
        if game_code in self.game_rooms:
            return len(self.game_rooms[game_code]["players"])
        return 0
    
    def get_connected_player_ids(self, game_code: str) -> List[str]:
        """Get list of connected player IDs"""
        if game_code in self.game_rooms:
            return list(self.game_rooms[game_code]["players"].keys())
        return []


# Global connection manager instance
manager = ConnectionManager()


# WebSocket Event Handlers
async def handle_director_message(game_code: str, data: dict, db):
    """Handle messages from director panel"""
    event = data.get("event", "")
    payload = data.get("data", {})
    
    if event == "game:start":
        # Start the game
        await db.games.update_one(
            {"code": game_code},
            {"$set": {"status": "active", "started_at": datetime.now(timezone.utc).isoformat()}}
        )
        await manager.broadcast_to_game(game_code, {
            "event": "game:started",
            "data": {"game_code": game_code}
        })
    
    elif event == "game:pause":
        await db.games.update_one(
            {"code": game_code},
            {"$set": {"status": "paused"}}
        )
        await manager.broadcast_to_game(game_code, {
            "event": "game:paused",
            "data": {}
        })
    
    elif event == "game:resume":
        await db.games.update_one(
            {"code": game_code},
            {"$set": {"status": "active"}}
        )
        await manager.broadcast_to_game(game_code, {
            "event": "game:resumed",
            "data": {}
        })
    
    elif event == "game:finish":
        await db.games.update_one(
            {"code": game_code},
            {"$set": {"status": "finished", "finished_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        # Get final leaderboard
        game = await db.games.find_one({"code": game_code}, {"_id": 0})
        players = sorted(game.get("players", []), key=lambda p: p["score"], reverse=True)
        
        await manager.broadcast_to_game(game_code, {
            "event": "game:finished",
            "data": {
                "winner": players[0] if players else None,
                "final_leaderboard": players
            }
        })
    
    elif event == "question:next":
        game = await db.games.find_one({"code": game_code}, {"_id": 0})
        new_index = game["current_question_index"] + 1
        
        await db.games.update_one(
            {"code": game_code},
            {"$set": {"current_question_index": new_index}}
        )
        
        await manager.broadcast_to_game(game_code, {
            "event": "question:changed",
            "data": {"question_index": new_index}
        })
    
    elif event == "question:previous":
        game = await db.games.find_one({"code": game_code}, {"_id": 0})
        new_index = max(0, game["current_question_index"] - 1)
        
        await db.games.update_one(
            {"code": game_code},
            {"$set": {"current_question_index": new_index}}
        )
        
        await manager.broadcast_to_game(game_code, {
            "event": "question:changed",
            "data": {"question_index": new_index}
        })
    
    elif event == "question:goto":
        index = payload.get("index", 0)
        await db.games.update_one(
            {"code": game_code},
            {"$set": {"current_question_index": index}}
        )
        
        await manager.broadcast_to_game(game_code, {
            "event": "question:changed",
            "data": {"question_index": index}
        })
    
    elif event == "answer:reveal":
        await manager.broadcast_to_game(game_code, {
            "event": "answer:revealed",
            "data": payload
        })
    
    elif event == "leaderboard:show":
        game = await db.games.find_one({"code": game_code}, {"_id": 0})
        players = sorted(game.get("players", []), key=lambda p: p["score"], reverse=True)
        
        leaderboard = [
            {"rank": i + 1, "name": p["name"], "score": p["score"], "correct_answers": p["correct_answers"]}
            for i, p in enumerate(players)
        ]
        
        await manager.broadcast_to_game(game_code, {
            "event": "leaderboard:update",
            "data": leaderboard
        })
    
    elif event == "display:state":
        # Change display state (lobby, question, leaderboard, final)
        await manager.send_to_tvs(game_code, {
            "event": "display:state",
            "data": payload
        })
    
    elif event == "timer:start":
        await manager.broadcast_to_game(game_code, {
            "event": "timer:started",
            "data": payload
        })
    
    elif event == "timer:stop":
        await manager.broadcast_to_game(game_code, {
            "event": "timer:stopped",
            "data": {}
        })
    
    elif event == "player:eliminate":
        player_id = payload.get("player_id")
        if player_id:
            game = await db.games.find_one({"code": game_code}, {"_id": 0})
            players = game.get("players", [])
            
            for p in players:
                if p["id"] == player_id:
                    p["eliminated"] = True
                    break
            
            await db.games.update_one(
                {"code": game_code},
                {"$set": {"players": players}}
            )
            
            await manager.broadcast_to_game(game_code, {
                "event": "player:eliminated",
                "data": {"player_id": player_id}
            })
    
    elif event == "survey:reveal":
        # For Survey Says - reveal an answer
        await manager.broadcast_to_game(game_code, {
            "event": "survey:answer_revealed",
            "data": payload
        })
    
    elif event == "survey:strike":
        # Add a strike
        await manager.broadcast_to_game(game_code, {
            "event": "survey:strike",
            "data": payload
        })


async def handle_player_message(game_code: str, player_id: str, data: dict, db):
    """Handle messages from players"""
    event = data.get("event", "")
    payload = data.get("data", {})
    
    if event == "answer:submit":
        # Process answer
        game = await db.games.find_one({"code": game_code}, {"_id": 0})
        
        if not game:
            return
        
        players = game.get("players", [])
        player = None
        player_index = -1
        
        for i, p in enumerate(players):
            if p["id"] == player_id:
                player = p
                player_index = i
                break
        
        if not player:
            return
        
        # Get answer details
        answer = payload.get("answer")
        time_taken = payload.get("time_taken", 0)
        question_index = payload.get("question_index", game["current_question_index"])
        
        # Notify directors that player answered
        await manager.send_to_directors(game_code, {
            "event": "player:answered",
            "data": {
                "player_id": player_id,
                "player_name": player["name"],
                "answer": answer,
                "time_taken": time_taken,
                "question_index": question_index
            }
        })
    
    elif event == "buzzer:press":
        # Fastest finger / buzzer press
        await manager.send_to_directors(game_code, {
            "event": "buzzer:pressed",
            "data": {
                "player_id": player_id,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        })
        
        await manager.broadcast_to_game(game_code, {
            "event": "buzzer:winner",
            "data": {"player_id": player_id}
        })
