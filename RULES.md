# Validationly Development Rules

## 🌌 UI/UX Design Rules

### Global Background Rule
**RULE:** When designing or creating any page in the Validationly project, **unless explicitly specified otherwise**, ALL pages must use the global background from `App.tsx`.

**Global Background Specifications:**
- Base gradient: `bg-gradient-to-br from-indigo-950 via-slate-950 to-cyan-950`
- Aurora animations with floating gradient orbs
- Gradient overlay effects
- All defined in `src/App.tsx`

**What NOT to do:**
- ❌ Never add local background styling to individual pages
- ❌ Don't override the global background unless specifically requested
- ❌ Don't create duplicate background gradients

**What TO do:**
- ✅ Let pages inherit the global background automatically
- ✅ Maintain visual consistency across all pages
- ✅ Use `text-white` or `text-slate-100` for text on the global background

**Examples of pages following this rule:**
- HomePage.tsx
- ToolsPage.tsx  
- ResultsPage.tsx
- AffiliationPage.tsx

---

## 📝 Additional Rules

*Add new development rules here as they are established...*

---

**Last Updated:** December 2024  
**Established by:** User directive on global background consistency
