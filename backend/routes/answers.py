"""
Answer Routes - Handle player answer submissions
"""
from fastapi import APIRouter, HTTPException
from typing import Any, Optional
from datetime import datetime, timezone

from models.game_models import AnswerSubmission, AnswerResult, GameFormat

router = APIRouter(prefix="/answers", tags=["answers"])

# Will be set by main server
db = None


def set_db(database):
    global db
    db = database


def calculate_points(game_format: str, question_data: dict, answer: Any, time_taken: float, is_correct: bool) -> int:
    """Calculate points based on game format and answer"""
    if not is_correct:
        return 0
    
    base_points = 0
    
    if game_format == GameFormat.PERIL.value:
        # Jeopardy-style: points based on clue value
        base_points = question_data.get("value", 100)
    
    elif game_format == GameFormat.UR_FINAL_ANSWER.value:
        # Millionaire: points based on question level
        base_points = question_data.get("point_value", 100)
    
    elif game_format == GameFormat.SURVEY_SAYS.value:
        # Family Feud: points based on answer ranking
        base_points = question_data.get("percent", 0)
    
    elif game_format == GameFormat.LAST_CALL_STANDING.value:
        # Survival bonus
        base_points = 100 * question_data.get("difficulty", 1)
    
    elif game_format == GameFormat.PICK_OR_PASS.value:
        # Case value
        base_points = question_data.get("case_value", 100)
    
    elif game_format == GameFormat.LINK_REACTION.value:
        # Chain multiplier
        base_points = question_data.get("chain_value", 1) * 100
    
    elif game_format == GameFormat.CLOSEST_WINS.value:
        # Estimation accuracy bonus
        base_points = 500  # Full points for exact match
    
    elif game_format == GameFormat.NO_WHAMMY.value:
        # Spin value
        base_points = 200
    
    elif game_format == GameFormat.BACK_TO_SCHOOL.value:
        # Grade level bonus
        base_points = question_data.get("grade_level", 1) * 50
    
    elif game_format == GameFormat.QUIZ_CHASE.value:
        # Difficulty multiplier
        base_points = question_data.get("difficulty", 1) * 100
    
    elif game_format == GameFormat.PKWY_LIVE.value:
        # Speed bonus
        base_points = 100
    
    else:
        base_points = 100
    
    # Speed bonus (up to 50% extra for fast answers)
    time_limit = question_data.get("time_limit", 30)
    if time_taken < time_limit:
        speed_bonus = int(base_points * 0.5 * (1 - time_taken / time_limit))
        base_points += speed_bonus
    
    return base_points


def check_answer(game_format: str, question_data: dict, submitted_answer: Any) -> tuple[bool, Any]:
    """Check if answer is correct, return (is_correct, correct_answer)"""
    
    if game_format in [
        GameFormat.PERIL.value,
        GameFormat.UR_FINAL_ANSWER.value,
        GameFormat.LAST_CALL_STANDING.value,
        GameFormat.PICK_OR_PASS.value,
        GameFormat.NO_WHAMMY.value,
        GameFormat.BACK_TO_SCHOOL.value,
        GameFormat.QUIZ_CHASE.value,
        GameFormat.PKWY_LIVE.value
    ]:
        # Multiple choice - compare letter answers
        correct = question_data.get("correct_answer", "")
        return str(submitted_answer).upper() == str(correct).upper(), correct
    
    elif game_format == GameFormat.SURVEY_SAYS.value:
        # Survey - check if answer matches any in the list
        answers = question_data.get("answers", [])
        submitted_lower = str(submitted_answer).lower().strip()
        
        for ans in answers:
            if ans["answer"].lower().strip() == submitted_lower:
                return True, answers[0]["answer"]  # Return top answer
        
        return False, answers[0]["answer"] if answers else ""
    
    elif game_format == GameFormat.LINK_REACTION.value:
        # Chain - direct answer match
        correct = question_data.get("correct_answer", "")
        return str(submitted_answer).lower().strip() == correct.lower().strip(), correct
    
    elif game_format == GameFormat.SPIN_TO_WIN.value:
        # Puzzle - check letter guess or full answer
        full_answer = question_data.get("full_answer", "")
        submitted_lower = str(submitted_answer).lower().strip()
        
        # Check if it's a full answer attempt
        if len(submitted_lower) > 1:
            return submitted_lower == full_answer.lower().strip(), full_answer
        
        # It's a letter guess - check if in puzzle
        return submitted_lower in full_answer.lower(), full_answer
    
    elif game_format == GameFormat.CLOSEST_WINS.value:
        # Estimation - check if within range
        correct_num = question_data.get("correct_number", 0)
        acceptable_range = question_data.get("acceptable_range", 5)
        over_rule = question_data.get("over_rule", False)
        
        try:
            submitted_num = float(submitted_answer)
        except (ValueError, TypeError):
            return False, correct_num
        
        # Check over rule
        if over_rule and submitted_num > correct_num:
            return False, correct_num
        
        # Check if within range
        is_correct = abs(submitted_num - correct_num) <= acceptable_range
        return is_correct, correct_num
    
    elif game_format == GameFormat.CHAINED_UP.value:
        # Word chain - check if guessed word is in chain
        words = question_data.get("words", [])
        submitted_lower = str(submitted_answer).lower().strip()
        
        for word in words:
            if word.lower().strip() == submitted_lower:
                return True, words
        
        return False, words
    
    return False, None


