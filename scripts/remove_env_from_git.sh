#!/usr/bin/env bash
set -euo pipefail
PATH_TO_REMOVE=${1:-backend/.env}

echo "This will remove $PATH_TO_REMOVE from git history using git-filter-repo"
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  git filter-repo --path "$PATH_TO_REMOVE" --invert-paths
  git reflog expire --expire=now --all
  git gc --prune=now --aggressive
  echo "Now force-push branches and tags to origin (you must have permission):"
  echo "  git push --all --force"
  echo "  git push --tags --force"
else
  echo "Aborted"
fi
