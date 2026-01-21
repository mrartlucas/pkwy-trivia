# Media Format Specifications for PKWY Trivia System
## Optimized for Dzine & Higgsfield AI Outputs

---

## 🎨 Image Formats (Dzine Output)

### Supported Formats
| Format | Use Case | Max Size | Notes |
|--------|----------|----------|-------|
| **PNG** | Logos, overlays, UI elements | 10 MB | Supports transparency, best for graphics with text |
| **JPG/JPEG** | Backgrounds, photos | 10 MB | No transparency, smaller file sizes |
| **WebP** | Optimized web graphics | 10 MB | Best compression, modern browsers only |
| **SVG** | Vector logos, icons | 1 MB | Scales perfectly, smallest file size |

### Recommended Specifications

#### Venue Logo
- **Format:** PNG with transparency
- **Dimensions:** 500x500px (square) or 800x200px (horizontal)
- **Resolution:** 72-150 DPI
- **File Size:** < 2 MB
- **Background:** Transparent
- **Export from Dzine:** PNG-24 with alpha channel

#### Game Show Backgrounds
- **Format:** JPG or WebP
- **Dimensions:** 1920x1080px (Full HD)
- **Aspect Ratio:** 16:9
- **Resolution:** 72 DPI (web optimized)
- **File Size:** 500 KB - 3 MB
- **Color Space:** RGB (not CMYK)
- **Export from Dzine:** JPG at 80-90% quality

#### Question Images (In-Game)
- **Format:** JPG, PNG, or WebP
- **Dimensions:** 1280x720px or 1920x1080px
- **File Size:** < 5 MB
- **Use:** Displayed within question cards
- **Export from Dzine:** Optimize for web

#### Category Icons/Badges
- **Format:** PNG or SVG
- **Dimensions:** 200x200px
- **File Size:** < 500 KB
- **Background:** Transparent
- **Style:** Flat design works best

---

## 🎬 Video Formats (Higgsfield AI Output)

### Supported Formats
| Format | Codec | Use Case | Browser Support |
|--------|-------|----------|-----------------|
| **MP4** | H.264 | Primary format | All browsers ✅ |
| **WebM** | VP9 | Web optimization | Most modern browsers |
| **MOV** | H.264 | Upload only | Converted to MP4 |

### Recommended Specifications

#### Venue Intro Video
```
Format: MP4 (H.264)
Resolution: 1920x1080 (Full HD)
Frame Rate: 30 fps (60 fps acceptable)
Duration: 10-15 seconds
Bitrate: 5-10 Mbps
Audio: AAC, 128-192 kbps, Stereo
File Size: < 50 MB
Aspect Ratio: 16:9
```

**Export from Higgsfield AI:**
- Select "High Quality MP4"
- H.264 codec
- 1080p resolution
- 30 fps

#### Game Format Intro Videos
```
Format: MP4 (H.264)
Resolution: 1920x1080
Frame Rate: 30 fps
Duration: 5-8 seconds
Bitrate: 3-8 Mbps
Audio: Optional (or 128 kbps AAC)
File Size: < 30 MB
```

**Content Examples:**
- Jeopardy: Blue animated board reveal
- Millionaire: Money ladder animation
- Family Feud: Survey board flip

#### Transition Videos
```
Format: MP4 (H.264) or WebM (VP9)
Resolution: 1920x1080
Frame Rate: 30 fps
Duration: 2-3 seconds
Bitrate: 2-5 Mbps
Audio: Optional
File Size: < 20 MB
Alpha Channel: Preferred (WebM supports this)
```

**Types:**
- Wipe left/right
- Fade to black
- Spinning logo
- Burst effect

#### Winner Celebration Video
```
Format: MP4 (H.264)
Resolution: 1920x1080
Frame Rate: 30 fps
Duration: 10-15 seconds
Bitrate: 5-10 Mbps
Audio: Upbeat music, 128-192 kbps
File Size: < 50 MB
```

**Content:**
- Confetti animation
- Trophy reveal
- Fireworks
- PKWY logo celebration

#### Background Loop Videos (Optional)
```
Format: MP4 (H.264)
Resolution: 1920x1080
Frame Rate: 24-30 fps
Duration: 30-60 seconds (seamless loop)
Bitrate: 3-5 Mbps
Audio: None (or ambient at 64 kbps)
File Size: < 80 MB
Loop: Must be seamless (first frame = last frame)
```

---

## 🎵 Audio Formats

### Supported Formats
| Format | Use Case | Max Size |
|--------|----------|----------|
| **MP3** | Music, sound effects | 20 MB |
| **WAV** | High-quality audio | 20 MB |
| **OGG** | Web-optimized audio | 20 MB |

### Recommended Specifications

#### Background Music
```
Format: MP3
Bitrate: 128-192 kbps
Sample Rate: 44.1 kHz
Channels: Stereo
Duration: 30-180 seconds
File Size: < 10 MB
```

#### Sound Effects
```
Format: MP3 or OGG
Bitrate: 128 kbps
Sample Rate: 44.1 kHz
Duration: 0.5-3 seconds
File Size: < 1 MB
```

**Types Needed:**
- Correct answer chime
- Wrong answer buzz
- Buzzer press sound
- Countdown tick
- Winner fanfare

---

## 📐 Technical Requirements by Use Case

