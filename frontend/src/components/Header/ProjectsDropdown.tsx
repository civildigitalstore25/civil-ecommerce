import React from "react";
import { ChevronRight } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface ProjectFileItem {
  name: string;
  href: string;
}

interface ProjectSection {
  name: string;
  products: ProjectFileItem[];
}

interface ProjectsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  buttonRef: React.RefObject<HTMLElement | null>;
}

const projectSections: ProjectSection[] = [
  {
    name: "Files",
    products: [
      {
        name: "Autocad Files",
        href: "/category?brand=projects&category=autocad-files",
      },
      {
        name: "3ds Max Files",
        href: "/category?brand=projects&category=3ds-max-files",
      },
      {
        name: "Revit Files",
        href: "/category?brand=projects&category=revit-files",
      },
      {
        name: "Excel Sheet Files",
        href: "/category?brand=projects&category=excel-sheet-files",
      },
      {
        name: "Photoshop Files",
        href: "/category?brand=projects&category=photoshop-files",
      },
      {
        name: "After Effects Files",
        href: "/category?brand=projects&category=after-effects-files",
      },
      {
        name: "Premier Pro Files",
        href: "/category?brand=projects&category=premier-pro-files",
      },
      {
        name: "Lumion Files",
        href: "/category?brand=projects&category=lumion-files",
      },
      {
        name: "Coreldraw Files",
        href: "/category?brand=projects&category=coreldraw-files",
      },
      {
        name: "SketchUp Files",
        href: "/category?brand=projects&category=sketchup-files",
      },
      {
        name: "Vray Files",
        href: "/category?brand=projects&category=vray-files",
      },
      {
        name: "Others Files",
        href: "/category?brand=projects&category=others-files",
      },
    ],
  },
];

const ProjectsDropdown: React.FC<ProjectsDropdownProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { colors } = useAdminTheme();
  const [hoveredSection, setHoveredSection] = React.useState<string | null>(
    "Files",
  );

  if (!isOpen) return null;

  const handleProductClick = (href: string) => {
    onNavigate(href);
    onClose();
  };

  return (
    <div
      className="absolute left-0 mt-[-1px] rounded-xl shadow-2xl z-50 overflow-hidden border w-[800px]"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex" style={{ minHeight: "400px", maxHeight: "600px" }}>
        <div
          className="w-80 border-r"
          style={{
            borderColor: colors.border.primary,
            backgroundColor: colors.background.secondary,
          }}
        >
          <div className="py-2">
            {projectSections.map((section, index) => (
              <button
                key={index}
                onMouseEnter={() => setHoveredSection(section.name)}
                onClick={() => setHoveredSection(section.name)}
                className="w-full px-6 py-4 text-left transition-all duration-200 flex items-center justify-between group border-l-4"
                style={{
                  backgroundColor:
                    hoveredSection === section.name
                      ? colors.background.accent
                      : "transparent",
                  borderLeftColor:
                    hoveredSection === section.name
                      ? colors.interactive.primary
                      : "transparent",
                }}
              >
                <div>
                  <div
                    className="font-semibold text-base mb-0.5"
                    style={{
                      color:
                        hoveredSection === section.name
                          ? colors.interactive.primary
                          : colors.text.primary,
                    }}
                  >
                    {section.name}
                  </div>
                  <div className="text-xs" style={{ color: colors.text.secondary }}>
                    {section.products.length} categories
                  </div>
                </div>
                <ChevronRight
                  className="w-5 h-5 transition-all"
                  style={{
                    color:
                      hoveredSection === section.name
                        ? colors.interactive.primary
                        : colors.text.secondary,
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <div
          className="flex-1 p-6 overflow-y-auto"
          style={{ backgroundColor: colors.background.primary }}
        >
          {hoveredSection ? (
            <>
              <h3
                className="text-lg font-bold mb-4 pb-2 border-b uppercase tracking-wide"
                style={{
                  color: colors.interactive.primary,
                  borderColor: colors.border.primary,
                }}
              >
                {hoveredSection}
              </h3>
              <ul className="space-y-2">
                {projectSections
                  .find((section) => section.name === hoveredSection)
                  ?.products.map((product, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => handleProductClick(product.href)}
                        className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group"
                        style={{ color: colors.text.secondary }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor =
                            colors.background.accent;
                          (e.currentTarget as HTMLElement).style.color =
                            colors.interactive.primary;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor =
                            "transparent";
                          (e.currentTarget as HTMLElement).style.color =
                            colors.text.secondary;
                        }}
                      >
                        <span className="font-medium">{product.name}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </li>
                  ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>

      <div
        className="px-6 py-4 border-t"
        style={{
          borderColor: colors.border.primary,
          backgroundColor: colors.background.primary,
        }}
      >
        <button
          onClick={() => {
            onNavigate("/projects");
            onClose();
          }}
          className="text-sm font-semibold transition-colors inline-flex items-center"
          style={{ color: colors.interactive.primary }}
        >
          View All Projects Files
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default ProjectsDropdown;
