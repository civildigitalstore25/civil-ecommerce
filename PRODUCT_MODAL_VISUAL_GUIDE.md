# Product Modal - Visual Guide

## Form Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Add New Product / Edit Product                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Basic Information                                           │
│  ────────────────                                            │
│  ┌────────────────┐  ┌────────────┐                        │
│  │ Product Name * │  │ Version *  │                         │
│  └────────────────┘  └────────────┘                         │
│  ┌──────────────────────────────────┐                       │
│  │ Short Description *               │                       │
│  └──────────────────────────────────┘                       │
│                                                              │
│  Brand & Category                                            │
│  ─────────────────                                           │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │ Brand *             │  │ Category *          │           │
│  │ ▼ Autodesk         │  │ ▼ AutoCAD           │           │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                              │
│  [Pricing Options, Features, Images, etc. follow...]        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## User Interaction Flow

### Scenario 1: Adding New Product

**Step 1:** User opens "Add Product" modal
- Brand dropdown shows: Autodesk (default selected)
- Category dropdown shows: AutoCAD, 3ds MAX, Revit, etc.
- First category (AutoCAD) is auto-selected

**Step 2:** User changes brand to "Adobe"
- Brand dropdown: Adobe (now selected)
- Category dropdown automatically updates to show: Adobe Acrobat, Photoshop, Lightroom, etc.
- First category (Adobe Acrobat) is auto-selected

**Step 3:** User selects desired category
- User can select any category under Adobe
- Selected category is saved with the product

**Step 4:** User selects "Ebook" brand
- Brand dropdown: Ebook (now selected)
- Category dropdown shows: "No categories available"
- Category dropdown is disabled
- Category value is empty

### Scenario 2: Editing Existing Product

**Step 1:** User clicks edit on a product (e.g., AutoCAD 2025)
- Brand dropdown shows: Autodesk (pre-selected from product data)
- Category dropdown shows: AutoCAD categories
- Product's category (e.g., "AutoCAD") is pre-selected

**Step 2:** User can change brand
- If user changes brand, categories update accordingly
- If new brand doesn't have the old category, first available category is selected

## Brand-Category Matrix

| Brand                    | Number of Categories | Sample Categories                           |
|--------------------------|----------------------|---------------------------------------------|
| Autodesk                 | 14                   | AutoCAD, Revit, Maya, Civil 3D             |
| Microsoft                | 4                    | Microsoft 365, Projects, Server             |
| Adobe                    | 7                    | Photoshop, Illustrator, Acrobat            |
| Coreldraw                | 2                    | Graphics Suite, Technical Suite             |
| Antivirus                | 6                    | Norton, McAfee, Quick Heal, ESET           |
| Structural Softwares     | 4                    | E-Tab, Safe, Sap 2000, Tekla               |
| Architectural Softwares  | 4                    | Lumion, Twin Motion, D5 Render             |
| Ebook                    | 0                    | (No categories - shows disabled dropdown)   |

## Dropdown Behavior

### Brand Dropdown
```html
<select value="autodesk" required>
  <option value="autodesk">Autodesk</option>
  <option value="microsoft">Microsoft</option>
  <option value="adobe">Adobe</option>
  <option value="coreldraw">Coreldraw</option>
  <option value="antivirus">Antivirus</option>
  <option value="structural-softwares">Structural Softwares</option>
  <option value="architectural-softwares">Architectural Softwares</option>
  <option value="ebook">Ebook</option>
</select>
```

### Category Dropdown (When Autodesk is selected)
```html
<select value="autocad" required>
  <option value="autocad">AutoCAD</option>
  <option value="3ds-max">3ds MAX</option>
  <option value="revit">Revit</option>
  <option value="maya">Maya</option>
  <option value="fusion">Fusion</option>
  <option value="navisworks-manage">Navisworks Manage</option>
  <option value="inventor-professional">Inventor Professional</option>
  <option value="autocad-lt">AutoCAD LT</option>
  <option value="aec-collection">AEC Collection</option>
  <option value="civil-3d">Civil 3D</option>
  <option value="map-3d">Map 3D</option>
  <option value="autocad-mechanical">AutoCAD Mechanical</option>
  <option value="autocad-electrical">AutoCAD Electrical</option>
  <option value="autocad-mep">AutoCAD MEP</option>
</select>
```

### Category Dropdown (When Ebook is selected)
```html
<select value="" required disabled>
  <option value="">No categories available</option>
</select>
```

## Validation Rules

1. **Brand**: Required field
   - Must be selected from the 8 available brands
   - Cannot be empty
   - Error message: "Product Brand is required"

2. **Category**: Required field (except for Ebook)
   - Must be selected from available categories under chosen brand
   - Cannot be empty (except for Ebook brand)
   - Automatically resets when brand changes
   - Error message: "Product Category is required"

## Examples

### Example 1: Creating Photoshop Product
```
Brand: Adobe
Category: Photoshop
Product Name: Adobe Photoshop 2025
Version: 2025.1
```

### Example 2: Creating AutoCAD Product
```
Brand: Autodesk
Category: AutoCAD
Product Name: AutoCAD 2025
Version: 2025.1
```

### Example 3: Creating Norton Antivirus Product
```
Brand: Antivirus
Category: Norton
Product Name: Norton 360 Deluxe
Version: 22.0
```

### Example 4: Creating Microsoft Office Product
```
Brand: Microsoft
Category: Microsoft 365
Product Name: Microsoft 365 Business
Version: 2025
```

## API Data Structure

When product is saved, the following structure is sent to backend:

```json
{
  "name": "AutoCAD 2025",
  "version": "2025.1",
  "brand": "autodesk",
  "company": "autodesk",  // For backward compatibility
  "category": "autocad",
  "shortDescription": "...",
  // ... other fields
}
```

## Notes

- Category dropdown is **dependent** on Brand selection
- When Brand changes, Category automatically resets to the first available option
- Ebook brand has no categories - this is intentional for future use
- All values are stored in kebab-case format (e.g., "autocad-lt", "microsoft-365")
- Labels are displayed in human-readable format (e.g., "AutoCAD LT", "Microsoft 365")
