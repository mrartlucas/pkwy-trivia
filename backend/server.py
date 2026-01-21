"""
PKWY Tavern Game Suite - Backend Server
Supports 13 game formats with real-time WebSocket communication
"""
from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
import json

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(
    title="PKWY Tavern Game Suite API",
    description="Backend API for multi-format trivia game system",
    version="1.0.0"
)

# Create API router
api_router = APIRouter(prefix="/api")

# Import routes
from routes import games, game_packs, answers
from services.websocket_manager import (
    manager, 
    handle_director_message, 
    handle_player_message
)

# Set database for routes
games.set_db(db)
game_packs.set_db(db)
answers.set_db(db)

# Include route modules
api_router.include_router(games.router)
api_router.include_router(game_packs.router)
api_router.include_router(answers.router)


# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "PKWY Tavern Game Suite API", "status": "running"}


@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}


# Include API router
app.include_router(api_router)


# WebSocket endpoints
@app.websocket("/ws/director/{game_code}")
async def websocket_director(websocket: WebSocket, game_code: str):
    """WebSocket endpoint for Director Panel"""
    await manager.connect_director(websocket, game_code.upper())
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            await handle_director_message(game_code.upper(), message, db)
    except WebSocketDisconnect:
        manager.disconnect_director(websocket, game_code.upper())
    except Exception as e:
        logging.error(f"Director WebSocket error: {e}")
        manager.disconnect_director(websocket, game_code.upper())


@app.websocket("/ws/tv/{game_code}")
async def websocket_tv(websocket: WebSocket, game_code: str):
    """WebSocket endpoint for TV Display"""
    await manager.connect_tv(websocket, game_code.upper())
    try:
        while True:
            # TV displays mostly receive, but can send heartbeats
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("event") == "heartbeat":
                await websocket.send_text(json.dumps({"event": "heartbeat", "data": "pong"}))
    except WebSocketDisconnect:
        manager.disconnect_tv(websocket, game_code.upper())
    except Exception as e:
        logging.error(f"TV WebSocket error: {e}")
        manager.disconnect_tv(websocket, game_code.upper())


@app.websocket("/ws/player/{game_code}/{player_id}")
async def websocket_player(websocket: WebSocket, game_code: str, player_id: str):
    """WebSocket endpoint for Players"""
    await manager.connect_player(websocket, game_code.upper(), player_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            await handle_player_message(game_code.upper(), player_id, message, db)
    except WebSocketDisconnect:
        manager.disconnect_player(game_code.upper(), player_id)
        
        # Notify others of player disconnect
        await manager.broadcast_to_game(game_code.upper(), {
            "event": "player:disconnected",
            "data": {"player_id": player_id}
        })
    except Exception as e:
        logging.error(f"Player WebSocket error: {e}")
        manager.disconnect_player(game_code.upper(), player_id)


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_db():
    """Initialize database indexes"""
    # Create indexes for better query performance
    await db.games.create_index("code", unique=True)
    await db.games.create_index("status")
    await db.game_packs.create_index("game_format")
    await db.game_packs.create_index("tags")
    logger.info("Database indexes created")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
