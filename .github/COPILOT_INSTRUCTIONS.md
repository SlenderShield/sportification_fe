# 🧠 GitHub Copilot Instructions: Full Documentation Synchronization Policy

## 🎯 Objective
Maintain **accurate, minimal, and always-up-to-date documentation** across the **entire codebase** — including core features, APIs, modules, utilities, configs, and architectural components.  
Every code change must trigger a documentation review or update.

---

## 📘 Documentation Structure and Rules

### ✅ Required Documentation (Create only if necessary)

#### 1. Main Documentation
- **`README.md`**
  - Overview, purpose, tech stack
  - Setup & environment instructions
  - Folder/module structure summary
  - Deployment or execution guide
- **`CONTRIBUTING.md`** (only if open for contributions)
- **`CHANGELOG.md`** (if versioning or release cycles exist)

#### 2. Feature and Module Documentation
- Each major feature or module should have a short `README.md` or `MODULE_OVERVIEW.md` file
- **Location**: Within the module directory (e.g., `src/features/auth/README.md`, `src/core/README.md`)
- **Include**:
  - Module/feature purpose
  - Key classes, functions, and logic flow
  - How it interacts with other modules
  - Setup/configuration notes (if applicable)
- **Automatically update** this doc when:
  - New functionality or logic is added
  - File structure changes
  - Dependencies or configurations change
  - Old code is refactored or removed

#### 3. API Documentation
- **Location**: `/docs/api/` or `/api/docs/`
- **Include**: endpoints, request/response examples, authentication, and error formats
- **Update immediately** when routes, models, or response schemas change

#### 4. Architecture / System Docs
- **File**: `ARCHITECTURE.md` or `/docs/architecture.md`
- **Describe** how the system components connect
- **Update whenever**:
  - Folder structure changes
  - Service design evolves
  - Database models change
  - Core patterns or principles are modified

---

## 🔄 Continuous Update Policy

### When Code Changes, Documentation Must Change

GitHub Copilot must **detect and reflect any change** in:
- ✅ Code logic and algorithms
- ✅ File/folder structure
- ✅ Environment setup and configuration
- ✅ Dependencies (package.json, requirements.txt, etc.)
- ✅ Business rules or user-facing features
- ✅ API endpoints, request/response schemas
- ✅ Database models or data structures

### Action Required
- Always **update the relevant documentation immediately** to stay in sync
- Never allow outdated or stale documentation to remain in the repository
- When removing code or modules, **delete the related docs**
- When adding new features, **create new documentation only if necessary** — concise, relevant, and non-redundant

### Documentation Update Checklist
When making code changes, verify:
- [ ] Is this a new feature? → Update module README or create one if necessary
- [ ] Did file structure change? → Update ARCHITECTURE.md and module READMEs
- [ ] Did API change? → Update API documentation
- [ ] Did configuration change? → Update README.md setup instructions
- [ ] Was code removed? → Remove corresponding documentation
- [ ] Did business logic change? → Update feature documentation

---

## 🧩 Temporary Documentation

### Guidelines for Work-in-Progress Docs
- Store temporary or work-in-progress notes in `/temp_docs/`
- These are **short-lived** and must be deleted at the end of the task, feature branch, or sprint
- Never commit temporary docs to the main branch
- Use for:
  - Draft designs
  - Meeting notes
  - Exploration notes
  - TODO lists

---

## 🚫 Prohibited

### Never Keep
- ❌ Redundant, duplicated, or outdated docs
- ❌ Docs that restate obvious code
- ❌ Unused, irrelevant, or obsolete design drafts
- ❌ Auto-generated docs left unchecked after code changes
- ❌ Documentation that duplicates README.md content
- ❌ Old phase summaries or implementation notes (unless historical context is needed)
- ❌ Multiple documentation files covering the same topic

### Red Flags
If you see documentation that:
- References removed or refactored code
- Describes outdated architecture
- Duplicates information in other docs
- Has not been updated in multiple releases
→ **Remove or update it immediately**

---

## ✅ End Goal

