export interface AutodeskProduct {
  name: string;
  href: string;
}

export interface AutodeskCategory {
  name: string;
  products: AutodeskProduct[];
}

export const autodeskCategories: AutodeskCategory[] = [
  {
    name: "Design & CAD Software",
    products: [
      { name: "AutoCAD", href: "/category?brand=autodesk&category=autocad" },
      {
        name: "AutoCAD LT",
        href: "/category?brand=autodesk&category=autocad-lt",
      },
      {
        name: "AutoCAD Mechanical",
        href: "/category?brand=autodesk&category=autocad-mechanical",
      },
      {
        name: "AutoCAD Electrical",
        href: "/category?brand=autodesk&category=autocad-electrical",
      },
      {
        name: "AutoCAD MEP",
        href: "/category?brand=autodesk&category=autocad-mep",
      },
    ],
  },
  {
    name: "3D Modeling & Animation",
    products: [
      { name: "3ds MAX", href: "/category?brand=autodesk&category=3ds-max" },
      { name: "Maya", href: "/category?brand=autodesk&category=maya" },
      { name: "Revit", href: "/category?brand=autodesk&category=revit" },
    ],
  },
  {
    name: "Engineering & Manufacturing",
    products: [
      { name: "Fusion", href: "/category?brand=autodesk&category=fusion" },
      {
        name: "Inventor Professional",
        href: "/category?brand=autodesk&category=inventor-professional",
      },
      { name: "Civil 3D", href: "/category?brand=autodesk&category=civil-3d" },
      { name: "Map 3D", href: "/category?brand=autodesk&category=map-3d" },
    ],
  },
  {
    name: "Collections & Management",
    products: [
      {
        name: "AEC Collection",
        href: "/category?brand=autodesk&category=aec-collection",
      },
      {
        name: "Navisworks Manage",
        href: "/category?brand=autodesk&category=navisworks-manage",
      },
    ],
  },
];
