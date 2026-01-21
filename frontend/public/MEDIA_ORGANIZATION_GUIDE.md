# Media Organization & Usage Guide
## How to Label Graphics, Videos, Transitions, and Sounds

---

## 🎨 Media Types & Their Uses

### 1. Venue Branding
**Purpose:** Appears on all screens (logo, colors, theme)

**Files Needed:**
```
PKWY_Logo.png                    → Main venue logo (transparent)
PKWY_Logo_White.png              → White version (for dark backgrounds)
PKWY_Logo_Horizontal.png         → Wide format for headers
PKWY_Favicon.ico                 → Browser tab icon
```

**Usage Tag:** `venue_branding`  
**Display:** All screens (TV, Mobile, Director)

---

### 2. Venue Intro Videos
**Purpose:** Plays when TV display opens, before game starts

**Files Needed:**
```
PKWY_Welcome_Intro.mp4           → 10-15 second welcome video
PKWY_Trivia_Night_Intro.mp4      → "Trivia Night" branded intro
```

**Usage Tag:** `venue_intro`  
**Display:** TV Display (lobby screen)  
**Specs:** 1920x1080, 10-15s, MP4

---

### 3. Game Format Intros
**Purpose:** Brief animation when switching between Jeopardy, Millionaire, etc.

**Files Needed:**
```
Jeopardy_Intro.mp4               → Blue board reveal, 5-8s
Millionaire_Intro.mp4            → Purple/gold dramatic, 5-8s
Family_Feud_Intro.mp4            → Red/orange energetic, 5-8s
Majority_Rules_Intro.mp4         → Green crowd theme, 5-8s
Last_Man_Standing_Intro.mp4      → Dark elimination theme, 5-8s
```

**Usage Tag:** `format_intro_{format_name}`  
**Display:** TV Display (before first question of that format)  
**Specs:** 1920x1080, 5-8s, MP4

---

### 4. Background Images
**Purpose:** Behind questions on TV display

**Files Needed:**
```
Jeopardy_Background.jpg          → Blue gradient/board texture
Millionaire_Background.jpg       → Purple/indigo gradient
Family_Feud_Background.jpg       → Red/orange/yellow gradient
Majority_Rules_Background.jpg    → Green/teal gradient
Last_Man_Standing_Background.jpg → Dark/dramatic
Generic_Background.jpg           → Fallback for any format
```

**Usage Tag:** `background_{format_name}`  
**Display:** TV Display (behind question text)  
**Specs:** 1920x1080, JPG, < 2MB

---

### 5. Transition Videos
**Purpose:** Smooth transitions between questions, rounds, or screens

**Files Needed:**
```
Wipe_Left.mp4                    → Screen wipes left
Wipe_Right.mp4                   → Screen wipes right
Fade_Black.mp4                   → Fade to black
Spin_Logo.mp4                    → PKWY logo spins in
Burst_Effect.mp4                 → Energy burst
Question_Reveal.mp4              → Question slides in
```

**Usage Tag:** `transition_{type}`  
**Display:** TV Display (between content)  
**Specs:** 1920x1080, 2-3s, MP4 or WebM with alpha

---

### 6. Winner Celebration
**Purpose:** Plays when showing final winner

**Files Needed:**
```
Winner_Celebration.mp4           → Confetti, trophy, 10-15s
Winner_Fanfare.mp4               → Victory animation
PKWY_Champion.mp4                → Branded winner video
```

**Usage Tag:** `winner_celebration`  
**Display:** TV Display (final results screen)  
**Specs:** 1920x1080, 10-15s, MP4 with audio

---

### 7. Sound Effects
**Purpose:** Audio feedback for player actions

**Files Needed:**
```
Correct_Answer.mp3               → Positive chime (1-2s)
Wrong_Answer.mp3                 → Buzzer or sad sound (1-2s)
Buzzer_Press.mp3                 → Click/beep (0.5s)
Timer_Tick.mp3                   → Countdown tick (0.5s)
Timer_Warning.mp3                → Last 5 seconds alert (0.5s)
Game_Start.mp3                   → Upbeat start sound (2-3s)
Game_End.mp3                     → Victory fanfare (3-5s)
Leaderboard_Reveal.mp3           → Drum roll or swoosh (2s)
```

**Usage Tag:** `sound_effect_{action}`  
**Trigger:** Player actions, game events  
**Specs:** MP3, 128 kbps, < 1 MB each

---

### 8. Background Music
**Purpose:** Ambient music during lobby, gameplay

**Files Needed:**
```
Lobby_Music.mp3                  → Upbeat waiting music (30-60s loop)
Gameplay_Music.mp3               → Thinking music (30-60s loop)
Victory_Music.mp3                → Celebration music (30-60s)
```

**Usage Tag:** `background_music_{context}`  
**Display:** TV Display (looping)  
**Specs:** MP3, 192 kbps, seamless loop

---

### 9. Category Icons (Optional)
**Purpose:** Visual icons for question categories

