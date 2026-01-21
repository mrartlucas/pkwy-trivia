# PKWY Tavern Game Suite - Product Requirements Document

## Overview
A white-label, multi-format trivia game show system for bars and venues. Players use mobile phones to answer questions while the main game display is shown on TVs. Hosts control the game flow through a Director Panel.

## Core Product Features

### Implemented ✅
1. **13 Game Formats** - Each inspired by popular game shows:
   - PERIL! (Jeopardy-style)
   - SURVEY SAYS! (Family Feud-style)
   - UR FINAL ANSWER! (Millionaire-style)
   - LAST CALL STANDING (Elimination-style)
   - PICK OR PASS! (Deal or No Deal-style)
   - LINK REACTION (Chain-style)
   - SPIN TO WIN! (Wheel of Fortune-style)
   - CLOSEST WINS! (Price Is Right-style)
   - CHAINED UP (Word Chain-style)
   - NO WHAMMY! (Press Your Luck-style)
   - BACK TO SCHOOL! (5th Grader-style)
   - QUIZ CHASE (Trivial Pursuit-style)
   - PKWY LIVE! (HQ Trivia-style)

2. **Backend API** (FastAPI + MongoDB)
   - Game CRUD operations
   - Game Pack import/management
   - Player join/management
   - Answer submission scoring
   - WebSocket real-time communication

3. **Frontend Pages**
   - Host Dashboard (game management, pack import)
   - TV Display (all 13 game format UIs)
   - Director Panel (real-time game controls)
   - Player Join (mobile-friendly join flow)
   - Player Game (answer submission interface)

4. **Key Features**
   - White-label branding system
   - JSON import for ChatGPT-generated content
   - Real-time WebSocket sync (Director ↔ TV ↔ Players)
   - 6-character game codes for easy joining
   - Media Library for branding assets

## Technical Architecture

### Backend
- **Framework**: FastAPI
- **Database**: MongoDB (motor async driver)
- **Real-time**: WebSocket for game events
- **Port**: 8001 (internal), routed via /api prefix

### Frontend
- **Framework**: React
- **Styling**: TailwindCSS + Shadcn UI
- **Routing**: react-router-dom
- **Port**: 3000

### API Endpoints
```
POST   /api/games                    - Create game
GET    /api/games                    - List all games
GET    /api/games/code/{code}        - Get game by code
GET    /api/games/{id}               - Get game by ID
PATCH  /api/games/{id}/start         - Start game
PATCH  /api/games/{id}/pause         - Pause game
PATCH  /api/games/{id}/resume        - Resume game
PATCH  /api/games/{id}/finish        - End game
PATCH  /api/games/{id}/content       - Load game pack
DELETE /api/games/{id}               - Delete game

POST   /api/games/{code}/join        - Player joins game
GET    /api/games/{code}/players     - Get players
GET    /api/games/{code}/leaderboard - Get leaderboard

POST   /api/game-packs               - Import game pack
GET    /api/game-packs               - List all packs
GET    /api/game-packs/formats       - Get available formats
GET    /api/game-packs/{id}          - Get pack details
DELETE /api/game-packs/{id}          - Delete pack

POST   /api/answers                  - Submit answer

WebSocket:
  /ws/director/{game_code}           - Director controls
  /ws/tv/{game_code}                 - TV display updates
  /ws/player/{game_code}/{player_id} - Player interactions
```

## Development Progress

### Phase A: Frontend (Complete) ✅
- [x] Player Join page
- [x] Player Game page
- [x] TV Display with all 13 game format components
- [x] Host Dashboard with tabs
- [x] Director Panel with controls
- [x] Branding configuration
- [x] API service integration

### Phase B: Backend (Complete) ✅
- [x] MongoDB models for all 13 formats
- [x] Games REST API
- [x] Game Packs REST API
- [x] Player management API
- [x] Answer submission API
- [x] WebSocket manager
- [x] Real-time event handling

### Phase C: Testing (Complete) ✅
- [x] 24 API tests (100% pass)
- [x] Frontend UI validation
- [x] End-to-end flow testing

## Future Enhancements (Backlog)
- [ ] Media tagging system (assign media to game events)
- [ ] Game statistics/analytics dashboard
- [ ] Multi-round game sessions
- [ ] Team play mode
- [ ] Sound effects integration
- [ ] Custom branding upload

## Key Files
- `/app/backend/server.py` - Main server
- `/app/backend/models/game_models.py` - All data models
- `/app/backend/routes/games.py` - Game endpoints
- `/app/backend/routes/game_packs.py` - Pack endpoints
- `/app/frontend/src/services/api.js` - API service
- `/app/frontend/src/pages/TVDisplay.jsx` - TV display
- `/app/frontend/src/components/games/` - 13 game components

## Testing
- Test file: `/app/tests/test_pubgame_api.py`
- Test report: `/app/test_reports/iteration_1.json`
- All 24 tests passing

## URLs
- Frontend: https://pubgame-1.preview.emergentagent.com
- API Base: https://pubgame-1.preview.emergentagent.com/api

## Last Updated
January 21, 2026 - Phase C Complete (Full Backend + Testing)
