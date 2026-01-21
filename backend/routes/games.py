"""
Game Routes - CRUD operations for game sessions
"""
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from datetime import datetime, timezone

from models.game_models import (
    GameSession, GameSessionCreate, GameSessionResponse,
    Player, PlayerCreate, PlayerResponse,
    LeaderboardEntry, GameStatus
)

router = APIRouter(prefix="/games", tags=["games"])

# Will be set by main server
db = None


def set_db(database):
    global db
    db = database


@router.post("", response_model=GameSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_game(game_data: GameSessionCreate):
    """Create a new game session"""
    game = GameSession(**game_data.model_dump())
    game_dict = game.model_dump()
    
    await db.games.insert_one(game_dict)
    
    return GameSessionResponse(
        id=game.id,
        code=game.code,
        name=game.name,
        host=game.host,
        venue=game.venue,
        game_format=game.game_format,
        status=game.status,
        current_question_index=game.current_question_index,
        current_round=game.current_round,
        players_count=len(game.players),
        created_at=game.created_at
    )


@router.get("", response_model=List[GameSessionResponse])
async def get_all_games(status_filter: Optional[str] = None):
    """Get all games, optionally filtered by status"""
    query = {}
    if status_filter:
        query["status"] = status_filter
    
    games = await db.games.find(query, {"_id": 0}).to_list(1000)
    
    return [
        GameSessionResponse(
            id=g["id"],
            code=g["code"],
            name=g["name"],
            host=g["host"],
            venue=g["venue"],
            game_format=g["game_format"],
            status=g["status"],
            current_question_index=g["current_question_index"],
            current_round=g.get("current_round", 1),
            players_count=len(g.get("players", [])),
            created_at=g["created_at"]
        )
        for g in games
    ]


@router.get("/code/{game_code}")
async def get_game_by_code(game_code: str):
    """Get game by code (used by players joining)"""
    game = await db.games.find_one({"code": game_code.upper()}, {"_id": 0})
    
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    return game


@router.get("/{game_id}")
async def get_game(game_id: str):
    """Get game by ID"""
    game = await db.games.find_one({"id": game_id}, {"_id": 0})
    
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    return game


@router.patch("/{game_id}/start")
async def start_game(game_id: str):
    """Start a game"""
    result = await db.games.update_one(
        {"id": game_id},
        {
            "$set": {
                "status": GameStatus.ACTIVE.value,
                "started_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Game not found")
    
    return {"message": "Game started", "status": "active"}


@router.patch("/{game_id}/pause")
async def pause_game(game_id: str):
    """Pause a game"""
    result = await db.games.update_one(
        {"id": game_id},
        {"$set": {"status": GameStatus.PAUSED.value}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Game not found")
    
    return {"message": "Game paused", "status": "paused"}


@router.patch("/{game_id}/resume")
async def resume_game(game_id: str):
    """Resume a paused game"""
    result = await db.games.update_one(
        {"id": game_id},
        {"$set": {"status": GameStatus.ACTIVE.value}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Game not found")
    
    return {"message": "Game resumed", "status": "active"}


@router.patch("/{game_id}/finish")
async def finish_game(game_id: str):
    """Finish a game"""
    result = await db.games.update_one(
        {"id": game_id},
        {
            "$set": {
                "status": GameStatus.FINISHED.value,
                "finished_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Game not found")
    
    return {"message": "Game finished", "status": "finished"}


@router.patch("/{game_id}/next-question")
async def next_question(game_id: str):
    """Move to next question"""
    game = await db.games.find_one({"id": game_id}, {"_id": 0})
    
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    new_index = game["current_question_index"] + 1
    
    await db.games.update_one(
        {"id": game_id},
        {"$set": {"current_question_index": new_index}}
    )
    
    return {"message": "Next question", "current_question_index": new_index}


@router.patch("/{game_id}/previous-question")
async def previous_question(game_id: str):
    """Move to previous question"""
    game = await db.games.find_one({"id": game_id}, {"_id": 0})
    
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    new_index = max(0, game["current_question_index"] - 1)
    
    await db.games.update_one(
        {"id": game_id},
        {"$set": {"current_question_index": new_index}}
    )
    
    return {"message": "Previous question", "current_question_index": new_index}


@router.patch("/{game_id}/set-question/{index}")
async def set_question_index(game_id: str, index: int):
    """Set specific question index"""
    await db.games.update_one(
        {"id": game_id},
        {"$set": {"current_question_index": index}}
    )
    
    return {"message": "Question index set", "current_question_index": index}


@router.patch("/{game_id}/content")
async def update_game_content(game_id: str, content: dict):
    """Update game content (load a game pack)"""
    result = await db.games.update_one(
        {"id": game_id},
        {"$set": {"content": content}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Game not found")
    
    return {"message": "Game content updated"}


@router.delete("/{game_id}")
async def delete_game(game_id: str):
    """Delete a game"""
    result = await db.games.delete_one({"id": game_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Game not found")
    
    return {"message": "Game deleted"}


# Player Management
@router.post("/{game_code}/join", response_model=PlayerResponse)
async def join_game(game_code: str, player_data: PlayerCreate):
    """Player joins a game"""
    game = await db.games.find_one({"code": game_code.upper()}, {"_id": 0})
    
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    if game["status"] == GameStatus.FINISHED.value:
        raise HTTPException(status_code=400, detail="Game has already finished")
    
    # Check for duplicate name
    existing_names = [p["name"].lower() for p in game.get("players", [])]
    if player_data.name.lower() in existing_names:
        raise HTTPException(status_code=400, detail="Player name already taken")
    
    player = Player(name=player_data.name)
    
    await db.games.update_one(
        {"code": game_code.upper()},
        {"$push": {"players": player.model_dump()}}
    )
    
    return PlayerResponse(
        id=player.id,
        name=player.name,
        game_code=game_code.upper(),
        score=player.score
    )


@router.get("/{game_code}/players", response_model=List[Player])
async def get_players(game_code: str):
    """Get all players in a game"""
    game = await db.games.find_one({"code": game_code.upper()}, {"_id": 0})
    
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    return game.get("players", [])


@router.get("/{game_code}/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(game_code: str):
    """Get leaderboard for a game"""
    game = await db.games.find_one({"code": game_code.upper()}, {"_id": 0})
    
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    players = game.get("players", [])
    
    # Sort by score descending
    sorted_players = sorted(players, key=lambda p: p["score"], reverse=True)
    
    leaderboard = []
    for i, player in enumerate(sorted_players):
        leaderboard.append(LeaderboardEntry(
            rank=i + 1,
            player_id=player["id"],
            name=player["name"],
            score=player["score"],
            correct_answers=player["correct_answers"],
            trend="same"  # Would need historical data to calculate
        ))
    
    return leaderboard


@router.patch("/{game_code}/players/{player_id}/score")
async def update_player_score(game_code: str, player_id: str, points: int, correct: bool = True):
    """Update a player's score"""
    game = await db.games.find_one({"code": game_code.upper()}, {"_id": 0})
    
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    players = game.get("players", [])
    player_found = False
    
    for player in players:
        if player["id"] == player_id:
            player["score"] += points
            if correct:
                player["correct_answers"] += 1
            player_found = True
            break
    
    if not player_found:
        raise HTTPException(status_code=404, detail="Player not found")
    
    await db.games.update_one(
        {"code": game_code.upper()},
        {"$set": {"players": players}}
    )
    
    return {"message": "Score updated", "new_score": player["score"]}


@router.patch("/{game_code}/players/{player_id}/eliminate")
async def eliminate_player(game_code: str, player_id: str):
    """Eliminate a player (for elimination games)"""
    game = await db.games.find_one({"code": game_code.upper()}, {"_id": 0})
    
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    players = game.get("players", [])
    
    for player in players:
        if player["id"] == player_id:
            player["eliminated"] = True
            break
    
    await db.games.update_one(
        {"code": game_code.upper()},
        {"$set": {"players": players}}
    )
    
    return {"message": "Player eliminated"}