**Files Needed:**
```
Category_History.png             → History icon
Category_Science.png             → Science icon
Category_Sports.png              → Sports icon
Category_Movies.png              → Movies icon
Category_Music.png               → Music icon
Category_Food.png                → Food icon
Category_Geography.png           → Geography icon
```

**Usage Tag:** `category_icon_{name}`  
**Display:** TV Display (Jeopardy board)  
**Specs:** PNG, 200x200, transparent

---

## 📋 Naming Convention

### Standard Format:
```
{VenueName}_{MediaType}_{Context}_{Version}.{extension}

Examples:
PKWY_Logo_Primary_v1.png
PKWY_Intro_Welcome_v2.mp4
PKWY_Sound_Correct_v1.mp3
PKWY_Background_Jeopardy_v1.jpg
```

### File Naming Rules:
1. **No spaces** - Use underscores: `Correct_Answer.mp3` ✓ not `Correct Answer.mp3` ✗
2. **Descriptive names** - Clear purpose: `Jeopardy_Blue_Background.jpg` ✓
3. **Version numbers** - For updates: `_v1`, `_v2`, `_v3`
4. **Lowercase extensions** - `.mp4` ✓ not `.MP4` ✗

---

## 🏷️ Media Tagging System

When you upload a file to Media Library, you'll assign **tags** to tell the system how to use it:

### Tag Categories:

#### **1. Usage Type** (Primary Tag - Required)
- `venue_branding` - Logo, brand colors
- `venue_intro` - Welcome video
- `format_intro` - Game format intros
- `background` - Question backgrounds
- `transition` - Between screens
- `winner` - Celebration videos
- `sound_effect` - Audio feedback
- `background_music` - Ambient music
- `category_icon` - Category graphics

#### **2. Format Association** (Secondary Tag - Optional)
- `jeopardy` - For Jeopardy-style games
- `millionaire` - For Millionaire-style
- `family_feud` - For Family Feud-style
- `majority_rules` - For Majority Rules
- `last_man_standing` - For Last Man Standing
- `all_formats` - Used across all formats

#### **3. Trigger Event** (For Sound/Transitions - Optional)
- `game_start` - When game begins
- `question_start` - New question appears
- `answer_correct` - Player answers correctly
- `answer_incorrect` - Wrong answer
- `buzzer_press` - Buzzer activated
- `time_warning` - 5 seconds left
- `time_up` - Time expired
- `leaderboard_show` - Leaderboard displays
- `game_end` - Game finishes

---

## 🎯 Media Assignment Examples

### Example 1: Upload Jeopardy Background
```
File: Jeopardy_Blue_Background.jpg
Primary Tag: background
Secondary Tag: jeopardy
Description: Blue gradient background for Jeopardy questions
```

**System knows:** Use this image as background whenever Jeopardy format questions appear on TV.

---

### Example 2: Upload Correct Answer Sound
```
File: Correct_Answer_Chime.mp3
Primary Tag: sound_effect
Trigger: answer_correct
Description: Positive chime when player answers correctly
```

**System knows:** Play this sound whenever any player answers correctly.

---

### Example 3: Upload Venue Intro
```
File: PKWY_Welcome_Intro.mp4
Primary Tag: venue_intro
Description: PKWY Tavern welcome video with logo
```

**System knows:** Play this video when TV Display opens, before game starts.

---

### Example 4: Upload Format Intro
```
File: Millionaire_Intro_Animation.mp4
Primary Tag: format_intro
Secondary Tag: millionaire
Description: Purple dramatic intro for Millionaire questions
```

**System knows:** Play before first Millionaire question in a game.

---

## 🔧 How the System Uses Media

### TV Display Flow:
```
1. Lobby Screen
   → Show: venue_branding (logo)
   → Play: venue_intro (video)
   → Music: background_music (lobby)

2. Game Starts
   → Sound: sound_effect (game_start)

3. First Jeopardy Question
   → Play: format_intro (jeopardy) [first time only]
   → Show: background (jeopardy)
   → Display question text

4. Player Answers
   → Sound: sound_effect (answer_correct or answer_incorrect)

5. Next Question (Different Format)
   → Play: transition (between questions)
   → Play: format_intro (millionaire) [if first millionaire]
   → Show: background (millionaire)

6. Show Leaderboard
   → Sound: sound_effect (leaderboard_show)
   → Play: transition (optional)

7. Game Ends
   → Play: winner (celebration video)
   → Sound: sound_effect (game_end)
   → Show: venue_branding (logo on results)
```

### Player Mobile Flow:
```
1. Join Screen
   → Show: venue_branding (logo)

2. Answer Question
   → Sound: sound_effect (answer_correct or answer_incorrect)
   → Vibration feedback

3. Buzzer Press
   → Sound: sound_effect (buzzer_press)
   → Visual animation
```

---

## 📊 Media Assignment Interface

### In Media Library Tab:

When you upload a file, you'll see:

