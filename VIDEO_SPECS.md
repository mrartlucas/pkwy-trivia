# Video Specifications for PKWY Tavern Trivia Game System

## Overview
This document outlines the video requirements, specifications, and integration points for the white-label trivia game system.

## Video Types Needed

### 1. Venue Intro Video (Optional)
**Purpose:** Plays when game starts, introducing the venue
**Specifications:**
- **Duration:** 10-15 seconds
- **Resolution:** 1920x1080 (Full HD)
- **Format:** MP4 (H.264 codec)
- **Aspect Ratio:** 16:9
- **Frame Rate:** 30fps or 60fps
- **File Size:** Max 50MB
- **Audio:** Stereo, 48kHz

**Content:**
- PKWY Tavern logo animation
- Venue tagline
- Energetic music
- "Welcome to Trivia Night!" messaging

**Integration Point:** 
- Plays on TV display after lobby countdown
- Can be uploaded in Host Dashboard > Branding Settings

---

### 2. Game Format Intro Videos
**Purpose:** Brief intro when switching between game show formats

#### Jeopardy-Style Intro
**Specifications:**
- **Duration:** 5-8 seconds
- **Resolution:** 1920x1080
- **Format:** MP4 (H.264)
- **Style:** Blue/gold theme, iconic "thinking" music feel
- **Content:** "Knowledge Challenge" title card

#### Millionaire-Style Intro
**Specifications:**
- **Duration:** 5-8 seconds
- **Resolution:** 1920x1080
- **Format:** MP4 (H.264)
- **Style:** Purple/orange dramatic theme
- **Content:** "Million Dollar Question" title card

#### Family Feud-Style Intro
**Specifications:**
- **Duration:** 5-8 seconds
- **Resolution:** 1920x1080
- **Format:** MP4 (H.264)
- **Style:** Red/yellow energetic theme
- **Content:** "Survey Says!" title card

**Integration Point:**
- Plays automatically when game format changes
- Upload in Host Dashboard > Game Formats > Edit Format

---

### 3. Transition Animations
**Purpose:** Smooth transitions between questions, rounds, and leaderboards

**Specifications:**
- **Duration:** 2-3 seconds
- **Resolution:** 1920x1080
- **Format:** MP4 with alpha channel (WebM recommended) or MP4
- **Types Needed:**
  - Question transition (fade/wipe effect)
  - Leaderboard reveal
  - Correct answer reveal
  - Round change

**Style:**
- Should match each game format's theme
- Can overlay PKWY logo watermark
- Smooth, professional animations

**Integration Point:**
- Loaded as CSS animations or video overlays
- Configured in branding settings

---

### 4. Background Loop Videos (Optional)
**Purpose:** Ambient background for lobby and waiting screens

**Specifications:**
- **Duration:** 30-60 seconds (seamless loop)
- **Resolution:** 1920x1080
- **Format:** MP4 (H.264)
- **Style:** Subtle, non-distracting
- **Options:**
  - Venue interior shots
  - Abstract patterns matching venue colors
  - Crowd ambiance
  - Animated logo patterns

**Integration Point:**
- Set as background in TV lobby screen
- Configurable per venue in branding settings

---

### 5. Winner Celebration Video
**Purpose:** Plays when displaying final winner

**Specifications:**
- **Duration:** 10-15 seconds
- **Resolution:** 1920x1080
- **Format:** MP4 (H.264)
- **Content:**
  - Confetti/celebration animations
  - "Congratulations!" text
  - Triumphant music
  - PKWY branding overlay

**Integration Point:**
- Plays before final leaderboard display
- Configurable in Host Dashboard

---

### 6. Countdown Timer Animations
**Purpose:** Visual countdown for questions

**Specifications:**
- **Duration:** 5-60 seconds (variable)
- **Format:** Animated SVG or MP4
- **Types:**
  - Standard countdown (30s)
  - Fast countdown (15s)
  - Extended countdown (60s)
- **Style:** Should be visible but not distracting
- **Elements:**
  - Circular progress bar
  - Digital numbers
  - Color change (green → yellow → red)

**Integration Point:**
- Embedded in question display component
- Can be themed per game format

