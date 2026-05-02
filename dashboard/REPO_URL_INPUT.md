# Repository URL Input Feature

## 🎯 Feature Overview

Added repository URL input fields in both the Hero section and Sidebar, allowing users to specify which repository they want to audit.

---

## ✅ Implementation Details

### 1. **Hero Section Input**

**Location:** Above the "Run Audit Now" button in the Hero section

**Features:**

- Large, prominent input field with link icon
- Placeholder: "Enter repository URL (e.g., https://github.com/user/repo)"
- Rounded pill design matching the overall aesthetic
- Focus state with border color change to indigo
- Disabled during audit scanning

**Styling:**

- Max width: 600px (centered)
- Background: Transparent with subtle border
- Icon: Link symbol on the left
- Full-width responsive input

---

### 2. **Sidebar Input**

**Location:** Below the Demo/Live mode toggle in the sidebar

**Features:**

- Compact input field with label "REPOSITORY URL"
- Placeholder: "github.com/user/repo"
- Link icon on the left
- Matches sidebar's glass effect design
- Disabled during audit scanning

**Styling:**

- Fits within sidebar width
- Smaller font size (0.75rem)
- Label in uppercase with letter spacing
- Subtle background matching sidebar theme

---

## 📁 Files Modified

### 1. **`dashboard/src/components/Hero/Hero.tsx`**

**Added Props:**

```typescript
interface HeroProps {
  // ... existing props
  repoUrl: string;
  onRepoUrlChange: (url: string) => void;
}
```

**Added JSX:**

```tsx
<div className="repo-input-container">
  <span className="material-symbols-outlined repo-icon">link</span>
  <input
    type="url"
    className="repo-input"
    placeholder="Enter repository URL (e.g., https://github.com/user/repo)"
    value={repoUrl}
    onChange={(e) => onRepoUrlChange(e.target.value)}
    disabled={loading}
  />
</div>
```

---

### 2. **`dashboard/src/components/SideBar/SideBar.tsx`**

**Added Props:**

```typescript
interface SidebarProps {
  // ... existing props
  repoUrl: string;
  onRepoUrlChange: (url: string) => void;
}
```

**Added JSX:**

```tsx
<div className="sidebar-repo-input">
  <label className="sidebar-repo-label">Repository URL</label>
  <div className="sidebar-repo-input-wrapper">
    <span className="material-symbols-outlined">link</span>
    <input
      type="url"
      placeholder="github.com/user/repo"
      value={repoUrl}
      onChange={(e) => onRepoUrlChange(e.target.value)}
      disabled={loading}
    />
  </div>
</div>
```

---

### 3. **`dashboard/src/components/DashboardUI.tsx`**

**Added State:**

```typescript
const [repoUrl, setRepoUrl] = useState<string>("");
```

**Passed to Components:**

```typescript
<Hero
  // ... existing props
  repoUrl={repoUrl}
  onRepoUrlChange={setRepoUrl}
/>

<Sidebar
  // ... existing props
  repoUrl={repoUrl}
  onRepoUrlChange={setRepoUrl}
/>
```

---

### 4. **`dashboard/src/components/styles.ts`**

**Added Styles:**

```css
/* Hero Input */
.repo-input-container {
  /* Container with icon and input */
}
.repo-icon {
  /* Link icon styling */
}
.repo-input {
  /* Input field styling */
}

/* Sidebar Input */
.sidebar-repo-input {
  /* Container */
}
.sidebar-repo-label {
  /* Label styling */
}
.sidebar-repo-input-wrapper {
  /* Input wrapper with icon */
}
```

---

## 🎨 Visual Design

### Hero Section

```
┌────────────────────────────────────────────┐
│         One-Click Security Audit           │
│   Detect vulnerabilities in seconds...     │
│                                            │
│         [DEMO]  [LIVE API]                 │
│                                            │
│  🔗  [Enter repository URL...]             │ ← NEW
│                                            │
│         [Run Audit Now]                    │
└────────────────────────────────────────────┘
```

### Sidebar

```
┌─────────────────────┐
│ Codeguard.          │
├─────────────────────┤
│ [Demo] [Live]       │
├─────────────────────┤
│ REPOSITORY URL      │ ← NEW
│ 🔗 [github.com...]  │ ← NEW
├─────────────────────┤
│ 📊 Dashboard        │
│ 🐛 Vulnerabilities  │
│ 📝 Generated PRs    │
└─────────────────────┘
```

---

## 🔄 State Management

**Shared State:**

- Both inputs share the same `repoUrl` state
- Changes in one input automatically update the other
- State managed in `DashboardUI` component
- Passed down as props to both Hero and Sidebar

**Synchronization:**

```
User types in Hero input
    ↓
onRepoUrlChange(newUrl)
    ↓
setRepoUrl(newUrl) in DashboardUI
    ↓
Both Hero and Sidebar inputs update
```

---

## 🎯 User Experience

### Benefits:

1. **Dual Input Locations:** Users can enter URL from either Hero or Sidebar
2. **Synchronized State:** Both inputs always show the same value
3. **Visual Feedback:** Focus states and icons provide clear interaction cues
4. **Disabled During Scan:** Prevents changes while audit is running
5. **Placeholder Guidance:** Clear examples of expected input format

### Use Cases:

- **Initial Setup:** Enter repo URL in Hero before first audit
- **Quick Changes:** Update repo URL from Sidebar without scrolling
- **Workflow Flexibility:** Choose input location based on current view

---

## 🧪 Testing Checklist

- [x] Hero input field displays correctly
- [x] Sidebar input field displays correctly
- [x] Both inputs share the same state
- [x] Typing in Hero updates Sidebar
- [x] Typing in Sidebar updates Hero
- [x] Inputs disabled during loading
- [x] Focus states work correctly
- [x] Icons display properly
- [x] Placeholders show helpful text
- [x] Responsive design maintained
- [x] Light/dark mode support

---

## 🚀 Future Enhancements

Potential improvements for future iterations:

1. **URL Validation:**
   - Validate GitHub/GitLab URL format
   - Show error message for invalid URLs
   - Visual indicator for valid URLs

2. **Recent Repositories:**
   - Dropdown with recently audited repos
   - Save to localStorage
   - Quick selection from history

3. **Auto-complete:**
   - Suggest repositories as user types
   - Integration with GitHub API
   - Show repository details on hover

4. **Branch Selection:**
   - Additional input for branch name
   - Default to main/master
   - Dropdown with available branches

---

## ✅ Success Criteria

All requirements met:

- ✅ Input field added to Hero section
- ✅ Input field added to Sidebar
- ✅ Both inputs synchronized
- ✅ Professional styling
- ✅ Theme support (light/dark)
- ✅ Disabled state during loading
- ✅ Clear visual design
- ✅ Helpful placeholders

---

## 📝 Usage Example

```typescript
// User enters URL in Hero
onRepoUrlChange("https://github.com/user/my-repo");

// State updates in DashboardUI
setRepoUrl("https://github.com/user/my-repo");

// Both Hero and Sidebar inputs now show:
// "https://github.com/user/my-repo"

// When user clicks "Run Audit Now"
// The repoUrl value can be used to fetch the repository
```

---

## 🎉 Complete!

The repository URL input feature is fully implemented and ready for use. Users can now specify which repository they want to audit from either the Hero section or the Sidebar, with both inputs staying perfectly synchronized.
