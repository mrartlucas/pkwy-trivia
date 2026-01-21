# Trivia Game System - Backend Implementation Contracts

## Overview
This document outlines the API contracts, database models, WebSocket events, and integration plan for converting the mock-based frontend into a full-stack real-time trivia game system.

## Database Models

### Game Model
```python
{
    "id": ObjectId,
    "code": String (unique, 6 chars, uppercase),
    "name": String,
    "host": String,
    "status": String (enum: "waiting", "active", "finished"),
    "current_question_index": Integer,
    "questions": Array[ObjectId] (references to Question),
    "players": Array[ObjectId] (references to Player),
    "created_at": DateTime,
    "started_at": DateTime (nullable),
    "finished_at": DateTime (nullable)
}
```

### Question Model
```python
{
    "id": ObjectId,
    "type": String (enum: "multiple_choice", "true_false", "fastest_finger", "survey"),
    "question": String,
    "options": Array[String] (for multiple_choice),
    "correct_answer": Mixed (Integer for multiple_choice, Boolean for true_false, String for fastest_finger),
    "survey_answers": Array[{text: String, points: Integer}] (for survey type),
    "points": Integer,
    "time_limit": Integer (seconds),
    "created_at": DateTime
}
```

### Player Model
```python
{
    "id": ObjectId,
    "name": String,
    "game_id": ObjectId (reference to Game),
    "score": Integer (default: 0),
    "correct_answers": Integer (default: 0),
    "answers": Array[{
        question_id: ObjectId,
        answer: Mixed,
        time_taken: Float,
        correct: Boolean,
        points_earned: Integer
    }],
    "joined_at": DateTime,
    "connection_id": String (WebSocket connection ID)
}
```

## REST API Endpoints

### Game Management

#### POST /api/games
Create a new game
**Request:**
```json
{
    "name": "Friday Night Trivia",
    "host": "DJ Mike",
    "question_ids": ["question_id_1", "question_id_2", ...]
}
```
**Response:**
```json
{
    "id": "game_id",
    "code": "QUIZ42",
    "name": "Friday Night Trivia",
    "host": "DJ Mike",
    "status": "waiting",
    "questions": [...],
    "created_at": "2025-01-15T10:00:00Z"
}
```

#### GET /api/games/{game_code}
Get game details by code
**Response:**
```json
{
    "id": "game_id",
    "code": "QUIZ42",
    "name": "Friday Night Trivia",
    "status": "active",
    "current_question_index": 3,
    "total_questions": 10,
    "players_count": 8
}
```

#### GET /api/games
Get all games (for host dashboard)
**Response:**
```json
[
    {
        "id": "game_id",
        "code": "QUIZ42",
        "name": "Friday Night Trivia",
        "status": "waiting",
        "players_count": 0,
        "created_at": "2025-01-15T10:00:00Z"
    }
]
```

#### DELETE /api/games/{game_id}
Delete a game

#### PATCH /api/games/{game_id}/start
Start a game (change status to "active")

#### PATCH /api/games/{game_id}/next-question
Move to next question

#### PATCH /api/games/{game_id}/finish
Finish a game

### Question Management

#### POST /api/questions
Create a new question
**Request:**
```json
{
    "type": "multiple_choice",
    "question": "What is the capital of France?",
    "options": ["London", "Berlin", "Paris", "Madrid"],
    "correct_answer": 2,
    "points": 100,
    "time_limit": 30
}
```
**Response:**
```json
{
    "id": "question_id",
    "type": "multiple_choice",
    "question": "What is the capital of France?",
    ...
}
```

#### GET /api/questions
Get all questions
**Response:**
```json
[
    {
        "id": "question_id",
        "type": "multiple_choice",
        "question": "What is the capital of France?",
        ...
    }
]
```

#### GET /api/questions/{question_id}
Get single question

#### PUT /api/questions/{question_id}
Update a question

#### DELETE /api/questions/{question_id}
Delete a question

### Player Management

#### POST /api/players/join
Join a game
**Request:**
```json
{
    "name": "John Doe",
    "game_code": "QUIZ42"
}
```
**Response:**
```json
{
    "player_id": "player_id",
    "game_id": "game_id",
    "name": "John Doe",
    "score": 0
}
```

#### GET /api/games/{game_code}/players
Get all players in a game
**Response:**
```json
[
    {
        "id": "player_id",
        "name": "John Doe",
        "score": 450,
        "correct_answers": 5
    }
]
```

#### GET /api/games/{game_code}/leaderboard
Get leaderboard for a game
**Response:**
```json
[
    {
        "rank": 1,
        "player_id": "player_id",
        "name": "Alex Thunder",
        "score": 450,
        "correct_answers": 5
    }
]
```

### Answer Submission

