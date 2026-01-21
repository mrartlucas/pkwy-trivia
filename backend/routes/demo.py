"""
Demo Bot System - AI opponents for demo mode
Creates realistic bot players that answer questions automatically
"""
from fastapi import APIRouter, HTTPException
from typing import List
import random
import asyncio
from datetime import datetime, timezone

router = APIRouter(prefix="/demo", tags=["demo"])

# Will be set by main server
db = None

def set_db(database):
    global db
    db = database

# Bot name pools
BOT_FIRST_NAMES = [
    "Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Quinn", "Avery",
    "Charlie", "Dakota", "Drew", "Finley", "Harper", "Jamie", "Kendall", "Logan",
    "Max", "Parker", "Reese", "Sam", "Skyler", "Tatum", "Blake", "Cameron"
]

BOT_LAST_INITIALS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "W"]

def generate_bot_name():
    """Generate a realistic player name"""
    first = random.choice(BOT_FIRST_NAMES)
    last_initial = random.choice(BOT_LAST_INITIALS)
    return f"{first} {last_initial}."


@router.post("/{game_code}/add-bots")
async def add_demo_bots(game_code: str, count: int = 5):
    """Add AI demo bots to a game"""
    game = await db.games.find_one({"code": game_code.upper()}, {"_id": 0})
    
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    existing_players = game.get("players", [])
    existing_names = [p["name"].lower() for p in existing_players]
    
    bots_added = []
    for _ in range(count):
        # Generate unique name
        attempts = 0
        while attempts < 20:
            name = generate_bot_name()
            if name.lower() not in existing_names:
                break
            attempts += 1
        
        if attempts >= 20:
            continue
            
        bot = {
            "id": f"bot_{random.randint(10000, 99999)}",
            "name": name,
            "score": 0,
            "correct_answers": 0,
            "eliminated": False,
            "connected": True,
            "is_bot": True,
            "joined_at": datetime.now(timezone.utc).isoformat()
        }
        
        existing_players.append(bot)
        existing_names.append(name.lower())
        bots_added.append(bot)
    
    await db.games.update_one(
        {"code": game_code.upper()},
        {"$set": {"players": existing_players}}
    )
    
    return {
        "message": f"Added {len(bots_added)} demo bots",
        "bots": bots_added,
        "total_players": len(existing_players)
    }


@router.post("/{game_code}/simulate-answers")
async def simulate_bot_answers(game_code: str, correct_rate: float = 0.6):
    """Simulate bot answers for current question"""
    game = await db.games.find_one({"code": game_code.upper()}, {"_id": 0})
    
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    players = game.get("players", [])
    bots = [p for p in players if p.get("is_bot", False) and not p.get("eliminated", False)]
    
    if not bots:
        return {"message": "No active bots in game"}
    
    content = game.get("content", {})
    current_index = game.get("current_question_index", 0)
    game_format = game.get("game_format", "")
    
    # Get correct answer based on format
    correct_answer = get_correct_answer(game_format, content, current_index)
    
    results = []
    for bot in bots:
        # Determine if bot answers correctly (based on correct_rate)
        is_correct = random.random() < correct_rate
        
        # Calculate points
        base_points = get_question_points(game_format, content, current_index)
        time_taken = random.uniform(2.0, 8.0)  # Random response time
        
        points = 0
        if is_correct:
            # Add time bonus
            time_bonus = int(base_points * 0.3 * (1 - time_taken / 10))
            points = base_points + max(0, time_bonus)
        
        # Update bot score
        for p in players:
            if p["id"] == bot["id"]:
                p["score"] += points
                if is_correct:
                    p["correct_answers"] += 1
                break
        
        results.append({
            "bot_name": bot["name"],
            "correct": is_correct,
            "points": points,
            "time_taken": round(time_taken, 2)
        })
    
    # Save updated scores
    await db.games.update_one(
        {"code": game_code.upper()},
        {"$set": {"players": players}}
    )
    
    return {
        "message": f"Simulated answers for {len(results)} bots",
        "results": results
    }


@router.delete("/{game_code}/remove-bots")
async def remove_demo_bots(game_code: str):
    """Remove all demo bots from a game"""
    game = await db.games.find_one({"code": game_code.upper()}, {"_id": 0})
    
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    players = game.get("players", [])
    human_players = [p for p in players if not p.get("is_bot", False)]
    bots_removed = len(players) - len(human_players)
    
    await db.games.update_one(
        {"code": game_code.upper()},
        {"$set": {"players": human_players}}
    )
    
    return {
        "message": f"Removed {bots_removed} demo bots",
        "remaining_players": len(human_players)
    }


def get_correct_answer(game_format: str, content: dict, index: int):
    """Get correct answer for current question"""
    if game_format in ["PKWY LIVE!", "UR FINAL ANSWER!", "LAST CALL STANDING", "BACK TO SCHOOL!"]:
        questions = content.get("questions", [])
        if index < len(questions):
            return questions[index].get("correct_answer", "A")
    
    elif game_format == "PERIL!":
        all_clues = []
        for cat in content.get("categories", []):
            all_clues.extend(cat.get("clues", []))
        if index < len(all_clues):
            return all_clues[index].get("correct_answer", "")
    
    elif game_format == "SURVEY SAYS!":
        questions = content.get("survey_questions", [])
        if index < len(questions):
            answers = questions[index].get("answers", [])
            return answers[0]["answer"] if answers else ""
    
    return "A"


def get_question_points(game_format: str, content: dict, index: int):
    """Get base points for current question"""
    if game_format == "UR FINAL ANSWER!":
        questions = content.get("questions", [])
        if index < len(questions):
            return questions[index].get("point_value", 100)
    
    elif game_format == "PERIL!":
        all_clues = []
        for cat in content.get("categories", []):
            all_clues.extend(cat.get("clues", []))
        if index < len(all_clues):
            return all_clues[index].get("value", 100)
    
    elif game_format == "PKWY LIVE!":
        return 100
    
    elif game_format == "BACK TO SCHOOL!":
        questions = content.get("questions", [])
        if index < len(questions):
            return questions[index].get("grade_level", 1) * 50
    
    return 100
