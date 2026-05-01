# 1. Pull the remote changes and allow unrelated histories
git pull origin main --allow-unrelated-histories

# 2. Stage everything again just in case
git add .

# 3. Push it up
git push -u origin main