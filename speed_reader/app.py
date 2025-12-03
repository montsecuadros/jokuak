"""
Speed Reader Flask Backend
For dyslexic readers - stores reading sessions and provides analytics
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Data directory
DATA_DIR = Path('data')
DATA_DIR.mkdir(exist_ok=True)

SESSIONS_FILE = DATA_DIR / 'sessions.json'
USERS_FILE = DATA_DIR / 'users.json'

# ===== Utility Functions =====
def load_sessions():
    """Load all sessions from file"""
    if SESSIONS_FILE.exists():
        with open(SESSIONS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_sessions(sessions):
    """Save sessions to file"""
    with open(SESSIONS_FILE, 'w', encoding='utf-8') as f:
        json.dump(sessions, f, indent=2, ensure_ascii=False)

def load_users():
    """Load all users from file"""
    if USERS_FILE.exists():
        with open(USERS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_users(users):
    """Save users to file"""
    with open(USERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=2, ensure_ascii=False)

# ===== API Routes =====

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Speed Reader API is running'
    })

@app.route('/api/session', methods=['POST'])
def save_session():
    """Save a reading session"""
    try:
        data = request.json
        
        session = {
            'id': len(load_sessions()) + 1,
            'timestamp': datetime.now().isoformat(),
            'language': data.get('language', 'spanish'),
            'wpm': data.get('wpm', 300),
            'wordsRead': data.get('wordsRead', 0),
            'timeElapsed': data.get('timeElapsed', 0),
            'comprehensionScore': data.get('comprehensionScore', 0),
            'totalQuestions': data.get('totalQuestions', 0),
            'settings': data.get('settings', {}),
            'userId': data.get('userId', 'anonymous')
        }
        
        sessions = load_sessions()
        sessions.append(session)
        save_sessions(sessions)
        
        return jsonify({
            'success': True,
            'message': 'Session saved successfully',
            'sessionId': session['id']
        }), 201
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/sessions', methods=['GET'])
def get_sessions():
    """Get all sessions"""
    try:
        user_id = request.args.get('userId', 'anonymous')
        sessions = load_sessions()
        
        # Filter by user ID if provided
        if user_id != 'all':
            sessions = [s for s in sessions if s.get('userId') == user_id]
        
        return jsonify({
            'success': True,
            'sessions': sessions,
            'count': len(sessions)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/sessions/<int:session_id>', methods=['GET'])
def get_session(session_id):
    """Get a specific session"""
    try:
        sessions = load_sessions()
        session = next((s for s in sessions if s['id'] == session_id), None)
        
        if not session:
            return jsonify({
                'success': False,
                'error': 'Session not found'
            }), 404
        
        return jsonify({
            'success': True,
            'session': session
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get reading statistics"""
    try:
        user_id = request.args.get('userId', 'anonymous')
        sessions = load_sessions()
        
        # Filter by user ID
        user_sessions = [s for s in sessions if s.get('userId') == user_id]
        
        if not user_sessions:
            return jsonify({
                'success': True,
                'statistics': {
                    'totalSessions': 0,
                    'averageWpm': 0,
                    'averageComprehension': 0,
                    'totalWordsRead': 0,
                    'totalTimeMinutes': 0
                }
            }), 200
        
        total_wpm = sum(s.get('wpm', 0) for s in user_sessions)
        total_comprehension = sum(s.get('comprehensionScore', 0) for s in user_sessions)
        total_words = sum(s.get('wordsRead', 0) for s in user_sessions)
        total_time = sum(s.get('timeElapsed', 0) for s in user_sessions) / 60  # Convert to minutes
        
        statistics = {
            'totalSessions': len(user_sessions),
            'averageWpm': round(total_wpm / len(user_sessions), 2),
            'averageComprehension': round(total_comprehension / len(user_sessions), 2),
            'totalWordsRead': total_words,
            'totalTimeMinutes': round(total_time, 2),
            'lastSession': user_sessions[-1].get('timestamp'),
            'languageBreakdown': get_language_breakdown(user_sessions)
        }
        
        return jsonify({
            'success': True,
            'statistics': statistics
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

def get_language_breakdown(sessions):
    """Get reading breakdown by language"""
    breakdown = {}
    for session in sessions:
        lang = session.get('language', 'unknown')
        if lang not in breakdown:
            breakdown[lang] = {'count': 0, 'totalWpm': 0, 'totalComprehension': 0}
        
        breakdown[lang]['count'] += 1
        breakdown[lang]['totalWpm'] += session.get('wpm', 0)
        breakdown[lang]['totalComprehension'] += session.get('comprehensionScore', 0)
    
    # Calculate averages
    for lang in breakdown:
        count = breakdown[lang]['count']
        breakdown[lang]['averageWpm'] = round(breakdown[lang]['totalWpm'] / count, 2)
        breakdown[lang]['averageComprehension'] = round(breakdown[lang]['totalComprehension'] / count, 2)
    
    return breakdown

@app.route('/api/user', methods=['POST'])
def create_user():
    """Create or update a user profile"""
    try:
        data = request.json
        users = load_users()
        
        user_id = data.get('id', 'user_' + str(len(users) + 1))
        
        user = {
            'id': user_id,
            'name': data.get('name', 'Anonymous'),
            'email': data.get('email', ''),
            'language': data.get('language', 'spanish'),
            'preferences': data.get('preferences', {}),
            'createdAt': datetime.now().isoformat()
        }
        
        users[user_id] = user
        save_users(users)
        
        return jsonify({
            'success': True,
            'message': 'User created successfully',
            'userId': user_id
        }), 201
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/user/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user profile"""
    try:
        users = load_users()
        
        if user_id not in users:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        return jsonify({
            'success': True,
            'user': users[user_id]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/preferences', methods=['POST'])
def save_preferences():
    """Save user preferences"""
    try:
        data = request.json
        user_id = data.get('userId', 'anonymous')
        preferences = data.get('preferences', {})
        
        users = load_users()
        
        if user_id not in users:
            users[user_id] = {
                'id': user_id,
                'preferences': preferences,
                'createdAt': datetime.now().isoformat()
            }
        else:
            users[user_id]['preferences'] = preferences
        
        save_users(users)
        
        return jsonify({
            'success': True,
            'message': 'Preferences saved'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/export', methods=['GET'])
def export_data():
    """Export user data"""
    try:
        user_id = request.args.get('userId', 'anonymous')
        sessions = load_sessions()
        user_sessions = [s for s in sessions if s.get('userId') == user_id]
        
        users = load_users()
        user_data = users.get(user_id, {})
        
        export = {
            'user': user_data,
            'sessions': user_sessions,
            'exportDate': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'data': export
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/stats/progress', methods=['GET'])
def get_progress():
    """Get reading progress over time"""
    try:
        user_id = request.args.get('userId', 'anonymous')
        days = int(request.args.get('days', 30))
        
        sessions = load_sessions()
        user_sessions = [s for s in sessions if s.get('userId') == user_id]
        
        # Group by date
        progress = {}
        for session in user_sessions:
            date = session.get('timestamp', '').split('T')[0]
            if date not in progress:
                progress[date] = {
                    'count': 0,
                    'totalWpm': 0,
                    'totalComprehension': 0,
                    'avgWpm': 0,
                    'avgComprehension': 0
                }
            
            progress[date]['count'] += 1
            progress[date]['totalWpm'] += session.get('wpm', 0)
            progress[date]['totalComprehension'] += session.get('comprehensionScore', 0)
        
        # Calculate averages
        for date in progress:
            count = progress[date]['count']
            progress[date]['avgWpm'] = round(progress[date]['totalWpm'] / count, 2)
            progress[date]['avgComprehension'] = round(progress[date]['totalComprehension'] / count, 2)
        
        return jsonify({
            'success': True,
            'progress': progress
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/tips', methods=['GET'])
def get_tips():
    """Get dyslexia reading tips"""
    tips = [
        {
            'id': 1,
            'title': 'Start Slow',
            'description': 'Begin with 200-300 WPM and gradually increase as you become more comfortable.'
        },
        {
            'id': 2,
            'title': 'Use Dyslexic Mode',
            'description': 'The dyslexic mode preset is optimized for comfortable reading with increased spacing.'
        },
        {
            'id': 3,
            'title': 'Take Breaks',
            'description': 'Regular breaks improve retention and reduce eye fatigue. Take a 5-10 minute break every 20 minutes.'
        },
        {
            'id': 4,
            'title': 'Adjust Font Size',
            'description': 'If text is uncomfortable, increase the font size. Larger text reduces reading effort.'
        },
        {
            'id': 5,
            'title': 'Focus on Comprehension',
            'description': 'Speed is less important than understanding. Slow down if you are not comprehending well.'
        },
        {
            'id': 6,
            'title': 'Use Color Overlays',
            'description': 'Experiment with different background colors. Many dyslexic readers prefer warm, light backgrounds.'
        },
        {
            'id': 7,
            'title': 'Practice Consistently',
            'description': 'Regular practice is key to improvement. Try to read for 15-20 minutes daily.'
        },
        {
            'id': 8,
            'title': 'Adjust Line Height',
            'description': 'Increase line height to reduce visual crowding and make text easier to track.'
        }
    ]
    
    return jsonify({
        'success': True,
        'tips': tips
    }), 200

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

# ===== Main =====
if __name__ == '__main__':
    print("🚀 Starting Speed Reader API Server...")
    print("📖 For dyslexic readers")
    print("🌐 Running on http://localhost:5000")
    print("💡 API Documentation available at http://localhost:5000/api/health")
    
    app.run(debug=True, port=5000, host='0.0.0.0')
