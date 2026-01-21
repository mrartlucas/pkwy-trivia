"""
Game Packs Routes - Import and manage game content
"""
from fastapi import APIRouter, HTTPException, status, UploadFile, File
from typing import List, Optional
from datetime import datetime, timezone
import json

from models.game_models import (
    GamePack, GamePackCreate, GamePackResponse, GameFormat
)

router = APIRouter(prefix="/game-packs", tags=["game-packs"])

# Will be set by main server
db = None


def set_db(database):
    global db
    db = database


# Map game names to format enum
GAME_NAME_MAP = {
    "PERIL!": GameFormat.PERIL.value,
    "SURVEY SAYS!": GameFormat.SURVEY_SAYS.value,
    "UR FINAL ANSWER!": GameFormat.UR_FINAL_ANSWER.value,
    "LAST CALL STANDING": GameFormat.LAST_CALL_STANDING.value,
    "PICK OR PASS!": GameFormat.PICK_OR_PASS.value,
    "LINK REACTION": GameFormat.LINK_REACTION.value,
    "SPIN TO WIN!": GameFormat.SPIN_TO_WIN.value,
    "CLOSEST WINS!": GameFormat.CLOSEST_WINS.value,
    "CHAINED UP": GameFormat.CHAINED_UP.value,
    "NO WHAMMY!": GameFormat.NO_WHAMMY.value,
    "BACK TO SCHOOL!": GameFormat.BACK_TO_SCHOOL.value,
    "QUIZ CHASE": GameFormat.QUIZ_CHASE.value,
    "PKWY LIVE!": GameFormat.PKWY_LIVE.value,
}


def detect_game_format(content: dict) -> str:
    """Detect game format from content structure"""
    game_name = content.get("game_name", "")
    
    if game_name in GAME_NAME_MAP:
        return GAME_NAME_MAP[game_name]
    
    # Fallback detection based on content structure
    if "categories" in content and "clues" in str(content):
        return GameFormat.PERIL.value
    if "survey_questions" in content:
        return GameFormat.SURVEY_SAYS.value
    if "puzzles" in content:
        return GameFormat.SPIN_TO_WIN.value
    if "chains" in content:
        return GameFormat.CHAINED_UP.value
    if "board" in content and "spin_questions" in content:
        return GameFormat.NO_WHAMMY.value
    if "cases" in content:
        return GameFormat.PICK_OR_PASS.value
    if "numbers" in content:
        return GameFormat.CLOSEST_WINS.value
    
    # Check for question-based formats
    if "questions" in content:
        questions = content["questions"]
        if questions and isinstance(questions, list) and len(questions) > 0:
            sample = questions[0]
            if "subject" in sample:
                return GameFormat.BACK_TO_SCHOOL.value
            if "chain_value" in sample:
                return GameFormat.LINK_REACTION.value
            if "point_value" in sample:
                return GameFormat.UR_FINAL_ANSWER.value
            if "difficulty" in sample:
                # Could be LAST CALL STANDING or PKWY LIVE
                if len(questions) >= 12:
                    return GameFormat.LAST_CALL_STANDING.value
                return GameFormat.PKWY_LIVE.value
    
    return "UNKNOWN"


@router.post("", response_model=GamePackResponse, status_code=status.HTTP_201_CREATED)
async def create_game_pack(pack_data: GamePackCreate):
    """Create a new game pack from JSON content"""
    # Detect game format
    game_format = detect_game_format(pack_data.content)
    
    if game_format == "UNKNOWN":
        raise HTTPException(
            status_code=400,
            detail="Could not detect game format from content. Make sure 'game_name' field is present."
        )
    
    pack = GamePack(
        name=pack_data.name,
        description=pack_data.description,
        game_format=game_format,
        content=pack_data.content,
        tags=pack_data.tags
    )
    
    pack_dict = pack.model_dump()
    await db.game_packs.insert_one(pack_dict)
    
    return GamePackResponse(
        id=pack.id,
        name=pack.name,
        description=pack.description,
        game_format=pack.game_format,
        tags=pack.tags,
        created_at=pack.created_at
    )


