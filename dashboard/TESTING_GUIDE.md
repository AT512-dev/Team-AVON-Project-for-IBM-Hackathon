# CodeGuard Dashboard - Testing Guide

**Quick reference for testing Phases 1-3 improvements**

---

## 🚀 Quick Start

### 1. Start Backend (Terminal 1)

```bash
cd engine
npm install
npm start
```

✅ Should see: "CodeGuard AI Engine running on http://localhost:3000"

### 2. Start Dashboard (Terminal 2)

```bash
cd dashboard
npm install
npm run dev
```

✅ Should see: "Ready on http://localhost:3001"

### 3. Open Browser

Navigate to: **http://localhost:3001**

---

## ✅ Phase 1: API Integration Tests

### Test 1: Demo Mode

1. Click **"Run Audit Now"** button
2. ✅ Should see loading spinner
3. ✅ Should load 29 vulnerabilities
4. ✅ Metrics should show: ~7.2h saved, ~$400+ saved
5. ✅ Score rings should display (before/after)

### Test 2: Live API Mode

1. Switch to **"LIVE API"** mode
2. Click **"Run Audit Now"**
3. ✅ Should connect to backend
4. ✅ Should display same data structure
5. ✅ Check browser console - no errors

### Test 3: API Status Indicator

1. Stop backend server (Ctrl+C in Terminal 1)
2. ✅ API status should show "offline" (red dot)
3. Restart backend
4. ✅ API status should show "online" (green dot)

---

## ✨ Phase 2: UI Polish Tests

### Test 4: Sortable Table

1. Click **"File"** column header
2. ✅ Should sort alphabetically (A→Z)
3. Click again
4. ✅ Should reverse sort (Z→A)
5. ✅ Arrow indicator should change (↑/↓)
6. Try other columns: **Type**, **Severity**, **Confidence**

### Test 5: Search Functionality

1. Type **"SQL"** in search box
2. ✅ Should filter to SQL-related vulnerabilities
3. Type **"auth.js"**
4. ✅ Should show only auth.js vulnerabilities
5. Clear search
6. ✅ Should show all vulnerabilities again

### Test 6: Copy to Clipboard

1. Click any vulnerability row to expand
2. Click **"Copy"** button next to code
3. ✅ Button should change to "✓ Copied"
4. Paste in text editor (Ctrl+V)
5. ✅ Should paste the vulnerable code

### Test 7: Animated Metrics

1. Refresh page (F5)
2. Click "Run Audit Now"
3. ✅ Watch numbers count up smoothly (0 → final value)
4. ✅ Animation should take ~1 second

### Test 8: Hover Tooltips

1. Hover over **"Score Before"** metric card
2. ✅ Should see tooltip: "Security score before fixes"
3. Hover over other metrics
4. ✅ Each should show helpful tooltip
5. ✅ Card should lift slightly on hover

### Test 9: Trend Indicators

1. Look at metric cards
2. ✅ "Score Before" should have red ↓ arrow
3. ✅ "Score After" should have green ↑ arrow

---

## 📱 Phase 3: Responsive Design Tests

### Test 10: Desktop View (1920px)

1. Open DevTools (F12)
2. Set viewport to **1920x1080**
3. ✅ 4-5 metric cards in a row
4. ✅ Score comparison and severity side-by-side
5. ✅ Full navigation visible
6. ✅ All table columns visible

### Test 11: Tablet View (768px)

1. Set viewport to **768x1024** (iPad)
2. ✅ 2 metric cards per row
3. ✅ Score and severity stack vertically
4. ✅ Navigation still visible
5. ✅ Table remains readable

### Test 12: Mobile View (375px)

1. Set viewport to **375x667** (iPhone SE)
2. ✅ Hamburger menu appears (☰)
3. ✅ 1 metric card per row
4. ✅ Everything stacks vertically
5. ✅ Confidence column hidden in table
6. ✅ Search box full width

### Test 13: Hamburger Menu

1. On mobile view, click hamburger icon
2. ✅ Menu should slide down
3. ✅ Should show: Dashboard, Reports, Settings
4. ✅ Should show API status
5. Click hamburger again
6. ✅ Menu should close

### Test 14: Touch Interactions

1. On mobile view, tap "Run Audit Now"
2. ✅ Button should be easy to tap (44px min)
3. Tap filter buttons
4. ✅ Should be touch-friendly
5. Tap to expand vulnerability row
6. ✅ Should expand smoothly

### Test 15: Landscape Mode

1. Rotate device to landscape (or set viewport to 667x375)
2. ✅ Layout should adapt
3. ✅ Everything should remain usable

---

## 🎨 Visual Quality Tests

### Test 16: Animations

1. Refresh page and run audit
2. ✅ Vulnerability rows should fade in one by one
3. ✅ Numbers should count up smoothly
4. ✅ No janky animations
5. ✅ Smooth 60fps throughout

### Test 17: Hover Effects

