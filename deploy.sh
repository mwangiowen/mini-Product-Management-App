#!/bin/bash

# Build the project
echo "🔨 Building project..."
npm run build

# Copy index.html to 404.html for SPA routing
echo "📄 Creating 404.html for SPA routing..."
cp dist/index.html dist/404.html

echo "✅ Build complete! Deploy the 'dist' folder to GitHub Pages."
echo "💡 Make sure to enable GitHub Pages in your repository settings."