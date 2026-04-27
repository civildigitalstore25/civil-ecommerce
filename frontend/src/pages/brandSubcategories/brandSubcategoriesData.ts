import type { BrandData } from "./brandSubcategoriesTypes";

/** Brand landing data aligned with header mega-menu categories. */
export const brandSubcategoriesBySlug: Record<string, BrandData> = {
  autodesk: {
    name: "autodesk",
    displayName: "Autodesk",
    description: "Explore Autodesk software tools designed for every industry",
    subcategories: [
      {
        name: "Design & CAD Software",
        category: "autocad",
        displayName: "AutoCAD",
      },
      {
        name: "Design & CAD Software",
        category: "autocad-lt",
        displayName: "AutoCAD LT",
      },
      {
        name: "Design & CAD Software",
        category: "autocad-mechanical",
        displayName: "AutoCAD Mechanical",
      },
      {
        name: "Design & CAD Software",
        category: "autocad-electrical",
        displayName: "AutoCAD Electrical",
      },
      {
        name: "Design & CAD Software",
        category: "autocad-mep",
        displayName: "AutoCAD MEP",
      },
      {
        name: "3D Modeling & Animation",
        category: "3ds-max",
        displayName: "3ds MAX",
      },
      {
        name: "3D Modeling & Animation",
        category: "maya",
        displayName: "Maya",
      },
      {
        name: "3D Modeling & Animation",
        category: "revit",
        displayName: "Revit",
      },
      {
        name: "Engineering & Manufacturing",
        category: "fusion",
        displayName: "Fusion",
      },
      {
        name: "Engineering & Manufacturing",
        category: "inventor-professional",
        displayName: "Inventor Professional",
      },
      {
        name: "Engineering & Manufacturing",
        category: "civil-3d",
        displayName: "Civil 3D",
      },
      {
        name: "Engineering & Manufacturing",
        category: "map-3d",
        displayName: "Map 3D",
      },
      {
        name: "Collections & Management",
        category: "aec-collection",
        displayName: "AEC Collection",
      },
      {
        name: "Collections & Management",
        category: "navisworks-manage",
        displayName: "Navisworks Manage",
      },
    ],
  },
  microsoft: {
    name: "microsoft",
    displayName: "Microsoft",
    description:
      "Discover Microsoft software for every business and development need",
    subcategories: [
      {
        name: "Productivity & Collaboration",
        category: "microsoft-365",
        displayName: "Microsoft 365",
      },
      {
        name: "Productivity & Collaboration",
        category: "microsoft-professional",
        displayName: "Microsoft Professional",
      },
      {
        name: "Productivity & Collaboration",
        category: "visio-professional",
        displayName: "Visio Professional",
      },
      {
        name: "Project Management",
        category: "microsoft-projects",
        displayName: "Microsoft Projects",
      },
      {
        name: "Server & Enterprise",
        category: "server",
        displayName: "Server",
      },
      {
        name: "Operating Systems",
        category: "windows",
        displayName: "Windows",
      },
    ],
  },
  adobe: {
    name: "adobe",
    displayName: "Adobe",
    description: "Explore our complete range of Adobe software solutions",
    subcategories: [
      {
        name: "Document Management",
        category: "adobe-acrobat",
        displayName: "Adobe Acrobat",
      },
      {
        name: "Photography & Imaging",
        category: "photoshop",
        displayName: "Photoshop",
      },
      {
        name: "Photography & Imaging",
        category: "lightroom",
        displayName: "Lightroom",
      },
      {
        name: "Video Production",
        category: "after-effect",
        displayName: "After Effect",
      },
      {
        name: "Video Production",
        category: "premier-pro",
        displayName: "Premier Pro",
      },
      {
        name: "Design & Illustration",
        category: "illustrator",
        displayName: "Illustrator",
      },
      {
        name: "Design & Illustration",
        category: "adobe-creative-cloud",
        displayName: "Adobe Creative Cloud",
      },
    ],
  },
  antivirus: {
    name: "antivirus",
    displayName: "Antivirus",
    description: "Protect your devices with trusted antivirus software",
    subcategories: [
      {
        name: "Home & Personal Security",
        category: "k7-security",
        displayName: "K7 Security",
      },
      {
        name: "Home & Personal Security",
        category: "quick-heal",
        displayName: "Quick Heal",
      },
      {
        name: "Home & Personal Security",
        category: "norton",
        displayName: "Norton",
      },
      {
        name: "Business & Enterprise",
        category: "mcafee",
        displayName: "McAfee",
      },
      {
        name: "Business & Enterprise",
        category: "eset",
        displayName: "ESET",
      },
      {
        name: "Advanced Protection",
        category: "hyper-say",
        displayName: "Hyper Say",
      },
    ],
  },
  projects: {
    name: "projects",
    displayName: "Projects",
    description: "Download-ready project files for design, BIM, office, and media work",
    subcategories: [
      {
        name: "Files",
        category: "autocad-files",
        displayName: "Autocad Files",
      },
      {
        name: "Files",
        category: "3ds-max-files",
        displayName: "3ds Max Files",
      },
      {
        name: "Files",
        category: "revit-files",
        displayName: "Revit Files",
      },
      {
        name: "Files",
        category: "excel-sheet-files",
        displayName: "Excel Sheet Files",
      },
      {
        name: "Files",
        category: "photoshop-files",
        displayName: "Photoshop Files",
      },
      {
        name: "Files",
        category: "after-effects-files",
        displayName: "After Effects Files",
      },
      {
        name: "Files",
        category: "premier-pro-files",
        displayName: "Premier Pro Files",
      },
      {
        name: "Files",
        category: "lumion-files",
        displayName: "Lumion Files",
      },
      {
        name: "Files",
        category: "coreldraw-files",
        displayName: "Coreldraw Files",
      },
      {
        name: "Files",
        category: "sketchup-files",
        displayName: "SketchUp Files",
      },
      {
        name: "Files",
        category: "vray-files",
        displayName: "Vray Files",
      },
      {
        name: "Files",
        category: "others-files",
        displayName: "Others Files",
      },
    ],
  },
};