#### POST /api/answers
Submit an answer
**Request:**
```json
{
    "player_id": "player_id",
    "game_id": "game_id",
    "question_id": "question_id",
    "answer": 2,
    "time_taken": 12.5
}
```
**Response:**
```json
{
    "correct": true,
    "points_earned": 100,
    "new_score": 450,
    "correct_answer": 2
}
```

## WebSocket Events

### Connection
**URL:** `ws://{host}/ws/game/{game_code}/{player_id}`

### Events from Server to Client

#### game:player_joined
```json
{
    "event": "game:player_joined",
    "data": {
        "player_id": "player_id",
        "name": "John Doe",
        "players_count": 9
    }
}
```

#### game:started
```json
{
    "event": "game:started",
    "data": {
        "game_id": "game_id",
        "first_question": {...}
    }
}
```

#### game:question
```json
{
    "event": "game:question",
    "data": {
        "question_index": 0,
        "question": {
            "id": "question_id",
            "type": "multiple_choice",
            "question": "What is the capital of France?",
            "options": ["London", "Berlin", "Paris", "Madrid"],
            "points": 100,
            "time_limit": 30
        }
    }
}
```

#### game:question_ended
```json
{
    "event": "game:question_ended",
    "data": {
        "question_id": "question_id",
        "correct_answer": 2
    }
}
```

#### game:leaderboard
```json
{
    "event": "game:leaderboard",
    "data": [
        {
            "rank": 1,
            "player_id": "player_id",
            "name": "Alex Thunder",
            "score": 450,
            "trend": "up"
        }
    ]
}
```

#### game:finished
```json
{
    "event": "game:finished",
    "data": {
        "winner": {
            "player_id": "player_id",
            "name": "Alex Thunder",
            "score": 450
        },
        "final_leaderboard": [...]
    }
}
```

#### player:answer_result
```json
{
    "event": "player:answer_result",
    "data": {
        "correct": true,
        "points_earned": 100,
        "new_score": 450
    }
}
```

### Events from Client to Server

#### answer:submit
```json
{
    "event": "answer:submit",
    "data": {
        "question_id": "question_id",
        "answer": 2,
        "time_taken": 12.5
    }
}
```

#### buzzer:press
```json
{
    "event": "buzzer:press",
    "data": {
        "question_id": "question_id",
        "timestamp": "2025-01-15T10:00:12.345Z"
    }
}
```

## Mock Data Replacement Plan

### mockData.js Components to Replace

1. **mockGames** → Replace with API call to `GET /api/games`
2. **mockQuestions** → Replace with API call to `GET /api/questions`
3. **mockPlayers** → Replace with API call to `GET /api/games/{game_code}/players`
4. **mockLeaderboard** → Replace with WebSocket event `game:leaderboard`

### Frontend Files to Update

#### PlayerJoin.jsx
- Replace localStorage with API call to `POST /api/players/join`
- Store player_id and game_id from response

#### PlayerGame.jsx
- Establish WebSocket connection on mount
- Listen for `game:question` events instead of mock questions
- Send `answer:submit` events instead of local state updates
- Listen for `player:answer_result` for score updates
- Listen for `game:leaderboard` for real-time leaderboard

#### TVDisplay.jsx
- Establish WebSocket connection for game updates
- Listen for `game:player_joined` to update player count
- Listen for `game:question` to display questions
- Listen for `game:leaderboard` to display standings
- Listen for `game:finished` for final results

#### HostDashboard.jsx
- Replace mock games with `GET /api/games`
- Replace mock questions with `GET /api/questions`
- Create game with `POST /api/games`
- Create question with `POST /api/questions`
- Start game with `PATCH /api/games/{game_id}/start`
- Delete game with `DELETE /api/games/{game_id}`

## Backend Implementation Order

1. **Database Models** - Create Pydantic models and MongoDB schemas
2. **Question CRUD** - Implement question creation, retrieval, update, delete
3. **Game CRUD** - Implement game creation, retrieval, update, delete
4. **Player Join** - Implement player joining games
5. **WebSocket Setup** - Setup WebSocket connection management
6. **Game Flow Logic** - Implement game state transitions
7. **Answer Submission** - Implement answer validation and scoring
8. **Leaderboard** - Implement real-time leaderboard updates
9. **Game Control** - Implement host controls (start, next question, finish)

## Real-time Features

### WebSocket Connection Management
- Each player and TV display maintains a WebSocket connection
- Connections are identified by player_id or "tv_{game_code}"
- Server broadcasts events to all connections in a game room
- Handle disconnections and reconnections gracefully

### Game State Synchronization
- All game state changes are broadcast to all connected clients
- TV display receives all events for visualization
- Players receive only relevant events (their results + leaderboard)
- Host receives all administrative events

## Testing Strategy

1. Test question CRUD operations
2. Test game creation and player joining
3. Test WebSocket connections and message broadcasting
4. Test answer submission and scoring logic
5. Test leaderboard calculations
6. Test game flow (start → questions → finish)
7. Test concurrent player submissions
8. Test fastest finger/buzzer race conditions
