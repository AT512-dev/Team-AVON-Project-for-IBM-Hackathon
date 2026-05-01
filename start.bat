# 1. Create the project folders
mkdir -p dashboard engine security_rules demo_samples docs

# 2. Create the initial files
echo "# Team AVON - CodeGuard AI" > README.md
echo "node_modules/
.env
__pycache__/
*.log" > .gitignore

# 3. Initialize Git and link to your repo
git init
git remote add origin https://github.com/AT512-dev/Team-AVON-Project-for-IBM-Hackathon.git
git branch -M main

# 4. Stage and Commit
git add .
git commit -m "Initial commit: CodeGuard AI structure for Team AVON"

# 5. Push to GitHub
git push -u origin main