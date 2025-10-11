import React from 'react';
import { Plus, Eye, Edit, Trash2, Building2 } from 'lucide-react';
import { useAdminTheme } from '../../contexts/AdminThemeContext';

// Types
interface Company {
  id: number;
  name: string;
  products: number;
}

// Sample data
const sampleCompanies: Company[] = [
  { id: 1, name: "Autodesk", products: 4 },
  { id: 2, name: "Microsoft", products: 3 },
  { id: 3, name: "Trimble", products: 2 },
  { id: 4, name: "Adobe", products: 2 },
  { id: 5, name: "ANSYS", products: 1 }
];

const Companies: React.FC = () => {
  const { colors } = useAdminTheme();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2
          className="text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          Companies
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
          <span>Add Company</span>
        </button>
      </div>

      <div
        className="rounded-xl shadow-xl border overflow-hidden transition-colors duration-200"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary
        }}
      >
        <table className="w-full">
          <thead
            className="border-b transition-colors duration-200"
            style={{
              backgroundColor: colors.background.tertiary,
              borderBottomColor: colors.border.primary
            }}
          >
            <tr>
              <th
                className="text-left py-3 px-4 font-medium"
                style={{ color: colors.text.primary }}
              >
                Company Name
              </th>
              <th
                className="text-left py-3 px-4 font-medium"
                style={{ color: colors.text.primary }}
              >
                Products
              </th>
              <th
                className="text-left py-3 px-4 font-medium"
                style={{ color: colors.text.primary }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            className="divide-y transition-colors duration-200"
            style={{ borderColor: colors.border.secondary }}
          >
            {sampleCompanies.map((company) => (
              <tr
                key={company.id}
                className="transition-colors duration-200"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.background.accent}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: colors.interactive.primary,
                        color: colors.text.inverse
                      }}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {company.name}
                    </div>
                  </div>
                </td>
                <td
                  className="py-4 px-4"
                  style={{ color: colors.text.primary }}
                >
                  {company.products}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-1 transition-colors duration-200"
                      style={{ color: colors.text.secondary }}
                      onMouseEnter={(e) => e.currentTarget.style.color = colors.interactive.primary}
                      onMouseLeave={(e) => e.currentTarget.style.color = colors.text.secondary}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Companies;