```
┌─────────────────────────────────────┐
│ Upload Complete: Jeopardy_Intro.mp4 │
├─────────────────────────────────────┤
│ Primary Usage:                       │
│ ○ Venue Branding                    │
│ ○ Venue Intro                       │
│ ● Format Intro          [Selected]  │
│ ○ Background                        │
│ ○ Transition                        │
│ ○ Winner Celebration                │
│ ○ Sound Effect                      │
│ ○ Background Music                  │
├─────────────────────────────────────┤
│ Assign to Format:                   │
│ ☑ Jeopardy           [Selected]     │
│ ☐ Millionaire                       │
│ ☐ Family Feud                       │
│ ☐ All Formats                       │
├─────────────────────────────────────┤
│ Trigger Event (if applicable):      │
│ [Dropdown: Select trigger...]       │
│   - Game Start                      │
│   - Question Start                  │
│   - Answer Correct                  │
│   - Answer Incorrect                │
│   ...                               │
├─────────────────────────────────────┤
│ Description (optional):              │
│ [Blue board reveal animation...]    │
├─────────────────────────────────────┤
│         [Cancel]  [Save Media]      │
└─────────────────────────────────────┘
```

---

## 🗂️ Recommended Folder Structure (Your Computer)

Before uploading, organize files locally:

```
PKWY_Trivia_Media/
├── Branding/
│   ├── PKWY_Logo.png
│   ├── PKWY_Logo_White.png
│   └── PKWY_Logo_Horizontal.png
│
├── Intros/
│   ├── PKWY_Welcome_Intro.mp4
│   ├── Jeopardy_Intro.mp4
│   ├── Millionaire_Intro.mp4
│   ├── Family_Feud_Intro.mp4
│   └── ...
│
├── Backgrounds/
│   ├── Jeopardy_Background.jpg
│   ├── Millionaire_Background.jpg
│   └── ...
│
├── Transitions/
│   ├── Wipe_Left.mp4
│   ├── Wipe_Right.mp4
│   └── ...
│
├── Celebrations/
│   ├── Winner_Celebration.mp4
│   └── PKWY_Champion.mp4
│
├── Sounds/
│   ├── Effects/
│   │   ├── Correct_Answer.mp3
│   │   ├── Wrong_Answer.mp3
│   │   ├── Buzzer_Press.mp3
│   │   └── ...
│   └── Music/
│       ├── Lobby_Music.mp3
│       ├── Gameplay_Music.mp3
│       └── Victory_Music.mp3
│
└── Icons/
    ├── Category_History.png
    ├── Category_Science.png
    └── ...
```

---

## ✅ Priority Upload List (Start Here)

### Phase 1: Essential (Must Have)
1. **PKWY_Logo.png** → venue_branding
2. **Correct_Answer.mp3** → sound_effect (answer_correct)
3. **Wrong_Answer.mp3** → sound_effect (answer_incorrect)
4. **Jeopardy_Background.jpg** → background (jeopardy)

### Phase 2: Enhanced Experience
5. **PKWY_Welcome_Intro.mp4** → venue_intro
6. **Jeopardy_Intro.mp4** → format_intro (jeopardy)
7. **Buzzer_Press.mp3** → sound_effect (buzzer_press)
8. **Winner_Celebration.mp4** → winner

### Phase 3: Full Polish
9. All other format backgrounds
10. All format intros
11. Transition videos
12. Background music
13. Category icons

---

## 🔍 Testing Media Assignments

After uploading and tagging:

1. **Go to Director Panel**
2. **Click "Preview Media"** (planned feature)
3. **Select a format** (Jeopardy, Millionaire, etc.)
4. **System shows:**
   - Which background will display
   - Which intro will play
   - Which sounds are assigned
   - Any missing media

**Or test in live game:**
1. Start a game in Director
2. Open TV Display
3. Watch as each media plays
4. Verify correct assets for each format

---

## 🚨 Common Mistakes to Avoid

❌ **Don't:** Upload files without tags → System won't know when to use them  
✓ **Do:** Always assign Primary Usage tag

❌ **Don't:** Use generic names like "video1.mp4"  
✓ **Do:** Use descriptive names like "Jeopardy_Intro_v1.mp4"

❌ **Don't:** Upload one background for all formats  
✓ **Do:** Upload format-specific backgrounds (different colors/themes)

❌ **Don't:** Forget file size limits  
✓ **Do:** Optimize before upload (Images: <2MB, Videos: <50MB)

❌ **Don't:** Mix formats (wrong aspect ratio, resolution)  
✓ **Do:** Follow specs in MEDIA_FORMAT_GUIDE.md

---

## 📞 Need Help?

**Can't figure out what tag to use?**
- Check the "Usage Type" list above
- Look at the file purpose
- When in doubt, use description field to note intended use

**Not sure which files you need?**
- Start with Phase 1 (Essential) list
- Test the game
- Add more media as you see what's missing

**Media not playing?**
- Check file format matches specs
- Verify tags are correct
- Check file isn't corrupted
- Review Media Library assignment

---

**Next Step:** Update the Media Library component to include tagging interface!