---

## Video Upload & Management

### Host Dashboard Integration
**Location:** Host Dashboard > Media Library

**Features:**
- Drag-and-drop video upload
- Preview before publishing
- Assign videos to:
  - Venue branding
  - Specific game formats
  - Question categories
  - Event types
- Video compression/optimization on upload
- Storage: Max 500MB total per venue

### Video Validation
**Automatic Checks:**
- File format compatibility
- Resolution verification
- Duration limits
- File size limits
- Audio track verification

---

## Technical Integration

### Video Playback
**Frontend Implementation:**
```jsx
<video 
  autoPlay 
  muted 
  playsInline
  onEnded={handleVideoEnd}
  className="absolute inset-0 w-full h-full object-cover"
>
  <source src={videoUrl} type="video/mp4" />
</video>
```

### Video Triggers
- Lobby countdown complete → Venue intro
- Format change → Format intro video
- Question reveal → Transition animation
- Correct answer → Reveal animation
- Final scores → Winner celebration

### Caching Strategy
- Videos cached in browser for performance
- CDN delivery for fast loading
- Preload next video during current display
- Fallback to static images if video fails

---

## Production Guidelines

### Video Creation Tips
1. **Consistency:** All videos should share similar quality and style
2. **Branding:** Include PKWY logo subtly in corner or as watermark
3. **Audio:** Keep music volume moderate (not overwhelming)
4. **Text:** Use large, readable fonts (minimum 48pt)
5. **Motion:** Avoid rapid flashing or jarring movements
6. **Colors:** Match PKWY green color scheme where appropriate

### Recommended Tools
- **Editing:** Adobe Premiere Pro, Final Cut Pro, DaVinci Resolve
- **Animation:** Adobe After Effects, Blender, Apple Motion
- **Compression:** HandBrake (H.264, target bitrate: 5-10 Mbps)

### Stock Resources
If creating from scratch:
- **Video:** Pexels, Pixabay (free stock footage)
- **Music:** Epidemic Sound, AudioJungle (royalty-free)
- **Effects:** Motion Array, Envato Elements

---

## API Endpoints (Backend)

### Video Upload
```
POST /api/media/upload
Content-Type: multipart/form-data

Request:
{
  "file": <video file>,
  "type": "venue_intro" | "format_intro" | "transition" | "background",
  "game_format": "jeopardy" | "millionaire" | "family_feud" (optional),
  "name": "PKWY Intro Video"
}

Response:
{
  "id": "video_id",
  "url": "https://cdn.../videos/pkwy-intro.mp4",
  "thumbnail": "https://cdn.../thumbnails/pkwy-intro.jpg",
  "duration": 12.5,
  "size": 15728640
}
```

### Get Venue Videos
```
GET /api/media/videos?venue_id={venue_id}

Response:
[
  {
    "id": "video_id",
    "name": "PKWY Intro Video",
    "type": "venue_intro",
    "url": "...",
    "duration": 12.5
  }
]
```

---

## Future Enhancements

### Phase 2 Features
- **Live Streaming:** Integrate with OBS for live video hosting
- **Green Screen:** Allow hosts to appear in video overlays
- **Custom Avatars:** Animated character hosts
- **Player Cameras:** Show player reactions in picture-in-picture
- **Replay System:** Record and replay highlight moments

### Phase 3 Features
- **AI Video Generation:** Auto-generate intros from venue photos
- **Interactive Video:** Player choices affect video playback
- **Multi-Camera:** Switch between camera angles
- **AR Effects:** Augmented reality overlays

---

## Priority for MVP

**Essential (Build First):**
- ✅ Static image backgrounds (already implemented)
- Format transition animations (CSS-based)
- Simple countdown timers

**Nice to Have:**
- Venue intro video
- Format intro videos
- Winner celebration video

**Future:**
- Live streaming integration
- Advanced effects and transitions

---

## Notes
- All videos should be optimized for performance
- Mobile devices may have limitations on autoplay
- Consider bandwidth for bar WiFi networks
- Provide low-bandwidth fallback options
- Test on actual TV displays for quality assurance
