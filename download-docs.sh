#!/bin/bash
# PKWY Trivia Documentation Download Script

echo "📚 PKWY Trivia System - Documentation Export"
echo "==========================================="
echo ""

# Create export directory
EXPORT_DIR="$HOME/pkwy-trivia-export-$(date +%Y%m%d)"
mkdir -p "$EXPORT_DIR/documentation"
mkdir -p "$EXPORT_DIR/source-code"

echo "✓ Created export directory: $EXPORT_DIR"

# Copy documentation
echo ""
echo "📄 Copying documentation files..."
cp /app/COMPLETE_DOCUMENTATION.md "$EXPORT_DIR/documentation/"
cp /app/ROADMAP.md "$EXPORT_DIR/documentation/"
cp /app/contracts.md "$EXPORT_DIR/documentation/"
cp /app/MEDIA_FORMAT_GUIDE.md "$EXPORT_DIR/documentation/"
cp /app/VIDEO_SPECS.md "$EXPORT_DIR/documentation/"
cp /app/QUIZXPRESS_ANALYSIS.md "$EXPORT_DIR/documentation/"
cp /app/DOWNLOAD_GUIDE.md "$EXPORT_DIR/documentation/"
echo "✓ Documentation copied (7 files)"

# Copy source code
echo ""
echo "💻 Copying source code..."
cp -r /app/frontend/src "$EXPORT_DIR/source-code/frontend-src"
cp /app/frontend/package.json "$EXPORT_DIR/source-code/"
cp /app/frontend/tailwind.config.js "$EXPORT_DIR/source-code/"
echo "✓ Source code copied"

# Create README
cat > "$EXPORT_DIR/README.txt" << 'READMEEOF'
PKWY Trivia System - Documentation Export
==========================================

This package contains all documentation and source code for the PKWY Tavern Trivia System.

DOCUMENTATION FILES (./documentation/):
1. COMPLETE_DOCUMENTATION.md - Full system guide (start here!)
2. ROADMAP.md - What's done vs remaining
3. contracts.md - Backend API specifications
4. MEDIA_FORMAT_GUIDE.md - Dzine & Higgsfield AI formats
5. VIDEO_SPECS.md - Video requirements
6. QUIZXPRESS_ANALYSIS.md - Feature comparison
7. DOWNLOAD_GUIDE.md - This export guide

SOURCE CODE (./source-code/):
- frontend-src/ - Complete React frontend
- package.json - Dependencies list
- tailwind.config.js - Styling configuration

READING ORDER:
For overview: Start with COMPLETE_DOCUMENTATION.md
For developers: Read ROADMAP.md then contracts.md
For media: Read MEDIA_FORMAT_GUIDE.md

SYSTEM STATUS:
✅ Frontend: 100% Complete
❌ Backend: 0% Complete
Overall: ~40% Complete (Phase C remaining)

NEXT STEPS:
Build backend with WebSocket for real-time multiplayer.
See ROADMAP.md for detailed plan.

Export Date: $(date)
Version: 1.0 MVP
READMEEOF

echo "✓ README created"

# Create summary
echo ""
echo "📊 Creating summary..."
cat > "$EXPORT_DIR/SUMMARY.txt" << SUMMARYEOF
PKWY TRIVIA SYSTEM - QUICK SUMMARY
===================================

WHAT'S BUILT:
✅ Player mobile interface (join, play, see scores)
✅ TV display (branded lobby, Jeopardy board, leaderboard)
✅ Director control panel (host game controls)
✅ Host dashboard (manage games/questions)
✅ Bulk import (CSV/JSON + 8 game packs)
✅ Media library (images/videos/audio)
✅ White-label branding (PKWY Tavern)

WHAT'S REMAINING:
❌ Backend API (FastAPI + MongoDB)
❌ WebSocket real-time sync
❌ Database storage
❌ Multiplayer functionality

COMPLETION: ~40%
TIME TO FINISH: 4-6 weeks (Phase C)

LIVE URLS:
- Player Join: https://pubgame-1.preview.emergentagent.com
- TV Display: https://pubgame-1.preview.emergentagent.com/tv/TRIVIA
- Director: https://pubgame-1.preview.emergentagent.com/director/TRIVIA
- Host: https://pubgame-1.preview.emergentagent.com/host

DOCUMENTATION STATS:
- Total files: 7
- Total pages: ~155
- File size: ~450 KB

Export Date: $(date)
SUMMARYEOF

echo "✓ Summary created"

# Create ZIP if possible
if command -v zip &> /dev/null; then
    echo ""
    echo "📦 Creating ZIP archive..."
    cd "$HOME"
    ZIP_NAME="pkwy-trivia-export-$(date +%Y%m%d).zip"
    zip -r "$ZIP_NAME" "$(basename $EXPORT_DIR)" > /dev/null 2>&1
    echo "✓ ZIP created: $HOME/$ZIP_NAME"
fi

echo ""
echo "=========================================="
echo "✅ EXPORT COMPLETE!"
echo ""
echo "📁 Location: $EXPORT_DIR"
echo ""
echo "What's included:"
echo "  • 7 documentation files"
echo "  • Complete frontend source code"
echo "  • README and SUMMARY"
if command -v zip &> /dev/null; then
    echo "  • ZIP archive for easy sharing"
fi
echo ""
echo "Next steps:"
echo "1. Review COMPLETE_DOCUMENTATION.md"
echo "2. Check ROADMAP.md for what's remaining"
echo "3. Share with your team"
echo ""
