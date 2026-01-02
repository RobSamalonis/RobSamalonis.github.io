# GitHub Pages Deployment Script for Windows
# Make sure you have your repository set up

Write-Host "🚀 Starting deployment to GitHub Pages..." -ForegroundColor Green

# Build the project
Write-Host "📦 Building project..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Deployment aborted." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Add all files to git
Write-Host "📝 Adding files to git..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
$commitMessage = "Deploy to GitHub Pages - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $commitMessage

# Push to main branch
Write-Host "🔄 Pushing to main branch..." -ForegroundColor Yellow
git push origin main

Write-Host "🎉 Deployment complete! Your site will be available shortly at:" -ForegroundColor Green
Write-Host "https://robsamalonis.github.io/" -ForegroundColor Cyan