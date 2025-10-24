# Brand-Category Hierarchy Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BRAND-CATEGORY STRUCTURE                            │
└─────────────────────────────────────────────────────────────────────────────┘

Brand Level (Primary)                    Category Level (Dependent)
─────────────────────                    ───────────────────────────

┌─────────────┐
│  Autodesk   │───────────┬───→ AutoCAD
└─────────────┘           ├───→ 3ds MAX
                          ├───→ Revit
                          ├───→ Maya
                          ├───→ Fusion
                          ├───→ Navisworks Manage
                          ├───→ Inventor Professional
                          ├───→ AutoCAD LT
                          ├───→ AEC Collection
                          ├───→ Civil 3D
                          ├───→ Map 3D
                          ├───→ AutoCAD Mechanical
                          ├───→ AutoCAD Electrical
                          └───→ AutoCAD MEP

┌─────────────┐
│  Microsoft  │───────────┬───→ Microsoft 365
└─────────────┘           ├───→ Microsoft Professional
                          ├───→ Microsoft Projects
                          └───→ Server

┌─────────────┐
│    Adobe    │───────────┬───→ Adobe Acrobat
└─────────────┘           ├───→ Photoshop
                          ├───→ Lightroom
                          ├───→ After Effect
                          ├───→ Premier Pro
                          ├───→ Illustrator
                          └───→ Adobe Creative Cloud

┌─────────────┐
│  Coreldraw  │───────────┬───→ Coreldraw Graphics Suite
└─────────────┘           └───→ Coreldraw Technical Suite

┌─────────────┐
│  Antivirus  │───────────┬───→ K7 Security
└─────────────┘           ├───→ Quick Heal
                          ├───→ Hyper Say
                          ├───→ Norton
                          ├───→ McAfee
                          └───→ ESET

┌─────────────────────┐
│ Structural Software │───┬───→ E-Tab
└─────────────────────┘   ├───→ Safe
                          ├───→ Sap 2000
                          └───→ Tekla

┌─────────────────────────┐
│ Architectural Softwares │─┬───→ Lumion
└─────────────────────────┘ ├───→ Twin Motion
                            ├───→ D5 Render
                            └───→ Archi CAD

┌─────────────┐
│    Ebook    │──────────────→ (No categories)
└─────────────┘


═══════════════════════════════════════════════════════════════════════════════
                              USER INTERACTION FLOW
═══════════════════════════════════════════════════════════════════════════════

Step 1: Select Brand                    Step 2: Select Category
┌───────────────────┐                   ┌───────────────────┐
│ Brand *           │                   │ Category *        │
│ ┌───────────────┐ │                   │ ┌───────────────┐ │
│ │ Autodesk    ▼ │ │ ────────────────> │ │ AutoCAD     ▼ │ │
│ └───────────────┘ │                   │ └───────────────┘ │
└───────────────────┘                   └───────────────────┘
                                         Shows categories for
                                         selected brand only

User changes brand...
┌───────────────────┐                   ┌───────────────────┐
│ Brand *           │                   │ Category *        │
│ ┌───────────────┐ │                   │ ┌───────────────┐ │
│ │ Adobe       ▼ │ │ ────────────────> │ │ Photoshop   ▼ │ │
│ └───────────────┘ │                   │ └───────────────┘ │
└───────────────────┘                   └───────────────────┘
                                         Categories update
                                         automatically!

═══════════════════════════════════════════════════════════════════════════════
                                  DATA FLOW
═══════════════════════════════════════════════════════════════════════════════

1. USER SELECTS BRAND
   ↓
2. handleBrandChange() TRIGGERED
   ↓
3. LOOKUP brandCategories[selectedBrand]
   ↓
4. UPDATE CATEGORY DROPDOWN OPTIONS
   ↓
5. AUTO-SELECT FIRST CATEGORY
   ↓
6. USER SELECTS FINAL CATEGORY
   ↓
7. FORM SUBMITTED
   ↓
8. DATA SAVED TO DATABASE
   {
     brand: "autodesk",
     company: "autodesk",  // backward compatibility
     category: "autocad"
   }

═══════════════════════════════════════════════════════════════════════════════
                            VALIDATION RULES
═══════════════════════════════════════════════════════════════════════════════

✓ Brand is REQUIRED
✓ Category is REQUIRED (except Ebook which has no categories)
✓ Brand must be one of 8 predefined options
✓ Category must be from the list under selected brand
✓ Form cannot submit with empty brand or category

═══════════════════════════════════════════════════════════════════════════════
                            KEY FEATURES
═══════════════════════════════════════════════════════════════════════════════

✨ Dynamic category loading
✨ Automatic category reset on brand change
✨ Disabled state for empty categories (Ebook)
✨ Auto-selection of first available category
✨ Full backward compatibility
✨ Clean, intuitive UI
✨ Proper validation
✨ Edit mode support

═══════════════════════════════════════════════════════════════════════════════
```
