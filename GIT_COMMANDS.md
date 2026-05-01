# Git Commands to Push Tests and Merge

## Step 1: Check Current Status
```bash
cd Team-AVON-Project
git status
```

## Step 2: Stage All Test Files
```bash
# Stage new test files
git add security_rules/__tests__/securityRules.test.js
git add engine/config/__tests__/ibmBobClient.test.js
git add engine/services/__tests__/bobOrchestrator.test.js
git add TEST_REPORT.md
git add GIT_COMMANDS.md

# Stage modified files
git add engine/package.json
git add engine/services/__tests__/dataFlowTracker.test.js
git add engine/services/__tests__/dependencyAnalyzer.test.js
```

## Step 3: Commit Changes
```bash
git commit -m "Add comprehensive test suite - 164 tests passing

- Added 39 security rules tests (OWASP Top 10 coverage)
- Added 30 IBM Bob client tests (API integration)
- Added 28 Bob orchestrator tests (workflow)
- Fixed 4 existing tests
- Updated Jest configuration
- Created comprehensive test report

All 164 tests passing with 100% success rate"
```

## Step 4: Check Current Branch
```bash
git branch
```

## Step 5: Push to Your Branch
```bash
# If you're on a feature branch
git push origin HEAD

# Or specify branch name explicitly
git push origin your-branch-name
```

## Step 6: Merge with Main (Option A - Via Command Line)
```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge your branch
git merge your-branch-name

# Push merged changes
git push origin main
```

## Step 6: Merge with Main (Option B - Via Pull Request - RECOMMENDED)
1. Go to your Git repository (GitHub/GitLab/Bitbucket)
2. Create a Pull Request from your branch to main
3. Review the changes
4. Get approval if required
5. Merge the Pull Request

## Alternative: One-Line Commands

### Quick commit and push:
```bash
cd Team-AVON-Project && git add . && git commit -m "Add comprehensive test suite - 164 tests passing" && git push origin HEAD
```

### Quick merge to main (use with caution):
```bash
git checkout main && git pull origin main && git merge your-branch-name && git push origin main
```

## Verification Commands

### After pushing:
```bash
git log --oneline -5
git remote -v
```

### After merging:
```bash
git log --graph --oneline --all -10
```

## Rollback Commands (If Needed)

### Undo last commit (keep changes):
```bash
git reset --soft HEAD~1
```

### Undo last commit (discard changes):
```bash
git reset --hard HEAD~1
```

### Undo merge:
```bash
git merge --abort
```

## Notes
- Replace `your-branch-name` with your actual branch name
- Use Pull Requests for better code review and safety
- Always pull latest changes before merging
- Run tests before pushing: `npm test`