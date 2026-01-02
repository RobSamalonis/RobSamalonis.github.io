#!/bin/bash

# GitHub Pages Deployment Script
# Make sure you have your repository set up and this script is executable

echo "🚀 Starting deployment to GitHub Pages..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Deployment aborted."
    exit 1
fi

echo "✅ Build successful!"

# Add all files to git
echo "📝 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy to GitHub Pages - $(date)"

# Push to main branch
echo "🔄 Pushing to main branch..."
git push origin main

echo "🎉 Deployment complete! Your site will be available shortly at:"
echo "https://robsamalonis.github.io/resume/"