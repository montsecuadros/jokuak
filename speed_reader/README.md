# 📖 Speed Reader - Dyslexia Friendly Edition

A specialized speed reading application designed specifically for dyslexic readers to improve reading speed and comprehension while maintaining accessibility and comfort.

## ✨ Features

### 🎨 Dyslexia-Friendly Design
- **OpenDyslexic Font**: Font specifically designed for dyslexic readers
- **Customizable Spacing**: Adjustable line height and letter spacing
- **Color Customization**: Choose comfortable background and text colors
- **Warm Backgrounds**: Default warm beige (#FFF8E7) reduces eye strain
- **Bionic Reading**: Automatically highlights first half of words for faster recognition

### 📚 Reading Features
- **Adjustable Speed**: 50-600 WPM (Words Per Minute) - start slow, build up
- **RSVP Technology**: Word-by-word display minimizes eye movement
- **Large Display**: Centered, large text for better focus
- **Pause/Resume**: Take breaks without losing your place
- **Progress Tracking**: Real-time progress bar and word counter
- **Bilingual Support**: Spanish (Español) and Basque (Euskera)

### 🧠 Comprehension Assessment
- **Auto-Generated Quizzes**: 3 questions per reading session
- **Immediate Feedback**: Get explanations for each answer
- **Score Tracking**: See your comprehension percentage
- **Performance Analytics**: Track your progress over time

### 🎯 Preset Modes
1. **Dyslexic Mode** (Default) - Optimized for comfort
   - Large font (36px), increased spacing
   - Warm background color
   - Bionic reading enabled

2. **Comfortable Mode** - Standard settings
   - Medium font (28px)
   - Clean white background
   - No bionic reading

3. **High Contrast Mode** - Maximum visibility
   - Large font (32px)
   - Black background with yellow text
   - Bionic reading enabled

## 🚀 Quick Start

### Installation

1. **Clone/Navigate to the project:**
```bash
cd speed_reader
```

2. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

### Running the Application

#### Option 1: Simple HTML/JS Only (No Backend)
```bash
# Just open index.html in your browser
open index.html
```

#### Option 2: With Python Backend (Recommended)
```bash
# Terminal 1: Start Python Flask server
python app.py

# Terminal 2: Open index.html in browser
open index.html
```

The app will be running at:
- **Frontend**: `file:///path/to/index.html` (or use a local server)
- **Backend**: `http://localhost:5000`

### Using a Local Server (Recommended)

```bash
# Using Python
python -m http.server 8000

# Then open: http://localhost:8000
```

## 📖 How to Use

### Your First Reading Session

1. **Select Language**: Choose Spanish or Basque
2. **Apply Preset**: Click "Dyslexic Mode" for optimal comfort settings
3. **Adjust if Needed**: 
   - Increase font size if text is too small
   - Adjust WPM speed if too fast/slow
   - Change colors if uncomfortable
4. **Start Reading**: Click "▶ Start Reading"
5. **Control**: Use Pause/Resume/Stop as needed
6. **Quiz**: Answer comprehension questions after reading
7. **View Results**: See your performance statistics

### Tips for Best Results

**If reading feels uncomfortable:**
- Increase line height to 2.0+
- Use Dyslexic Mode preset
- Increase font size to 40-48px
- Take regular breaks

**If you don't understand:**
- Slow down to 150-200 WPM
- Increase font size
- Re-read at slower speed

**If speed is too fast:**
- Reduce WPM slider
- Pause frequently using the pause button
- Take breaks between words

## ⚙️ Customization

### Font Settings
- **Font Size**: 16px to 48px (try 32-36px for dyslexic readers)
- **Line Height**: 1.0 to 3.0 (try 1.8-2.0 for dyslexic readers)
- **Letter Spacing**: 0 to 0.3em (try 0.15em for dyslexic readers)

### Colors
- **Background**: Choose from any color
- **Text**: Choose from any color
- **Pre-made color combinations** in preset buttons

### Speed
- **WPM Range**: 50 to 600 words per minute
- **Recommended Start**: 200-300 WPM
- **Gradual Increase**: +50 WPM per week as you improve

## 📊 Statistics & Progress

The app tracks:
- **WPM** (Words Per Minute) - your reading speed
- **Comprehension Score** - understanding level (0-100%)
- **Reading Time** - session duration
- **Words Read** - total words processed
- **Session History** - all past sessions (with backend)

### Backend Features (Optional)

With the Python backend, you can:
- Save reading sessions automatically
- Track progress over time
- Export your data
- View detailed statistics
- Get personalized tips

## 🏗️ Project Structure

```
speed_reader/
├── index.html           # Main HTML interface
├── styles.css           # Dyslexia-friendly styling
├── app.js               # Frontend JavaScript
├── app.py               # Python Flask backend (optional)
├── requirements.txt     # Python dependencies
├── data/                # Data storage (created automatically)
│   ├── sessions.json    # Reading sessions
│   └── users.json       # User profiles
└── README.md            # This file
```

## 🔌 API Endpoints (Backend)

If running the Python backend, available endpoints:

```
GET  /api/health                 # Health check
POST /api/session                # Save a reading session
GET  /api/sessions               # Get all sessions
GET  /api/sessions/<id>          # Get specific session
GET  /api/statistics             # Get user statistics
POST /api/user                   # Create/update user
GET  /api/user/<id>              # Get user profile
POST /api/preferences            # Save preferences
GET  /api/export                 # Export all user data
GET  /api/stats/progress         # Get progress over time
GET  /api/tips                   # Get reading tips
```

### Example API Usage

```javascript
// Save a reading session
fetch('http://localhost:5000/api/session', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        language: 'spanish',
        wpm: 320,
        wordsRead: 150,
        timeElapsed: 28,
        comprehensionScore: 85,
        totalQuestions: 3,
        userId: 'user123'
    })
});

// Get statistics
fetch('http://localhost:5000/api/statistics?userId=user123')
    .then(r => r.json())
    .then(data => console.log(data.statistics));
```

## 🎓 Dyslexia Support Details

### Why These Features?

**OpenDyslexic Font**: 
- Designed specifically for dyslexic readers
- Heavier baseline helps with letter recognition
- Reduced letter crowding

**Increased Spacing**:
- Reduces visual crowding
- Helps prevent "river" effect (vertical gaps in text)
- Makes tracking easier

**Bionic Reading**:
- Guides eye movement
- Faster word recognition
- Reduces cognitive load

**Warm Colors**:
- Reduces contrast sensitivity
- Decreases visual stress
- Easier on the eyes

**Word-by-Word Display**:
- No horizontal tracking needed
- Reduces regression (re-reading)
- Improves focus

## 📱 Browser Compatibility

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ⌨️ Keyboard Shortcuts (Future)

- `Space` - Start/Pause
- `Escape` - Stop
- `+` - Increase speed
- `-` - Decrease speed

## 🆘 Troubleshooting

### Text appears too small
- Use the Font Size slider to increase size
- Click "Dyslexic Mode" for optimal settings
- Try increasing to 40-48px

### Reading is too fast
- Reduce the WPM slider
- Recommended: Start at 200 WPM
- Gradually increase by 50 WPM per week

### Backend not connecting
- Ensure Flask is running: `python app.py`
- Check if port 5000 is available
- Try accessing `http://localhost:5000/api/health`

### Data not saving
- Frontend-only: Data is lost on page reload
- With backend: Data persists in `data/` directory
- Check browser console for errors

## 🔐 Privacy

- **Frontend Only**: All data is local to your browser
- **With Backend**: Data stored in local `data/` directory
- **No Cloud**: No data sent to external servers
- **Anonymous**: Can use without creating account

## 📈 Tips for Success

1. **Consistency**: Practice daily for best results
2. **Start Slow**: Begin with 200-300 WPM
3. **Increase Gradually**: Add 50 WPM per week
4. **Take Breaks**: Rest eyes every 20 minutes
5. **Focus on Comprehension**: Speed follows understanding
6. **Customize Settings**: Every reader is different
7. **Use Presets**: Try all three presets to find best fit
8. **Track Progress**: Monitor your improvement

## 🤝 Contributing

To improve this app:

1. Report issues or suggest features
2. Improve text/translations in `app.js`
3. Add more comprehension questions
4. Improve CSS for better accessibility
5. Add more languages

## 📝 License

MIT License - Free to use and modify

## 📚 Resources

- **OpenDyslexic**: https://opendyslexic.org/
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **Dyslexia Help**: https://www.dyslexiahelp.org/
- **RSVP Technology**: Research on speed reading

## 👨‍💻 Technical Stack

**Frontend:**
- HTML5
- CSS3 (with CSS Variables)
- Vanilla JavaScript (no dependencies)

**Backend (Optional):**
- Python 3.8+
- Flask 2.3+
- Flask-CORS

**Fonts:**
- OpenDyslexic (Google Fonts)
- Fallback: Georgia, Arial

## 🚀 Performance

- **No Build Process**: Just open HTML in browser
- **Lightweight**: < 50KB total
- **Fast Loading**: Instant startup
- **Responsive**: Works on all devices
- **Low Memory**: Minimal resource usage

## 🎯 Future Enhancements

- [ ] User accounts with cloud backup
- [ ] Mobile app versions
- [ ] Voice feedback/pronunciation
- [ ] More languages (French, German, etc.)
- [ ] Custom text upload
- [ ] Reading history graphs
- [ ] Achievement badges
- [ ] Social features

---

**Built with ❤️ for dyslexic readers everywhere.**

*Last Updated: December 2024*
*Version: 1.0*