@router.post("/upload", response_model=GamePackResponse, status_code=status.HTTP_201_CREATED)
async def upload_game_pack(
    file: UploadFile = File(...),
    name: Optional[str] = None,
    description: str = "",
    tags: str = ""  # Comma-separated tags
):
    """Upload a JSON file to create a game pack"""
    if not file.filename.endswith('.json'):
        raise HTTPException(status_code=400, detail="File must be a JSON file")
    
    try:
        content_bytes = await file.read()
        content = json.loads(content_bytes.decode('utf-8'))
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {str(e)}")
    
    # Use filename as name if not provided
    pack_name = name or file.filename.replace('.json', '')
    
    # Parse tags
    tag_list = [t.strip() for t in tags.split(',') if t.strip()] if tags else []
    
    # Detect game format
    game_format = detect_game_format(content)
    
    if game_format == "UNKNOWN":
        raise HTTPException(
            status_code=400,
            detail="Could not detect game format from content. Make sure 'game_name' field is present."
        )
    
    pack = GamePack(
        name=pack_name,
        description=description,
        game_format=game_format,
        content=content,
        tags=tag_list
    )
    
    pack_dict = pack.model_dump()
    await db.game_packs.insert_one(pack_dict)
    
    return GamePackResponse(
        id=pack.id,
        name=pack.name,
        description=pack.description,
        game_format=pack.game_format,
        tags=pack.tags,
        created_at=pack.created_at
    )


@router.get("", response_model=List[GamePackResponse])
async def get_all_game_packs(
    game_format: Optional[str] = None,
    tag: Optional[str] = None
):
    """Get all game packs, optionally filtered"""
    query = {}
    
    if game_format:
        query["game_format"] = game_format
    
    if tag:
        query["tags"] = tag
    
    packs = await db.game_packs.find(query, {"_id": 0}).to_list(1000)
    
    return [
        GamePackResponse(
            id=p["id"],
            name=p["name"],
            description=p.get("description", ""),
            game_format=p["game_format"],
            tags=p.get("tags", []),
            created_at=p["created_at"]
        )
        for p in packs
    ]


@router.get("/formats")
async def get_available_formats():
    """Get list of available game formats"""
    return {
        "formats": [
            {"value": f.value, "name": f.name.replace("_", " ").title()}
            for f in GameFormat
        ]
    }


@router.get("/{pack_id}")
async def get_game_pack(pack_id: str):
    """Get a specific game pack with full content"""
    pack = await db.game_packs.find_one({"id": pack_id}, {"_id": 0})
    
    if not pack:
        raise HTTPException(status_code=404, detail="Game pack not found")
    
    return pack


@router.put("/{pack_id}")
async def update_game_pack(pack_id: str, pack_data: GamePackCreate):
    """Update a game pack"""
    game_format = detect_game_format(pack_data.content)
    
    result = await db.game_packs.update_one(
        {"id": pack_id},
        {
            "$set": {
                "name": pack_data.name,
                "description": pack_data.description,
                "game_format": game_format,
                "content": pack_data.content,
                "tags": pack_data.tags,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Game pack not found")
    
    return {"message": "Game pack updated"}


@router.delete("/{pack_id}")
async def delete_game_pack(pack_id: str):
    """Delete a game pack"""
    result = await db.game_packs.delete_one({"id": pack_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Game pack not found")
    
    return {"message": "Game pack deleted"}


@router.post("/{pack_id}/duplicate", response_model=GamePackResponse)
async def duplicate_game_pack(pack_id: str, new_name: Optional[str] = None):
    """Duplicate a game pack"""
    original = await db.game_packs.find_one({"id": pack_id}, {"_id": 0})
    
    if not original:
        raise HTTPException(status_code=404, detail="Game pack not found")
    
    new_pack = GamePack(
        name=new_name or f"{original['name']} (Copy)",
        description=original.get("description", ""),
        game_format=original["game_format"],
        content=original["content"],
        tags=original.get("tags", [])
    )
    
    pack_dict = new_pack.model_dump()
    await db.game_packs.insert_one(pack_dict)
    
    return GamePackResponse(
        id=new_pack.id,
        name=new_pack.name,
        description=new_pack.description,
        game_format=new_pack.game_format,
        tags=new_pack.tags,
        created_at=new_pack.created_at
    )
