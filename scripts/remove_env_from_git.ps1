# PowerShell script to remove backend/.env from git history using git-filter-repo
# Requires git-filter-repo installed and available in PATH.

param(
  [string]$PathToRemove = 'backend/.env'
)

Write-Host "This will rewrite git history to remove: $PathToRemove" -ForegroundColor Yellow
Write-Host "Make sure you have a backup and coordinate force-push with your team." -ForegroundColor Yellow

Read-Host "Press Enter to continue or Ctrl+C to abort"

# Run git filter-repo
git filter-repo --path $PathToRemove --invert-paths

Write-Host "Expire reflog and garbage collect" -ForegroundColor Green
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host "Force push branches and tags to origin (ensure you have permission)" -ForegroundColor Yellow
Write-Host "git push --all --force" -ForegroundColor Cyan
Write-Host "git push --tags --force" -ForegroundColor Cyan

Write-Host "Done. Verify remote repo and replace secrets in deployment." -ForegroundColor Green