@router.post("", response_model=AnswerResult)
async def submit_answer(submission: AnswerSubmission):
    """Submit an answer for scoring"""
    # Get the game
    game = await db.games.find_one({"id": submission.game_id}, {"_id": 0})
    
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    # Get the player
    players = game.get("players", [])
    player = None
    player_index = -1
    
    for i, p in enumerate(players):
        if p["id"] == submission.player_id:
            player = p
            player_index = i
            break
    
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    # Get game content and current question
    content = game.get("content", {})
    game_format = game.get("game_format", "")
    
    # Extract current question based on game format
    question_data = get_current_question(game_format, content, submission.question_index)
    
    if not question_data:
        raise HTTPException(status_code=400, detail="Question not found")
    
    # Check answer
    is_correct, correct_answer = check_answer(game_format, question_data, submission.answer)
    
    # Calculate points
    points = calculate_points(game_format, question_data, submission.answer, submission.time_taken, is_correct)
    
    # Update player score
    new_score = player["score"] + points
    players[player_index]["score"] = new_score
    
    if is_correct:
        players[player_index]["correct_answers"] += 1
    
    # Save updated players
    await db.games.update_one(
        {"id": submission.game_id},
        {"$set": {"players": players}}
    )
    
    return AnswerResult(
        correct=is_correct,
        points_earned=points,
        new_score=new_score,
        correct_answer=correct_answer
    )


def get_current_question(game_format: str, content: dict, question_index: int) -> Optional[dict]:
    """Extract current question from game content based on format"""
    
    if game_format == GameFormat.PERIL.value:
        # Jeopardy - flatten categories/clues
        all_clues = []
        for cat in content.get("categories", []):
            for clue in cat.get("clues", []):
                all_clues.append(clue)
        return all_clues[question_index] if question_index < len(all_clues) else None
    
    elif game_format == GameFormat.SURVEY_SAYS.value:
        questions = content.get("survey_questions", [])
        return questions[question_index] if question_index < len(questions) else None
    
    elif game_format in [
        GameFormat.UR_FINAL_ANSWER.value,
        GameFormat.LAST_CALL_STANDING.value,
        GameFormat.BACK_TO_SCHOOL.value,
        GameFormat.PKWY_LIVE.value
    ]:
        questions = content.get("questions", [])
        return questions[question_index] if question_index < len(questions) else None
    
    elif game_format == GameFormat.PICK_OR_PASS.value:
        cases = content.get("cases", [])
        return cases[question_index] if question_index < len(cases) else None
    
    elif game_format == GameFormat.LINK_REACTION.value:
        questions = content.get("questions", [])
        return questions[question_index] if question_index < len(questions) else None
    
    elif game_format == GameFormat.SPIN_TO_WIN.value:
        puzzles = content.get("puzzles", [])
        return puzzles[question_index] if question_index < len(puzzles) else None
    
    elif game_format == GameFormat.CLOSEST_WINS.value:
        numbers = content.get("numbers", [])
        return numbers[question_index] if question_index < len(numbers) else None
    
    elif game_format == GameFormat.CHAINED_UP.value:
        chains = content.get("chains", [])
        return chains[question_index] if question_index < len(chains) else None
    
    elif game_format == GameFormat.NO_WHAMMY.value:
        questions = content.get("spin_questions", [])
        return questions[question_index] if question_index < len(questions) else None
    
    elif game_format == GameFormat.QUIZ_CHASE.value:
        # Flatten categories/questions
        all_questions = []
        for cat in content.get("categories", []):
            for q in cat.get("questions", []):
                all_questions.append(q)
        return all_questions[question_index] if question_index < len(all_questions) else None
    
    return None
