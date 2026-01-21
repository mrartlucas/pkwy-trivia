# PKWY Tavern Trivia System - Complete Documentation
## White-Label Multi-Format Game Show Platform

**Version:** 1.0 MVP  
**Last Updated:** January 2025  
**Venue:** PKWY Tavern (Fine Entertainment)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Features Completed](#features-completed)
4. [User Guides](#user-guides)
5. [Technical Details](#technical-details)
6. [What's Remaining](#whats-remaining)
7. [Setup & Deployment](#setup--deployment)

---

## System Overview

### What Is This System?

A comprehensive bar trivia game show platform inspired by QuizXpress, designed specifically for PKWY Tavern with the ability to rebrand for other Fine Entertainment properties. The system supports multiple game show formats (Jeopardy, Millionaire, Family Feud, etc.) with real-time gameplay across three interfaces:

1. **TV Display** - Large screen for audience in venue
2. **Mobile Player Interface** - Phones for answering questions
3. **Director Control Panel** - Tablet/laptop for host to control game

### Key Differentiators

- **Web-Based**: No installation required, works on any device
- **White-Label**: Easy rebranding for different venues
- **Multi-Format**: Mix different game show styles in one game
- **Modern Stack**: React + FastAPI + MongoDB
- **Media Support**: Import graphics from Dzine, videos from Higgsfield AI
- **Bulk Import**: Load 50+ questions instantly via CSV/JSON

---

## Architecture

### Tech Stack

**Frontend:**
- React 19.0.0
- Tailwind CSS 3.4.17
- Shadcn UI components
- React Router for navigation
- Axios for API calls

**Backend (Planned):**
- FastAPI (Python)
- MongoDB with Motor (async driver)
- WebSocket for real-time updates
- JWT authentication

**Infrastructure:**
- Docker containers
- Nginx reverse proxy
- Supervisor for process management

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    PKWY Trivia System                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   TV Display │  │   Director   │  │    Mobile    │      │
│  │   (Audience) │  │   (Host)     │  │   (Players)  │      │
│  │              │  │              │  │              │      │
│  │  Questions   │  │  Game        │  │  Join &      │      │
│  │  Scores      │  │  Controls    │  │  Answer      │      │
│  │  Leaderboard │  │  Live Stats  │  │  Questions   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │  WebSocket     │                        │
│                    │  Backend       │                        │
│                    │  (Real-time)   │                        │
│                    └───────┬────────┘                        │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │   MongoDB      │                        │
│                    │   Database     │                        │
│                    └────────────────┘                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### File Structure

```
/app
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn components
│   │   │   ├── QuestionImport.jsx
│   │   │   └── MediaLibrary.jsx
│   │   ├── pages/
│   │   │   ├── PlayerJoin.jsx
│   │   │   ├── PlayerGame.jsx
│   │   │   ├── TVDisplay.jsx
│   │   │   ├── HostDashboard.jsx
│   │   │   └── DirectorPanel.jsx
│   │   ├── config/
│   │   │   └── branding.js      # White-label config
│   │   ├── mockData.js          # Sample questions/games
│   │   └── App.js
│   ├── public/
│   └── package.json
├── backend/
│   ├── server.py                # FastAPI main
│   ├── models/                  # (To be built)
│   ├── routes/                  # (To be built)
│   └── requirements.txt
├── contracts.md                 # API contracts
├── VIDEO_SPECS.md              # Video requirements
├── MEDIA_FORMAT_GUIDE.md       # Dzine/Higgsfield specs
└── QUIZXPRESS_ANALYSIS.md      # Feature comparison
```

---

## Features Completed

### ✅ 1. Player Join Interface

**URL:** `https://[your-domain]/`

**Features:**
- PKWY Tavern branded landing page
- Enter player name (max 20 characters)
- Enter game code (uppercase, 6-10 characters)
- Input validation with error messages
- Responsive mobile design
- Link to Host Dashboard

**How It Works:**
1. Player opens URL on phone
2. Enters name and game code shown on TV
3. Clicks "Join Game"
4. Redirected to waiting room

### ✅ 2. TV Display (Live Presentation)

**URL:** `https://[your-domain]/tv/TRIVIA`

**Features:**
- **Lobby Screen:**
  - PKWY logo prominently displayed
  - Venue name and tagline
  - Large game code for players to join
  - Live player count
  - Animated loading indicators

- **Jeopardy-Style Board:**
  - Blue board with yellow accents (iconic colors)
  - PKWY logo in header
  - Category name and point value
  - 4 answer options with A/B/C/D labels
  - Timer countdown
  - Answer reveal with green highlight
  - Smooth animations

- **Leaderboard Display:**
  - Top 5 or all players
  - Rank, name, score, correct answers
  - PKWY branding throughout
  - Animated transitions

- **Final Results:**
  - Winner highlighted with PKWY colors
  - Trophy icon for #1
  - Full standings
  - Celebration layout

**Auto-Flow (Mock Mode):**
- Shows lobby for 5 seconds
- Displays each question for 10 seconds
- Reveals answer for 4 seconds
- Shows leaderboard between questions for 5 seconds
- Cycles through all 10 questions

### ✅ 3. Player Game Interface

**URL:** `https://[your-domain]/player/TRIVIA`

**Features:**
- **Waiting Room:**
  - PKWY logo display
  - Player name confirmation
  - Game code display
  - Player count
  - "Waiting for host" message

- **Gameplay:**
  - Question display with format badge (Jeopardy, Millionaire, etc.)
  - Timer countdown
  - Score display
  - Question progress (1/10)

- **Question Types:**
  - **Jeopardy/Multiple Choice:** 4 buttons with options
  - **True/False:** Large TRUE/FALSE buttons
  - **Family Feud:** Type answer OR select from list
  - **Majority Rules:** Vote for preferred option
  - **Last Man Standing:** True/False elimination

- **Feedback:**
  - Correct: Green highlight + points earned
  - Incorrect: Red highlight
  - Toast notifications
  - Instant visual feedback

- **Results Screen:**
  - Final score display
  - Trophy icon
  - "Play Again" button

### ✅ 4. Director Control Panel

**URL:** `https://[your-domain]/director/TRIVIA`

**Features:**
- **Game Controls:**
  - Start Game button
  - Pause/Resume
  - Next Question
  - Previous Question
  - Show/Hide Answer
  - Show/Hide Leaderboard
  - Sound toggle
  - End Game

- **Current Question Display:**
  - Format type badge
  - Points and time limit
  - Question text
  - All answer options
  - Correct answer highlighted in green
  - Host notes section

- **Live Statistics (Mock):**
  - Players answered: 5/8
  - Correct answers: 3
  - Incorrect answers: 2
  - Response breakdown by option (% bars)

- **Player List:**
  - All connected players
  - Current scores
  - Connection status (green dot)
  - Scrollable list

- **Top 5 Leaderboard:**
  - Rank badges
  - Names and scores
  - Quick view

- **Quick Actions:**
  - Open TV Display (new window)
  - Game Settings
  - Return to Dashboard

**Status Badge:**
- READY (before start)
- PLAYING (game active)
- PAUSED (temporarily stopped)

### ✅ 5. Host Dashboard

**URL:** `https://[your-domain]/host`

**Features:**

**Tab 1: Games**
- Create new game
  - Game name
  - Host name
  - Auto-generates game code
- View all games
  - Status badges (waiting, active, finished)
  - Player count
  - Game code display
- Actions per game:
  - Open TV Display (new window)
  - Open Director Panel
  - Settings
  - Delete game

**Tab 2: Question Bank**
- View all questions (10 mock questions included)
- Format badges (Jeopardy, Millionaire, Family Feud, etc.)
- Points and time limit display
- Add single question manually
  - Question type selector
  - Question text
  - Options (up to 4)
  - Mark correct answer
  - Set points and time limit
- Edit existing questions
- Delete questions

**Tab 3: Import & Packs**
- **Bulk Import:**
  - Upload CSV or JSON files
  - Drag-and-drop interface
  - File validation
  - Preview before import
  - Error reporting
  - Import up to 1000 questions at once

- **Template Downloads:**
  - CSV template with examples
  - JSON template with structure
  - One-click download

- **Game Pack Library (8 packs):**
  1. 🧠 General Knowledge - 50 mixed questions
  2. 💡 Jeopardy Classics - 30 category questions
  3. 💰 Millionaire Challenge - 15 progressive difficulty
  4. 👨‍👩‍👧‍👦 Family Feud Fun - 20 survey questions
  5. ⚽ Sports Trivia - 40 sports questions
  6. 🎬 Movie Madness - 35 film/TV questions
  7. 🎵 Music Masters - 30 music questions
  8. 🍺 Bar Trivia Classics - 50 pub questions

- **Each Pack Shows:**
  - Icon and name
  - Description
  - Format type
  - Question count
  - Categories included
  - Load Pack button
  - Preview button

**Tab 4: Media Library**
- **Upload Interface:**
  - Images: PNG, JPG, WebP, SVG (max 10 MB)
  - Videos: MP4, WebM (max 50 MB)
  - Audio: MP3, WAV, OGG (max 20 MB)
  - Drag-and-drop zones
  - File type validation

- **Format Guidelines Display:**
  - Recommended specs for Dzine graphics
  - Recommended specs for Higgsfield AI videos
  - Best practices
  - Size and resolution requirements

- **Media Library Grid:**
  - Thumbnail previews
  - File name and size
  - Dimensions/duration
  - Usage tags
  - Filter by type (All, Images, Videos, Audio)
  - View and Delete actions

- **Usage Guide:**
  - How to use venue branding
  - How to add intro videos
  - How to set question backgrounds
  - How to add transition effects

### ✅ 6. White-Label Branding System

**File:** `/app/frontend/src/config/branding.js`

**Configuration:**
```javascript
{
  venue: {
    name: 'PKWY Tavern',
    tagline: 'Taphouse and Grille',
    logo: '[logo-url]'
  },
  colors: {
    primary: '#006838',    // PKWY Green
    secondary: '#004d29',  // Darker Green
    accent: '#ffffff',     // White
    text: '#000000',
    textLight: '#666666'
  },
  fonts: {
    heading: 'Impact, Arial Black',
    body: 'Arial'
  }
}
```

**Applied To:**
- Player Join page (logo, colors)
- TV Display (logo in header, color accents)
- Director Panel (logo, primary color for buttons)
- Host Dashboard (theme colors)
- All buttons, badges, and UI elements

**How to Rebrand:**
1. Update `branding.js` file
2. Upload new logo to Media Library
3. Change color hex codes
4. Refresh pages

### ✅ 7. Game Format Support

**Formats Implemented:**

**Jeopardy-Style:**
- Category-based questions
- Point values (200-400)
- 4 answer options
- Blue board with yellow text (TV)
- "Answer in form of question" style

**Millionaire-Style:**
- Progressive difficulty
- Lifelines system (UI ready)
- Money ladder (planned for TV)
- 4 options labeled A, B, C, D

**Family Feud-Style:**
- Survey questions
- Top 5 answers
- Text input OR select from board
- Points per answer
- X strikes system (planned)

**Majority Rules:**
- Crowd voting
- 2-4 options
- Winner = most votes

**Last Man Standing:**
- True/False elimination
- Wrong answer = eliminated
- High stakes gameplay

### ✅ 8. Mock Data System

**10 Sample Questions:**
- 3 Jeopardy (History, Science, Sports)
- 2 Millionaire (Geography, trivia)
- 2 Family Feud (Pizza toppings, Beach items)
- 1 Majority Rules (Sports preference)
- 2 Last Man Standing (True/False)

**Sample Players:**
- 4 connected players with scores
- Realistic names
- Score range: 250-1200 points

**Sample Games:**
- 2 mock games (TRIVIA, QUIZ42)
- Different statuses
- Player counts

---

## User Guides

### For Bar Patrons (Players)

**How to Join:**
1. Look at the TV screen for the game code (e.g., "TRIVIA")
2. Open browser on your phone
3. Go to the URL shown on TV
4. Enter your name
5. Enter the game code
6. Wait in lobby for game to start

**During Game:**
- Read question on TV screen
- Answer on your phone
- Timer shows seconds remaining
- Tap your answer choice
- Get instant feedback (green = correct, red = wrong)
- See your score update
- Check leaderboard on TV between questions

**Question Types:**
- **Multiple Choice:** Pick A, B, C, or D
- **True/False:** Pick TRUE or FALSE
- **Family Feud:** Type your answer or pick from list
- **Voting:** Pick your favorite option

### For Hosts (Running the Game)

**Before the Event:**
1. Go to Host Dashboard
2. Click "Import & Packs" tab
3. Load a Game Pack (e.g., "Bar Trivia Classics")
4. Or upload your own CSV/JSON file
5. Review questions in Question Bank

**Setting Up Game:**
1. Go to "Games" tab
2. Click "Create Game"
3. Enter game name (e.g., "Friday Night Trivia")
4. Enter your name as host
5. System generates game code (e.g., "TRIVIA")
6. Note the game code

**Starting the Game:**
1. Click "TV Display" button - opens on bar TV
2. Game code appears on TV screen
3. Players join via their phones
4. Watch player count increase
5. Click "Open Director Panel" - opens on your tablet/laptop
6. In Director Panel, click "Start Game"

**Controlling the Game:**
1. Director Panel shows current question
2. See live player responses
3. Click "Show Answer" to reveal correct answer on TV
4. Click "Next Question" to advance
5. Click "Show Scores" to display leaderboard on TV
6. Use Pause if you need to stop temporarily

**Between Questions:**
- Leaderboard shows automatically
- Take a break if needed (use Pause)
- Check response statistics
- See who's answering correctly

**Ending the Game:**
1. After last question, final leaderboard shows
2. Winner displayed with trophy
3. Click "End Game" in Director Panel
4. Thank players!

### For Venue Managers

**Initial Setup:**
1. Upload PKWY logo to Media Library
2. Create intro video (10-15 seconds)
3. Upload venue-specific graphics
4. Test on actual TV before first event

**Branding:**
1. Logo appears on all screens
2. PKWY green color throughout
3. Consistent look across player phones and TV
4. Can rebrand for other Fine Entertainment venues

**Content Management:**
1. Use Game Packs for quick setup
2. Import custom questions via CSV
3. Mix different game formats
4. Update media library regularly

**Quality Control:**
1. Test game before live event
2. Check TV display quality
3. Verify players can join
4. Practice with Director controls

---

## Technical Details

### Frontend Routes

```
/                          Player Join page
/player/:gameCode          Player Game interface
/tv/:gameCode              TV Display (full screen)
/host                      Host Dashboard
/director/:gameCode        Director Control Panel
```

### Mock Data Structure

**Question Format:**
```javascript
{
  id: 'Q001',
  format: 'jeopardy',        // or millionaire, family_feud, etc.
  category: 'History',       // for jeopardy
  question: 'Question text',
  options: ['A', 'B', 'C', 'D'],
  correctAnswer: 1,          // index of correct option
  points: 200,               // or pointValue
  timeLimit: 30              // seconds
}
```

**Family Feud Format:**
```javascript
{
  id: 'Q006',
  format: 'family_feud',
  question: 'Name a popular pizza topping',
  answers: [
    { text: 'Pepperoni', points: 45 },
    { text: 'Mushrooms', points: 22 },
    { text: 'Sausage', points: 15 },
    { text: 'Onions', points: 10 },
    { text: 'Peppers', points: 8 }
  ],
  timeLimit: 60
}
```

**Player Format:**
```javascript
{
  id: 'P001',
  name: 'Alex Thunder',
  gameCode: 'TRIVIA',
  score: 1200,
  correctAnswers: 6,
  eliminated: false,
  joinedAt: '2025-01-15T10:00:00Z'
}
```

### CSV Import Format

```csv
format,category,question,option_a,option_b,option_c,option_d,correct_answer,points,time_limit
jeopardy,History,Who was the first President?,Washington,Adams,Jefferson,Franklin,0,200,30
millionaire,Geography,Capital of France?,London,Berlin,Paris,Madrid,2,100,45
```

### JSON Import Format

```json
{
  "questions": [
    {
      "format": "jeopardy",
      "category": "History",
      "question": "Who was the first President?",
      "options": ["Washington", "Adams", "Jefferson", "Franklin"],
      "correctAnswer": 0,
      "points": 200,
      "timeLimit": 30
    }
  ]
}
```

### Component Architecture

**State Management:**
- React useState hooks (no Redux)
- Local storage for player info
- Mock data from centralized file

**Styling:**
- Tailwind CSS utility classes
- Shadcn UI components
- Custom animations via CSS
- Responsive breakpoints

**Key Dependencies:**
```json
{
  "react": "^19.0.0",
  "react-router-dom": "^7.5.1",
  "axios": "^1.8.4",
  "tailwindcss": "^3.4.17",
  "@radix-ui/*": "latest"
}
```

---

## What's Remaining

### Phase C: Backend Implementation (2-3 weeks)

**Priority 1: Core Backend**
- [ ] FastAPI server setup
- [ ] MongoDB connection
- [ ] Database models (Game, Question, Player)
- [ ] REST API endpoints (20+ endpoints)
- [ ] Authentication system (game codes)
- [ ] Error handling & logging

**Priority 2: Real-Time WebSocket**
- [ ] WebSocket connection management
- [ ] Room-based communication (per game)
- [ ] Player join/leave events
- [ ] Question broadcast
- [ ] Answer submission handling
- [ ] Score updates
- [ ] Leaderboard updates
- [ ] Director control events
- [ ] Reconnection handling

**Priority 3: Game State Management**
- [ ] Game lifecycle (create → active → finished)
- [ ] Question flow control
- [ ] Timer synchronization across all clients
- [ ] Answer validation
- [ ] Score calculation
- [ ] Leaderboard ranking
- [ ] Auto-save game state

**Priority 4: Integration**
- [ ] Connect Director Panel to backend
- [ ] Connect TV Display to WebSocket
- [ ] Connect Player interfaces to WebSocket
- [ ] Remove mock data, use real data
- [ ] Sync all three screens in real-time

### Additional Features (Nice to Have)

**Game Enhancements:**
- [ ] Daily Double in Jeopardy
- [ ] Lifelines in Millionaire (50:50, Ask Audience, Phone Friend)
- [ ] X Strikes in Family Feud with visual display
- [ ] Buzzer race for Fastest Finger
- [ ] Team mode (players grouped in teams)
- [ ] Wager questions
- [ ] Bonus rounds

**Media Integration:**
- [ ] Video intro playback before game
- [ ] Format intro videos (Jeopardy, Millionaire, etc.)
- [ ] Transition videos between questions
- [ ] Background music during lobby
- [ ] Sound effects (correct, wrong, buzzer)
- [ ] Victory celebration video

**TV Display Formats:**
- [ ] Millionaire money ladder display
- [ ] Family Feud survey board with flip animations
- [ ] Bingo card display
- [ ] Mini-game displays (Rock Paper Scissors, etc.)
- [ ] Response charts (% who picked each option)

**Analytics & Reporting:**
- [ ] Post-game reports
- [ ] Player performance over time
- [ ] Question difficulty analysis
- [ ] Popular/unpopular questions
- [ ] Export to Excel/PDF
- [ ] Venue statistics

**Admin Features:**
- [ ] Multi-venue management
- [ ] User accounts with roles (admin, host, player)
- [ ] Scheduled games
- [ ] Recurring game templates
- [ ] Bulk operations (duplicate game, merge question sets)
- [ ] Backup and restore

**Player Features:**
- [ ] Player profiles with history
- [ ] Achievements/badges
- [ ] All-time leaderboard
- [ ] Friend lists
- [ ] Social sharing of scores
- [ ] Avatar selection

**Hardware Integration:**
- [ ] Physical buzzer support (USB/Bluetooth)
- [ ] LED lighting control (DMX)
- [ ] Wireless scoreboard display
- [ ] Multi-display support

**Advanced:**
- [ ] Streaming integration (OBS, YouTube)
- [ ] Hybrid mode (onsite + remote players)
- [ ] AI question generator
- [ ] Voice commands for host
- [ ] Mobile app (iOS/Android native)

---

## Setup & Deployment

### Current Setup (Development)

**Frontend:**
```bash
cd /app/frontend
yarn install
yarn start  # Runs on port 3000
```

**Backend (Not Yet Built):**
```bash
cd /app/backend
pip install -r requirements.txt
python server.py  # Will run on port 8001
```

**Supervisor (Process Manager):**
```bash
sudo supervisorctl status      # Check status
sudo supervisorctl restart all # Restart services
```

### Environment Variables

**Frontend (.env):**
```
REACT_APP_BACKEND_URL=https://your-domain.com
```

**Backend (.env):**
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=trivia_game
JWT_SECRET=your-secret-key
CORS_ORIGINS=https://your-domain.com
```

### Production Deployment

**Requirements:**
- Domain name
- SSL certificate (for HTTPS)
- Server with:
  - 2+ CPU cores
  - 4 GB RAM
  - 20 GB storage
- MongoDB instance
- CDN for media files (optional)

**Deployment Steps:**
1. Build frontend: `yarn build`
2. Configure nginx
3. Setup MongoDB
4. Deploy backend
5. Configure supervisor
6. Setup SSL
7. Test all routes

### Browser Support

**Required:**
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

**Mobile:**
- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 14+

---

## Troubleshooting

### Common Issues

**Issue: TV Display not loading**
- Check URL has correct game code
- Verify frontend is running
- Check browser console for errors

**Issue: Players can't join**
- Verify game code is correct (case-sensitive)
- Check if game status is "waiting" or "active"
- Ensure phone has internet connection

**Issue: Director controls not working**
- Refresh page
- Check if game is in correct state
- Verify game code in URL

**Issue: Media won't upload**
- Check file size (Image: 10MB, Video: 50MB, Audio: 20MB)
- Verify file format (PNG, JPG, MP4, MP3, etc.)
- Check file isn't corrupted

### Performance Tips

**For Host:**
- Close unused browser tabs
- Use wired internet if possible
- Test before event with dummy players

**For TV Display:**
- Use Chrome or Edge (best performance)
- Full screen mode (F11)
- Disable screen saver
- Check HDMI connection

**For Players:**
- Good WiFi signal required
- Keep only game tab open
- Airplane mode OFF

---

## Support & Contact

**Documentation Files:**
- `/app/COMPLETE_DOCUMENTATION.md` (this file)
- `/app/contracts.md` - API contracts for backend
- `/app/VIDEO_SPECS.md` - Video requirements
- `/app/MEDIA_FORMAT_GUIDE.md` - Dzine/Higgsfield specs
- `/app/QUIZXPRESS_ANALYSIS.md` - Feature comparison

**System URLs:**
- Player Join: `/`
- TV Display: `/tv/:gameCode`
- Director: `/director/:gameCode`
- Host Dashboard: `/host`

**For Technical Support:**
Contact system administrator or development team.

---

## Version History

**v1.0 MVP (Current):**
- Player Join interface ✅
- TV Display with Jeopardy format ✅
- Player Game interface (all formats) ✅
- Director Control Panel ✅
- Host Dashboard ✅
- Bulk Import (CSV/JSON) ✅
- 8 Game Pack Library ✅
- Media Library ✅
- White-label branding ✅
- Mock data system ✅

**v2.0 (Planned - Phase C):**
- Backend API
- WebSocket real-time
- Database integration
- Remove mock data
- Full game flow

**v3.0 (Future):**
- Additional game formats
- Video/audio integration
- Advanced analytics
- Multi-venue support

---

**End of Documentation**

For latest updates, check the GitHub repository or contact the development team.
