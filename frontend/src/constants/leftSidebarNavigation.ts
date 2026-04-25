export interface LeftSidebarCategory {
  id: string;
  name: string;
  href?: string;
  subcategories?: { id: string; name: string; href: string }[];
}

export const leftSidebarNavigationCategories: LeftSidebarCategory[] = [
  {
    id: "autodesk",
    name: "Autodesk",
    href: "/autodesk",
    subcategories: [
      { id: "autocad", name: "AutoCAD", href: "/category?brand=autodesk&category=autocad" },
      { id: "3ds-max", name: "3ds MAX", href: "/category?brand=autodesk&category=3ds-max" },
      { id: "revit", name: "Revit", href: "/category?brand=autodesk&category=revit" },
      { id: "maya", name: "Maya", href: "/category?brand=autodesk&category=maya" },
      { id: "fusion", name: "Fusion", href: "/category?brand=autodesk&category=fusion" },
      { id: "navisworks-manage", name: "Navisworks Manage", href: "/category?brand=autodesk&category=navisworks-manage" },
      { id: "inventor-professional", name: "Inventor Professional", href: "/category?brand=autodesk&category=inventor-professional" },
      { id: "autocad-lt", name: "AutoCAD LT", href: "/category?brand=autodesk&category=autocad-lt" },
      { id: "aec-collection", name: "AEC Collection", href: "/category?brand=autodesk&category=aec-collection" },
      { id: "civil-3d", name: "Civil 3D", href: "/category?brand=autodesk&category=civil-3d" },
      { id: "map-3d", name: "Map 3D", href: "/category?brand=autodesk&category=map-3d" },
      { id: "autocad-mechanical", name: "AutoCAD Mechanical", href: "/category?brand=autodesk&category=autocad-mechanical" },
      { id: "autocad-electrical", name: "AutoCAD Electrical", href: "/category?brand=autodesk&category=autocad-electrical" },
      { id: "autocad-mep", name: "AutoCAD MEP", href: "/category?brand=autodesk&category=autocad-mep" },
    ],
  },
  {
    id: "microsoft",
    name: "Microsoft",
    href: "/microsoft",
    subcategories: [
      { id: "microsoft-365", name: "Microsoft 365", href: "/category?brand=microsoft&category=microsoft-365" },
      { id: "microsoft-professional", name: "Microsoft Professional", href: "/category?brand=microsoft&category=microsoft-professional" },
      { id: "visio-professional", name: "Visio Professional", href: "/category?brand=microsoft&category=visio-professional" },
      { id: "microsoft-projects", name: "Microsoft Projects", href: "/category?brand=microsoft&category=microsoft-projects" },
      { id: "server", name: "Server", href: "/category?brand=microsoft&category=server" },
      { id: "windows", name: "Windows", href: "/category?brand=microsoft&category=windows" },
    ],
  },
  {
    id: "adobe",
    name: "Adobe",
    href: "/adobe",
    subcategories: [
      { id: "adobe-acrobat", name: "Adobe Acrobat", href: "/category?brand=adobe&category=adobe-acrobat" },
      { id: "photoshop", name: "Photoshop", href: "/category?brand=adobe&category=photoshop" },
      { id: "lightroom", name: "Lightroom", href: "/category?brand=adobe&category=lightroom" },
      { id: "after-effect", name: "After Effect", href: "/category?brand=adobe&category=after-effect" },
      { id: "premier-pro", name: "Premier Pro", href: "/category?brand=adobe&category=premier-pro" },
      { id: "illustrator", name: "Illustrator", href: "/category?brand=adobe&category=illustrator" },
      { id: "adobe-creative-cloud", name: "Adobe Creative Cloud", href: "/category?brand=adobe&category=adobe-creative-cloud" },
    ],
  },
  {
    id: "coreldraw",
    name: "Coreldraw",
    href: "/category?brand=coreldraw",
    subcategories: [
      { id: "coreldraw-graphics-suite", name: "Coreldraw Graphics Suite", href: "/category?brand=coreldraw&category=coreldraw-graphics-suite" },
      { id: "coreldraw-technical-suite", name: "Coreldraw Technical Suite", href: "/category?brand=coreldraw&category=coreldraw-technical-suite" },
    ],
  },
  {
    id: "antivirus",
    name: "Antivirus",
    href: "/antivirus",
    subcategories: [
      { id: "k7-security", name: "K7 Security", href: "/category?brand=antivirus&category=k7-security" },
      { id: "quick-heal", name: "Quick Heal", href: "/category?brand=antivirus&category=quick-heal" },
      { id: "hyper-say", name: "Hyper Say", href: "/category?brand=antivirus&category=hyper-say" },
      { id: "norton", name: "Norton", href: "/category?brand=antivirus&category=norton" },
      { id: "mcafee", name: "McAfee", href: "/category?brand=antivirus&category=mcafee" },
      { id: "eset", name: "ESET", href: "/category?brand=antivirus&category=eset" },
    ],
  },
  {
    id: "projects",
    name: "Projects",
    href: "/projects",
    subcategories: [
      { id: "autocad-files", name: "Autocad Files", href: "/category?brand=projects&category=autocad-files" },
      { id: "3ds-max-files", name: "3ds Max Files", href: "/category?brand=projects&category=3ds-max-files" },
      { id: "revit-files", name: "Revit Files", href: "/category?brand=projects&category=revit-files" },
      { id: "excel-sheet-files", name: "Excel Sheet Files", href: "/category?brand=projects&category=excel-sheet-files" },
      { id: "photoshop-files", name: "Photoshop Files", href: "/category?brand=projects&category=photoshop-files" },
      { id: "after-effects-files", name: "After Effects Files", href: "/category?brand=projects&category=after-effects-files" },
      { id: "premier-pro-files", name: "Premier Pro Files", href: "/category?brand=projects&category=premier-pro-files" },
      { id: "lumion-files", name: "Lumion Files", href: "/category?brand=projects&category=lumion-files" },
      { id: "others-files", name: "Others Files", href: "/category?brand=projects&category=others-files" },
    ],
  },
  {
    id: "structural-softwares",
    name: "Structural Softwares",
    href: "/category?brand=structural-softwares",
    subcategories: [
      { id: "e-tab", name: "E-Tab", href: "/category?brand=structural-softwares&category=e-tab" },
      { id: "safe", name: "Safe", href: "/category?brand=structural-softwares&category=safe" },
      { id: "sap-2000", name: "Sap 2000", href: "/category?brand=structural-softwares&category=sap-2000" },
      { id: "tekla", name: "Tekla", href: "/category?brand=structural-softwares&category=tekla" },
    ],
  },
  {
    id: "architectural-softwares",
    name: "Architectural Softwares",
    href: "/category?brand=architectural-softwares",
    subcategories: [
      { id: "lumion", name: "Lumion", href: "/category?brand=architectural-softwares&category=lumion" },
      { id: "twin-motion", name: "Twin Motion", href: "/category?brand=architectural-softwares&category=twin-motion" },
      { id: "d5-render", name: "D5 Render", href: "/category?brand=architectural-softwares&category=d5-render" },
      { id: "archi-cad", name: "Archi CAD", href: "/category?brand=architectural-softwares&category=archi-cad" },
      { id: "sketch-up", name: "Sketch Up", href: "/category?brand=architectural-softwares&category=sketch-up" },
    ],
  },
  {
    id: "accounting-billing",
    name: "Accounting and Billing",
    href: "/category?brand=accounting-billing",
    subcategories: [
      { id: "tally", name: "Tally", href: "/category?brand=accounting-billing&category=tally" },
      { id: "vyapar", name: "Vyapar", href: "/category?brand=accounting-billing&category=vyapar" },
    ],
  },
  {
    id: "ebook",
    name: "Ebook",
    href: "/category?brand=ebook",
    subcategories: [
      { id: "civil-engineering", name: "Civil Engineering", href: "/category?brand=ebook&category=civil-engineering" },
      { id: "ai-prompts", name: "AI Prompts", href: "/category?brand=ebook&category=ai-prompts" },
    ],
  },
  {
    id: "recovery-softwares",
    name: "Recovery Softwares",
    href: "/category?brand=recovery-softwares",
  },
  {
    id: "3d-rendering-software",
    name: "3D Rendering Software",
    href: "/category?brand=3d-rendering-software",
  },
  {
    id: "about",
    name: "About Us",
    href: "/about",
  },
  {
    id: "contact",
    name: "Contact",
    href: "/contact",
  },
  {
    id: "sitemap",
    name: "Site Map",
    href: "/sitemap",
  },
];
