# How to Export IBM Bob Session for Hackathon Submission

**Team AVON | CodeGuard AI**  
**Last Updated**: May 2, 2026

---

## 📋 Overview

This guide explains how to export a complete IBM Bob session with reports and screenshots for hackathon submission. The `bob_sessions/` folder contains all necessary templates and structure.

---

## 🗂️ Folder Structure

```
bob_sessions/
├── IBM_BOB_COMPREHENSIVE_REPORT.md    # Main merged report (DONE ✅)
├── SESSION_EXPORT_TEMPLATE.md         # Session-specific template (DONE ✅)
├── HOW_TO_EXPORT_SESSION.md          # This guide (DONE ✅)
└── screenshots/                       # Screenshots directory (READY 📸)
    ├── README.md                      # Screenshot instructions
    ├── dashboard_overview.png         # (TO ADD)
    ├── vulnerability_detection.png    # (TO ADD)
    ├── ai_remediation.png            # (TO ADD)
    ├── data_flow_visualization.png   # (TO ADD)
    └── security_report.png           # (TO ADD)
```

---

## 🚀 Quick Export Process

### Step 1: Run a Security Scan
```bash
# Start the CodeGuard engine
cd engine
npm install
node server.js

# In another terminal, run a scan
curl -X POST http://localhost:3001/api/v1/audit \
  -H "Content-Type: application/json" \
  -d '{"repoPath": "./demo_samples"}'
```

### Step 2: Generate Reports
The scan automatically generates:
- `security-report.json` - Machine-readable findings
- `security-report.html` - Human-readable report
- `security-report.md` - Markdown documentation

### Step 3: Capture Screenshots

#### Required Screenshots (5 minimum):

**1. Dashboard Overview** (`dashboard_overview.png`)
- Open: `http://localhost:3000` (Next.js dashboard)
- Capture: Full dashboard with metrics and charts
- Tool: Windows Snipping Tool (`Win + Shift + S`)

**2. Vulnerability Detection** (`vulnerability_detection.png`)
- Show: Vulnerability table with detected issues
- Highlight: Severity levels and confidence scores
- Include: At least 3-5 vulnerabilities visible

**3. AI Remediation** (`ai_remediation.png`)
- Show: IBM Bob's AI-generated fix suggestions
- Include: Before/after code comparison
- Highlight: Remediation explanation

**4. Data Flow Visualization** (`data_flow_visualization.png`)
- Show: Cross-file data flow trace
- Include: Source → Files → Sink path
- Highlight: Tainted data path

**5. Security Report** (`security_report.png`)
- Open: `security-report.html` in browser
- Capture: Full report or key findings section
- Include: Overall security grade

#### How to Capture:

**Option A: Windows Snipping Tool**
```
1. Press Win + Shift + S
2. Select area to capture
3. Ctrl + V to paste in Paint
4. Save to bob_sessions/screenshots/
```

**Option B: Browser Full Page Screenshot**
```
1. Open page in Chrome/Edge
2. Press F12 (DevTools)
3. Press Ctrl + Shift + P
4. Type "screenshot"
5. Select "Capture full size screenshot"
6. Save to bob_sessions/screenshots/
```

**Option C: PowerShell Script** (Create this file)
```powershell
# capture-screenshots.ps1
# Automated screenshot capture (requires manual browser navigation)

Write-Host "Screenshot Capture Guide" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host ""
Write-Host "1. Open http://localhost:3000 in browser"
Write-Host "2. Press Win + Shift + S to capture"
Write-Host "3. Save to bob_sessions/screenshots/"
Write-Host ""
Write-Host "Required screenshots:"
Write-Host "  - dashboard_overview.png"
Write-Host "  - vulnerability_detection.png"
Write-Host "  - ai_remediation.png"
Write-Host "  - data_flow_visualization.png"
Write-Host "  - security_report.png"
```

### Step 4: Update Session Template

Edit `SESSION_EXPORT_TEMPLATE.md`:

1. **Update Session Date**: Change to actual scan date
2. **Update Metrics**: Replace with actual scan results
3. **Update Findings**: Add real vulnerability details
4. **Verify Screenshot Links**: Ensure all images are referenced

### Step 5: Copy Generated Reports

```bash
# Copy generated reports to bob_sessions
cp security-report.json bob_sessions/
cp security-report.html bob_sessions/
cp security-report.md bob_sessions/
```

### Step 6: Create Session Archive

```bash
# Create a ZIP archive for submission
cd ..
powershell Compress-Archive -Path bob_sessions -DestinationPath CodeGuard_Bob_Session_Export.zip
```

---

## 📊 What to Include in Submission

### Mandatory Files:
- ✅ `IBM_BOB_COMPREHENSIVE_REPORT.md` - Complete project documentation
- ✅ `SESSION_EXPORT_TEMPLATE.md` - Session-specific findings
- ✅ 5+ Screenshots in `screenshots/` folder
- ✅ Generated reports (JSON, HTML, MD)

