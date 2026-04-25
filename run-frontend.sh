#!/bin/bash
# Orbit Frontend - Run Script for macOS/Linux

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting Orbit Frontend Server..."
echo "=================================="

cd "$PROJECT_ROOT/web"

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Frontend running on: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
