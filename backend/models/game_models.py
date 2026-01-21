"""
Game Models for PKWY Tavern Game Suite
Supports 13 different game formats
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Optional, Any, Union
from datetime import datetime, timezone
from enum import Enum
import uuid


def generate_id():
    return str(uuid.uuid4())


def generate_game_code():
    import random
    import string
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


class GameFormat(str, Enum):
    PERIL = "PERIL!"
    SURVEY_SAYS = "SURVEY SAYS!"
    UR_FINAL_ANSWER = "UR FINAL ANSWER!"
    LAST_CALL_STANDING = "LAST CALL STANDING"
    PICK_OR_PASS = "PICK OR PASS!"
    LINK_REACTION = "LINK REACTION"
    SPIN_TO_WIN = "SPIN TO WIN!"
    CLOSEST_WINS = "CLOSEST WINS!"
    CHAINED_UP = "CHAINED UP"
    NO_WHAMMY = "NO WHAMMY!"
    BACK_TO_SCHOOL = "BACK TO SCHOOL!"
    QUIZ_CHASE = "QUIZ CHASE"
    PKWY_LIVE = "PKWY LIVE!"
    GAME_NIGHT_MIX = "GAME NIGHT MIX"


class GameStatus(str, Enum):
    WAITING = "waiting"
    ACTIVE = "active"
    PAUSED = "paused"
    FINISHED = "finished"


# ============================================================
# PERIL! (Jeopardy-style) Models
# ============================================================
class PerilClue(BaseModel):
    value: int
    difficulty: int
    clue_text: str
    correct_answer: str
    wrong_answers: List[str]
    revealed: bool = False
    answered: bool = False


class PerilCategory(BaseModel):
    category_title: str
    clues: List[PerilClue]


class PerilGame(BaseModel):
    game_name: str = "PERIL!"
    categories: List[PerilCategory]


# ============================================================
# SURVEY SAYS! (Family Feud-style) Models
# ============================================================
class SurveyAnswer(BaseModel):
    answer: str
    percent: int
    revealed: bool = False


class SurveyQuestion(BaseModel):
    question: str
    answers: List[SurveyAnswer]
    strikes: int = 0
    max_strikes: int = 3


class SurveySaysGame(BaseModel):
    game_name: str = "SURVEY SAYS!"
    survey_questions: List[SurveyQuestion]


# ============================================================
# UR FINAL ANSWER! (Millionaire-style) Models
# ============================================================
class MillionaireQuestion(BaseModel):
    point_value: int
    difficulty: int
    question_text: str
    choices: Dict[str, str]  # {"A": "", "B": "", "C": "", "D": ""}
    correct_answer: str  # "A", "B", "C", or "D"
    lifelines_used: List[str] = []


class UrFinalAnswerGame(BaseModel):
    game_name: str = "UR FINAL ANSWER!"
    questions: List[MillionaireQuestion]
    available_lifelines: List[str] = ["50-50", "Ask the Audience", "Phone a Friend"]


# ============================================================
# LAST CALL STANDING (Elimination-style) Models
# ============================================================
class LastCallQuestion(BaseModel):
    difficulty: int
    question_text: str
    choices: Dict[str, str]
    correct_answer: str


class LastCallStandingGame(BaseModel):
    game_name: str = "LAST CALL STANDING"
    questions: List[LastCallQuestion]


# ============================================================
# PICK OR PASS! (Deal or No Deal-style) Models
# ============================================================
class PickOrPassCase(BaseModel):
    case_number: int
    case_value: int
    question_text: str
    choices: Dict[str, str]
    correct_answer: str
    wrong_answers: List[str]
    tension_meter: int
    opened: bool = False


class PickOrPassGame(BaseModel):
    game_name: str = "PICK OR PASS!"
    cases: List[PickOrPassCase]


# ============================================================
# LINK REACTION (Chain-style) Models
# ============================================================
class LinkQuestion(BaseModel):
    chain_value: int
    penalty_value: int
    question_text: str
    correct_answer: str
    wrong_answers: List[str]


class LinkReactionGame(BaseModel):
    game_name: str = "LINK REACTION"
    questions: List[LinkQuestion]


# ============================================================
# SPIN TO WIN! (Wheel of Fortune-style) Models
# ============================================================
class SpinPuzzle(BaseModel):
    category: str
    puzzle_with_blanks: str
    full_answer: str
    bonus_letter: str = ""
    revealed_letters: List[str] = []
    solved: bool = False


class SpinToWinGame(BaseModel):
    game_name: str = "SPIN TO WIN!"
    puzzles: List[SpinPuzzle]


# ============================================================
# CLOSEST WINS! (Price Is Right-style) Models
# ============================================================
class ClosestWinsQuestion(BaseModel):
    question_text: str
    correct_number: float
    acceptable_range: float
    over_rule: bool  # If true, going over disqualifies


class ClosestWinsGame(BaseModel):
    game_name: str = "CLOSEST WINS!"
    numbers: List[ClosestWinsQuestion]


# ============================================================
# CHAINED UP (Word Chain-style) Models
# ============================================================
class WordChain(BaseModel):
    chain_title: str
    words: List[str]
    explanation: str
    current_position: int = 0


class ChainedUpGame(BaseModel):
    game_name: str = "CHAINED UP"
    chains: List[WordChain]


# ============================================================
# NO WHAMMY! (Press Your Luck-style) Models
# ============================================================
class BoardPanel(BaseModel):
    panel: int
    content: Union[str, int]  # "WHAMMY!" or point value


class SpinQuestion(BaseModel):
    question_text: str
    choices: Dict[str, str]
    correct_answer: str


class NoWhammyGame(BaseModel):
    game_name: str = "NO WHAMMY!"
    board: List[BoardPanel]
    spin_questions: List[SpinQuestion]


# ============================================================
# BACK TO SCHOOL! (5th Grader-style) Models
# ============================================================
class SchoolQuestion(BaseModel):
    subject: str
    grade_level: int
    question_text: str
    choices: Dict[str, str]
    correct_answer: str


class BackToSchoolGame(BaseModel):
    game_name: str = "BACK TO SCHOOL!"
    questions: List[SchoolQuestion]


# ============================================================
# QUIZ CHASE (Trivial Pursuit-style) Models
# ============================================================
class QuizChaseQuestion(BaseModel):
    difficulty: int
    question_text: str
    choices: Dict[str, str]
    correct_answer: str


class QuizChaseCategory(BaseModel):
    category_title: str
    questions: List[QuizChaseQuestion]


class QuizChaseGame(BaseModel):
    game_name: str = "QUIZ CHASE"
    categories: List[QuizChaseCategory]


# ============================================================
# PKWY LIVE! (HQ Trivia-style) Models
# ============================================================
class PKWYLiveQuestion(BaseModel):
    difficulty: int
    question_text: str
    choices: Dict[str, str]
    correct_answer: str


class PKWYLiveGame(BaseModel):
    game_name: str = "PKWY LIVE!"
    questions: List[PKWYLiveQuestion]


# ============================================================
# Game Content - Union of all game types
# ============================================================
GameContent = Union[
    PerilGame,
    SurveySaysGame,
    UrFinalAnswerGame,
    LastCallStandingGame,
    PickOrPassGame,
    LinkReactionGame,
    SpinToWinGame,
    ClosestWinsGame,
    ChainedUpGame,
    NoWhammyGame,
    BackToSchoolGame,
    QuizChaseGame,
    PKWYLiveGame
]


# ============================================================
# Main Game Session Model
# ============================================================
class Player(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=generate_id)
    name: str
    score: int = 0
    correct_answers: int = 0
    eliminated: bool = False
    connected: bool = True
    joined_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class PlayerCreate(BaseModel):
    name: str
    game_code: str


class PlayerResponse(BaseModel):
    id: str
    name: str
    game_code: str
    score: int


class GameSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=generate_id)
    code: str = Field(default_factory=generate_game_code)
    name: str
    host: str
    venue: str = "PKWY Tavern"
    game_format: str  # One of GameFormat values
    status: str = GameStatus.WAITING.value
    current_question_index: int = 0
    current_round: int = 1
    content: Optional[Dict[str, Any]] = None  # Stores the game-specific content
    players: List[Player] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    started_at: Optional[str] = None
    finished_at: Optional[str] = None


class GameSessionCreate(BaseModel):
    name: str
    host: str
    venue: str = "PKWY Tavern"
    game_format: str


class GameSessionResponse(BaseModel):
    id: str
    code: str
    name: str
    host: str
    venue: str
    game_format: str
    status: str
    current_question_index: int
    current_round: int
    players_count: int
    created_at: str


# ============================================================
# Game Pack Model (for storing imported game content)
# ============================================================
class GamePack(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=generate_id)
    name: str
    description: str = ""
    game_format: str
    content: Dict[str, Any]  # The full game content JSON
    tags: List[str] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class GamePackCreate(BaseModel):
    name: str
    description: str = ""
    content: Dict[str, Any]  # The JSON from ChatGPT
    tags: List[str] = []


class GamePackResponse(BaseModel):
    id: str
    name: str
    description: str
    game_format: str
    tags: List[str]
    created_at: str


# ============================================================
# Answer Submission Model
# ============================================================
class AnswerSubmission(BaseModel):
    player_id: str
    game_id: str
    question_index: int
    answer: Any  # Could be string, int, or dict depending on game type
    time_taken: float  # Seconds


class AnswerResult(BaseModel):
    correct: bool
    points_earned: int
    new_score: int
    correct_answer: Any


# ============================================================
# Leaderboard Model
# ============================================================
class LeaderboardEntry(BaseModel):
    rank: int
    player_id: str
    name: str
    score: int
    correct_answers: int
    trend: str = "same"  # "up", "down", "same"
