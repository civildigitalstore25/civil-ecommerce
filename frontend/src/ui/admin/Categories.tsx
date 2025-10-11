import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAdminTheme } from '../../contexts/AdminThemeContext';

// Types
interface Category {
  id: number;
  name: string;
  products: number;
  icon: string;
}

// Sample data
const sampleCategories: Category[] = [
  { id: 1, name: "CAD Software", products: 4, icon: "📐" },
  { id: 2, name: "BIM Software", products: 1, icon: "🏢" },
  { id: 3, name: "Design Software", products: 3, icon: "🎨" },
  { id: 4, name: "Rendering", products: 2, icon: "🖼️" },
  { id: 5, name: "Simulation", products: 2, icon: "⚙️" },
  { id: 6, name: "Structural Analysis", products: 1, icon: "🏗️" }
];

const Categories: React.FC = () => {
  const { colors } = useAdminTheme();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2
          className="text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          Categories
        </h2>
        <button
          className="px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors duration-200"
          style={{
            backgroundColor: colors.interactive.primary,
            color: colors.text.inverse
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.interactive.primaryHover}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.interactive.primary}
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleCategories.map((category) => (
          <div
            key={category.id}
            className="rounded-xl p-6 shadow-xl border transition-colors duration-200"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.background.accent }}
              >
                <span className="text-2xl">{category.icon}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-1 transition-colors duration-200"
                  style={{ color: colors.text.secondary }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.status.success}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.text.secondary}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-1 transition-colors duration-200"
                  style={{ color: colors.text.secondary }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.status.error}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.text.secondary}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3
              className="font-semibold mb-2"
              style={{ color: colors.text.primary }}
            >
              {category.name}
            </h3>
            <p style={{ color: colors.text.secondary }}>
              {category.products} products
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;