### Documentation Principles
1. **Single Source of Truth**: Documentation always matches the actual codebase
2. **Clean & Organized**: Developer-focused doc structure with no clutter
3. **Automatic Synchronization**: Code changes trigger documentation updates
4. **No Duplication**: Each concept documented once, in the right place
5. **No Confusion**: Precision and clarity over comprehensive coverage

### Success Criteria
- ✅ Every active feature has minimal, accurate documentation
- ✅ README.md is always current with setup and features
- ✅ Module-level docs reflect actual code structure
- ✅ No orphaned or outdated documentation files
- ✅ API docs match implemented endpoints
- ✅ Architecture docs describe current system design

---

## 📋 Implementation Guidelines

### For New Features
1. Check if similar documentation exists before creating new files
2. Update existing docs rather than creating duplicates
3. Keep module documentation minimal (1-2 paragraphs + key points)
4. Place docs close to the code they describe

### For Code Changes
1. Review all documentation potentially affected by the change
2. Update docs in the same commit as the code change
3. If unsure whether to update or create new docs, default to updating existing ones
4. Remove documentation for deleted features immediately

### For Refactoring
1. Update architecture docs if patterns change
2. Update module READMEs if structure changes
3. Remove outdated examples and references
4. Ensure consistency across all documentation

### For Deprecations
1. Mark deprecated features in documentation
2. Provide migration guides if applicable
3. Set removal date for deprecated documentation
4. Remove docs when feature is fully removed

---

## 🔍 Documentation Review Process

### Regular Audits
- Review documentation quarterly
- Check for outdated references
- Verify all links work
- Ensure examples are current
- Consolidate duplicates

### Pull Request Checklist
When reviewing PRs, verify:
- [ ] Code changes have corresponding documentation updates
- [ ] No new documentation duplication introduced
- [ ] Removed code has documentation removed
- [ ] README.md updated if setup/features changed
- [ ] Module READMEs updated if structure changed

---

## 📝 Examples

### Good Documentation Structure
```
project/
├── README.md                          # Main project docs
├── CONTRIBUTING.md                    # Contribution guide
├── ARCHITECTURE.md                    # System architecture
├── .github/
│   └── COPILOT_INSTRUCTIONS.md       # This file
├── src/
│   ├── core/
│   │   └── README.md                  # Core module docs
│   ├── features/
│   │   ├── README.md                  # Features overview
│   │   ├── auth/
│   │   │   └── README.md              # Auth feature docs
│   │   └── matches/
│   │       └── README.md              # Matches feature docs
│   └── shared/
│       └── README.md                  # Shared utilities docs
└── docs/
    └── api/
        └── endpoints.md               # API documentation
```

### Bad Documentation (Avoid)
```
project/
├── README.md
├── README_OLD.md                      # ❌ Outdated duplicate
├── ARCHITECTURE.md
├── ARCHITECTURE_V1.md                 # ❌ Old version
├── PHASE_1_SUMMARY.md                 # ❌ Historical notes
├── PHASE_2_SUMMARY.md                 # ❌ Historical notes
├── IMPLEMENTATION_NOTES.md            # ❌ Temporary notes
├── FEATURE_GUIDE.md                   # ❌ Duplicates README
└── CODEBASE_INDEX.md                  # ❌ Duplicates architecture
```

---

## 🤖 Copilot Behavior

### Always Do
- ✅ Update documentation when making code changes
- ✅ Check for existing docs before creating new ones
- ✅ Keep documentation minimal and focused
- ✅ Remove outdated documentation
- ✅ Place documentation close to relevant code

### Never Do
- ❌ Create duplicate documentation files
- ❌ Leave outdated documentation in place
- ❌ Create documentation that just repeats code comments
- ❌ Add temporary notes to main branch
- ❌ Create comprehensive docs for every minor utility

---

**Version**: 1.0  
**Last Updated**: October 28, 2025  
**Maintained By**: Development Team

---

💡 **Note**: This file serves as the source of truth for documentation practices in this repository. All contributors and automated tools should follow these guidelines.
