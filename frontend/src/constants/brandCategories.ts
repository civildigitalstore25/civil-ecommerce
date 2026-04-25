export const brandCategories: Record<
  string,
  { label: string; categories: { value: string; label: string }[] }
> = {
  autodesk: {
    label: "Autodesk",
    categories: [
      { value: "autocad", label: "AutoCAD" },
      { value: "3ds-max", label: "3ds MAX" },
      { value: "revit", label: "Revit" },
      { value: "maya", label: "Maya" },
      { value: "fusion", label: "Fusion" },
      { value: "navisworks-manage", label: "Navisworks Manage" },
      { value: "inventor-professional", label: "Inventor Professional" },
      { value: "autocad-lt", label: "AutoCAD LT" },
      { value: "aec-collection", label: "AEC Collection" },
      { value: "civil-3d", label: "Civil 3D" },
      { value: "map-3d", label: "Map 3D" },
      { value: "autocad-mechanical", label: "AutoCAD Mechanical" },
      { value: "autocad-electrical", label: "AutoCAD Electrical" },
      { value: "autocad-mep", label: "AutoCAD MEP" },
    ],
  },
  microsoft: {
    label: "Microsoft",
    categories: [
      { value: "microsoft-365", label: "Microsoft 365" },
      { value: "microsoft-professional", label: "Microsoft Professional" },
      { value: "visio-professional", label: "Visio Professional" },
      { value: "microsoft-projects", label: "Microsoft Projects" },
      { value: "server", label: "Server" },
      { value: "windows", label: "Windows" },
    ],
  },
  adobe: {
    label: "Adobe",
    categories: [
      { value: "adobe-acrobat", label: "Adobe Acrobat" },
      { value: "photoshop", label: "Photoshop" },
      { value: "lightroom", label: "Lightroom" },
      { value: "after-effect", label: "After Effect" },
      { value: "premier-pro", label: "Premier Pro" },
      { value: "illustrator", label: "Illustrator" },
      { value: "adobe-creative-cloud", label: "Adobe Creative Cloud" },
    ],
  },
  coreldraw: {
    label: "Coreldraw",
    categories: [
      { value: "coreldraw-graphics-suite", label: "Coreldraw Graphics Suite" },
      { value: "coreldraw-technical-suite", label: "Coreldraw Technical Suite" },
    ],
  },
  antivirus: {
    label: "Antivirus",
    categories: [
      { value: "k7-security", label: "K7 Security" },
      { value: "quick-heal", label: "Quick Heal" },
      { value: "hyper-say", label: "Hyper Say" },
      { value: "norton", label: "Norton" },
      { value: "mcafee", label: "McAfee" },
      { value: "eset", label: "ESET" },
    ],
  },
  projects: {
    label: "Projects",
    categories: [
      { value: "autocad-files", label: "Autocad Files" },
      { value: "3ds-max-files", label: "3ds Max Files" },
      { value: "revit-files", label: "Revit Files" },
      { value: "excel-sheet-files", label: "Excel Sheet Files" },
      { value: "photoshop-files", label: "Photoshop Files" },
      { value: "after-effects-files", label: "After Effects Files" },
      { value: "premier-pro-files", label: "Premier Pro Files" },
      { value: "lumion-files", label: "Lumion Files" },
      { value: "others-files", label: "Others Files" },
    ],
  },
  "structural-softwares": {
    label: "Structural Softwares",
    categories: [
      { value: "e-tab", label: "E-Tab" },
      { value: "safe", label: "Safe" },
      { value: "sap-2000", label: "Sap 2000" },
      { value: "tekla", label: "Tekla" },
    ],
  },
  "architectural-softwares": {
    label: "Architectural Softwares",
    categories: [
      { value: "lumion", label: "Lumion" },
      { value: "twin-motion", label: "Twin Motion" },
      { value: "d5-render", label: "D5 Render" },
      { value: "archi-cad", label: "Archi CAD" },
      { value: "sketch-up", label: "Sketch Up" },
    ],
  },
  "accounting-billing": {
    label: "Billing and Accounting",
    categories: [
      { value: "tally", label: "Tally" },
      { value: "vyapar", label: "Vyapar" },
    ],
  },
  ebook: {
    label: "Ebook",
    categories: [
      { value: "civil-engineering", label: "Civil Engineering" },
      { value: "ai-prompts", label: "AI Prompts" },
    ],
  },
  "recovery-softwares": {
    label: "Recovery Softwares",
    categories: [],
  },
  "3d-rendering-software": {
    label: "3D Rendering Software",
    categories: [],
  },
};