### Optional but Recommended:
- 📹 Screen recording of live scan (MP4, <50MB)
- 📊 Performance metrics CSV
- 🧪 Test results screenshot
- 📐 Architecture diagram

---

## 🎯 Hackathon Submission Checklist

Before submitting, verify:

- [ ] All 5 required screenshots captured and saved
- [ ] Screenshots are high resolution (1920x1080+)
- [ ] No sensitive data (API keys, passwords) visible
- [ ] Session template updated with actual metrics
- [ ] Reports generated and included
- [ ] Comprehensive report is complete
- [ ] All markdown files render correctly
- [ ] ZIP archive created successfully
- [ ] Archive size is reasonable (<100MB)
- [ ] README files are clear and helpful

---

## 🔧 Troubleshooting

### Issue: Dashboard not loading
**Solution**: 
```bash
cd dashboard
npm install
npm run dev
```

### Issue: API not responding
**Solution**:
```bash
cd engine
npm install
node server.js
# Verify: curl http://localhost:3001/health
```

### Issue: Screenshots too large
**Solution**: Use image compression
```bash
# Install ImageMagick (optional)
# Then compress:
magick mogrify -resize 1920x1080 -quality 85 *.png
```

### Issue: Missing dependencies
**Solution**:
```bash
# Root directory
npm install

# Engine
cd engine && npm install

# Dashboard
cd dashboard && npm install
```

---

## 📝 Session Export Template Variables

When filling out `SESSION_EXPORT_TEMPLATE.md`, replace these placeholders:

| Placeholder | Replace With | Example |
|-------------|--------------|---------|
| `Session Date` | Actual scan date | May 2, 2026 |
| `Files Scanned` | Number of files analyzed | 47 files |
| `Vulnerabilities Found` | Total issues detected | 12 issues |
| `Scan Duration` | Time taken | 8.3 seconds |
| `Confidence Score` | Average confidence | 0.92 (92%) |

---

## 🎬 Creating a Demo Video (Optional)

For maximum impact, create a 2-3 minute demo video:

### Script Outline:
1. **Introduction** (15s)
   - "CodeGuard AI with IBM Bob"
   - Team AVON presentation

2. **Dashboard Tour** (30s)
   - Show main interface
   - Highlight key metrics

3. **Live Scan** (45s)
   - Run security audit
   - Show real-time analysis

4. **Results Review** (45s)
   - Review detected vulnerabilities
   - Show AI remediation suggestions

5. **Cross-File Detection** (30s)
   - Demonstrate data flow tracing
   - Highlight unique capability

6. **Conclusion** (15s)
   - Summary of benefits
   - Call to action

### Recording Tools:
- **OBS Studio** (Free, professional)
- **Windows Game Bar** (`Win + G`)
- **Loom** (Easy, cloud-based)

---

## 📤 Final Submission Package

Your final submission should contain:

```
CodeGuard_Bob_Session_Export.zip
├── IBM_BOB_COMPREHENSIVE_REPORT.md (683 lines)
├── SESSION_EXPORT_TEMPLATE.md (177 lines)
├── HOW_TO_EXPORT_SESSION.md (this file)
├── security-report.json
├── security-report.html
├── security-report.md
└── screenshots/
    ├── README.md
    ├── dashboard_overview.png
    ├── vulnerability_detection.png
    ├── ai_remediation.png
    ├── data_flow_visualization.png
    └── security_report.png
```

**Estimated Size**: 5-20 MB (depending on screenshot quality)

---

## ✅ Verification Steps

Before final submission:

1. **Extract ZIP** to a new folder
2. **Open all markdown files** - verify they render correctly
3. **Check all screenshots** - ensure they're visible and clear
4. **Review reports** - confirm data is accurate
5. **Test links** - verify all internal references work
6. **Spell check** - run through all documentation
7. **Final review** - read through as if you're a judge

---

## 🏆 Submission Tips

### What Judges Look For:
- ✅ **Innovation**: Cross-file analysis is unique
- ✅ **Completeness**: All required materials included
- ✅ **Quality**: Professional presentation
- ✅ **Functionality**: Working demo/screenshots
- ✅ **Documentation**: Clear, comprehensive guides

### Stand Out Features to Highlight:
1. **Cross-file vulnerability detection** (unique capability)
2. **AI-powered remediation** (IBM Bob integration)
3. **100% test coverage** (106 passing tests)
4. **Production-ready** (full API, multiple formats)
5. **Performance** (<8s scans, token optimization)

---

## 📞 Need Help?

If you encounter issues during export:

1. Check the troubleshooting section above
2. Review the README files in each directory
3. Verify all dependencies are installed
4. Ensure services are running (engine + dashboard)
5. Check console logs for error messages

---

## 🎉 You're Ready!

Once you've completed all steps:
1. ✅ Screenshots captured
2. ✅ Reports generated
3. ✅ Templates updated
4. ✅ Archive created
5. ✅ Verification complete

**Submit your `CodeGuard_Bob_Session_Export.zip` to the hackathon platform!**

---

**Good luck with your submission!**  
**Team AVON | CodeGuard AI**  
**Powered by IBM watsonx**