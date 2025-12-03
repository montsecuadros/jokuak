#!/bin/bash

# Speed Reader Setup Script
# For dyslexic readers - HTML, JS, and Python

echo "📖 Speed Reader - Dyslexia Friendly Setup"
echo "=========================================="
echo ""

# Check Python
echo "🔍 Checking for Python..."
if command -v python3 &> /dev/null; then
    PYTHON="python3"
    echo "✓ Found Python 3"
elif command -v python &> /dev/null; then
    PYTHON="python"
    echo "✓ Found Python"
else
    echo "✗ Python not found. Please install Python 3.8 or higher."
    exit 1
fi

# Show Python version
$PYTHON --version

# Create data directory
echo ""
echo "📁 Creating data directory..."
mkdir -p data
echo "✓ Data directory created"

# Install dependencies
echo ""
echo "📦 Installing Python dependencies..."
$PYTHON -m pip install --upgrade pip
$PYTHON -m pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "✗ Failed to install dependencies"
    exit 1
fi

# Summary
echo ""
echo "=========================================="
echo "✓ Setup Complete!"
echo "=========================================="
echo ""
echo "🚀 To start the app:"
echo ""
echo "  1. Terminal 1 - Start the backend:"
echo "     python app.py"
echo ""
echo "  2. Terminal 2 - Serve the frontend:"
echo "     python -m http.server 8000"
echo ""
echo "  3. Open your browser:"
echo "     http://localhost:8000"
echo ""
echo "Or simply open 'index.html' directly in your browser!"
echo ""
echo "💡 For more info, see QUICKSTART.md"
echo ""