### 1. TV Display (Main Screen)
**Resolution:** 1920x1080 (Full HD)
**Aspect Ratio:** 16:9
**Why:** Most bar TVs are 1080p, this ensures perfect quality

### 2. Mobile Player Interface
**Resolution:** 375x667 to 428x926 (responsive)
**Aspect Ratio:** Various (handles all phone sizes)
**File Size:** Keep images < 2 MB for mobile data

### 3. Tablet (Director Panel)
**Resolution:** 1024x768 to 1366x1024
**Aspect Ratio:** 4:3 or 16:10
**Optimization:** Balance between quality and loading speed

---

## 🚀 Optimization Tips for Dzine

### For Logos & Graphics
1. **Create at 2x size** (e.g., 1000x1000 for 500x500 display)
2. **Export PNG-24** with transparency
3. **Use TinyPNG** or similar to compress (optional)
4. **Test on dark and light backgrounds**

### For Backgrounds
1. **Design at 1920x1080**
2. **Keep text-heavy areas clear** (where questions appear)
3. **Use vibrant but not distracting** colors
4. **Export as JPG 80-85% quality**
5. **Test with actual question text overlay**

### For Icons
1. **Keep it simple** - TV viewers see from distance
2. **High contrast** - Easy to see in bar lighting
3. **Consistent style** across all icons
4. **Export as SVG** for scalability

---

## 🎬 Optimization Tips for Higgsfield AI

### For Videos
1. **Keep it short** - 5-15 seconds max
2. **Start strong** - Grab attention immediately
3. **End cleanly** - Clear finish point
4. **Audio levels** - -6dB to -3dB (not too loud)
5. **Test on TV** before live use

### Rendering Settings (Higgsfield AI)
```
Quality: High or Maximum
Format: MP4 (H.264)
Resolution: 1920x1080
Frame Rate: 30 fps
Bitrate: Auto or 8 Mbps
Audio: AAC 192 kbps
```

### After Export
1. **Trim exact timing** in video editor if needed
2. **Add fade in/out** (0.5 seconds) for smooth transitions
3. **Normalize audio levels**
4. **Test playback** on actual hardware

---

## 🔄 Workflow Integration

### Step 1: Create in Dzine/Higgsfield
- Design according to specs above
- Export in recommended formats
- Keep original project files

### Step 2: Upload to System
- Go to Host Dashboard → Media Library tab
- Drag and drop files
- System validates format and size
- Assigns usage type

### Step 3: Assign to Games
- Select media from library
- Assign to:
  - Venue branding (logo)
  - Game intro
  - Question backgrounds
  - Transitions
  - Winner celebration

### Step 4: Test
- Preview in Director panel
- Check on actual TV display
- Test with players on mobile
- Adjust if needed

---

## ⚠️ Common Issues & Solutions

### Issue: Video Won't Play
**Solutions:**
- Ensure H.264 codec (not H.265)
- Use MP4 container
- Check bitrate isn't too high (< 10 Mbps)
- Verify 30 fps (not variable)

### Issue: Image Looks Pixelated
**Solutions:**
- Upload at least 1920x1080
- Don't upscale small images
- Use PNG for graphics with text
- Check source file quality

### Issue: File Too Large
**Solutions:**
- Compress videos to 5-8 Mbps bitrate
- Use JPG instead of PNG for photos
- Reduce video duration
- Use WebP format for images

### Issue: Transparency Not Working
**Solutions:**
- Ensure PNG-24 format
- Check alpha channel is included
- Don't use JPG (doesn't support transparency)
- Re-export from Dzine with transparency

---

## 📊 Storage Limits

**Per Venue:**
- Total Storage: 500 MB
- Single Image: 10 MB max
- Single Video: 50 MB max
- Single Audio: 20 MB max

**Recommended Distribution:**
- 5-10 images: ~30 MB
- 3-5 videos: ~150 MB
- 10-20 audio files: ~50 MB
- Room for growth: ~270 MB

---

## 🎯 Quick Reference Card

### Must-Have Assets for PKWY Tavern

1. **Venue Logo** - PNG, 500x500, transparent
2. **Venue Intro Video** - MP4, 1080p, 10s, with music
3. **Game Backgrounds** (5 types):
   - Jeopardy blue board
   - Millionaire purple gradient
   - Family Feud red/orange
   - Majority Rules green
   - Last Man Standing dark

4. **Sound Effects**:
   - Correct answer (1s)
   - Wrong answer (1s)
   - Buzzer press (0.5s)
   - Winner celebration (3s)

5. **Transition** - MP4, 1080p, 2-3s, seamless

---

## 💡 Pro Tips

1. **Batch Create** - Make all 5 game format backgrounds in one Dzine session
2. **Brand Consistency** - Use same color palette across all media
3. **Test Early** - Upload one sample of each type before creating all
4. **Backup Originals** - Keep Dzine/Higgsfield project files
5. **Iterate** - Get feedback from actual trivia night before finalizing
6. **Mobile First** - Ensure graphics are readable on small screens
7. **Accessibility** - Use high contrast, clear fonts
8. **Bar Environment** - Account for bright/dim lighting conditions

---

## 📞 Support

If you encounter issues with specific formats from Dzine or Higgsfield AI, the system will provide detailed error messages with suggested fixes.

**Need Help?**
- Check file size and format
- Try re-exporting with recommended settings
- Test file plays in browser before uploading
- Contact support with sample file for troubleshooting