1. Hover over metric cards
2. ✅ Should lift with shadow
3. ✅ Border should glow
4. Hover over table rows
5. ✅ Background should lighten
6. Hover over buttons
7. ✅ Should show visual feedback

### Test 18: Loading States

1. Click "Run Audit Now"
2. ✅ Button should show spinner
3. ✅ Button text: "Scanning Codebase…"
4. ✅ Button should be disabled during load

---

## 🐛 Edge Case Tests

### Test 19: Empty State

1. Before running any audit
2. ✅ Should show empty state with icon
3. ✅ Should say "Click Run Audit Now above"

### Test 20: Error Handling

1. Stop backend server
2. Switch to "LIVE API" mode
3. Click "Run Audit Now"
4. ✅ Should show error banner
5. ✅ Error message should be helpful

### Test 21: Filter Combinations

1. Run audit
2. Select "CRITICAL" filter
3. ✅ Should show only critical issues
4. Type "SQL" in search
5. ✅ Should show critical SQL issues only
6. Sort by "File"
7. ✅ Should sort filtered results

### Test 22: Large Dataset

1. Run audit with demo data (29 vulnerabilities)
2. ✅ Table should render quickly
3. ✅ Sorting should be instant
4. ✅ Search should be instant
5. ✅ No performance issues

---

## 🌐 Cross-Browser Tests

### Test 23: Chrome/Edge

1. Open in Chrome
2. ✅ Everything works
3. ✅ Animations smooth
4. ✅ No console errors

### Test 24: Firefox

1. Open in Firefox
2. ✅ Everything works
3. ✅ Styles render correctly
4. ✅ No console errors

### Test 25: Safari (if available)

1. Open in Safari
2. ✅ Everything works
3. ✅ Animations smooth
4. ✅ No console errors

---

## 📊 Performance Tests

### Test 26: Lighthouse Audit

1. Open DevTools → Lighthouse
2. Run audit (Desktop)
3. ✅ Performance: 90+
4. ✅ Accessibility: 90+
5. ✅ Best Practices: 90+

### Test 27: Network Throttling

1. DevTools → Network → Slow 3G
2. Run audit
3. ✅ Should still work
4. ✅ Loading states should show
5. ✅ No crashes

### Test 28: Memory Leaks

1. Run audit 10 times
2. Check DevTools → Memory
3. ✅ Memory should not keep growing
4. ✅ No memory leaks

---

## ✅ Final Checklist

### Functionality

- [ ] Demo mode works
- [ ] Live API mode works
- [ ] Sorting works on all columns
- [ ] Search filters correctly
- [ ] Copy to clipboard works
- [ ] All tooltips appear
- [ ] Numbers animate smoothly

### Responsive Design

- [ ] Desktop layout correct
- [ ] Tablet layout correct
- [ ] Mobile layout correct
- [ ] Hamburger menu works
- [ ] Touch targets are 44px+
- [ ] Text is readable on all sizes

### Visual Quality

- [ ] Animations are smooth (60fps)
- [ ] Hover effects work
- [ ] Loading states show
- [ ] Colors are consistent
- [ ] Icons display correctly

### Performance

- [ ] Initial load < 3 seconds
- [ ] Sorting is instant
- [ ] Search is instant
- [ ] No console errors
- [ ] No memory leaks

### Cross-Browser

- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari (if available)
- [ ] Works on mobile browsers

---

## 🐛 Common Issues & Solutions

### Issue: API not connecting

**Solution:**

```bash
# Check if backend is running
curl http://localhost:3000/health

# Restart backend
cd engine
npm start
```

### Issue: Port already in use

**Solution:**

```bash
# Kill process on port 3001
npx kill-port 3001

# Or use different port
npm run dev -- -p 3002
```

### Issue: Styles not loading

**Solution:**

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Issue: TypeScript errors

**Solution:**

```bash
# Rebuild types
npm run build

# Check for errors
npx tsc --noEmit
```

---

## 📸 Screenshots to Take

For documentation/demo:

1. Desktop view - full dashboard
2. Mobile view - hamburger menu open
3. Sorting in action (with arrow indicator)
4. Search filtering results
5. Expanded vulnerability with copy button
6. Hover tooltip on metric card
7. Animated numbers counting up (video)
8. Responsive layouts (desktop/tablet/mobile)

---

## 🎯 Success Criteria

Your dashboard passes if:

- ✅ All 28 tests pass
- ✅ No console errors
- ✅ Smooth animations (60fps)
- ✅ Works on mobile/tablet/desktop
- ✅ Works in all major browsers
- ✅ Lighthouse score 90+

---

## 🎉 Ready for Demo!

Once all tests pass, your dashboard is ready to:

- Show to your team
- Present at hackathon
- Deploy to production
- Add to your portfolio

---

**Happy Testing! 🚀**

**Last Updated:** 2026-05-02  
**Version:** 1.0
