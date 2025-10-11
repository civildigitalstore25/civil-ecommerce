import React from 'react';
import { TrendingUp, Users, Package2, BarChart3 } from 'lucide-react';
import type { Category, Company } from '../../types';
import { useAdminTheme } from '../../contexts/AdminThemeContext';

const Dashboard: React.FC = () => {
  const { colors } = useAdminTheme();

  const sampleCategories: Category[] = [
    { id: 1, name: "CAD Software", products: 4, icon: "📐" },
    { id: 2, name: "BIM Software", products: 1, icon: "🏢" },
    { id: 3, name: "Design Software", products: 3, icon: "🎨" },
    { id: 4, name: "Rendering", products: 2, icon: "🖼️" },
    { id: 5, name: "Simulation", products: 2, icon: "⚙️" },
    { id: 6, name: "Structural Analysis", products: 1, icon: "🏗️" }
  ];

  const sampleCompanies: Company[] = [
    { id: 1, name: "Autodesk", products: 4 },
    { id: 2, name: "Microsoft", products: 3 },
    { id: 3, name: "Trimble", products: 2 },
    { id: 4, name: "Adobe", products: 2 },
    { id: 5, name: "ANSYS", products: 1 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: colors.text.secondary }}
              >
                Total Revenue
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: colors.text.primary }}
              >
                ₹12,54,300
              </p>
              <p
                className="text-sm flex items-center mt-1"
                style={{ color: colors.status.success }}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5%
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.background.accent }}
            >
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: colors.text.secondary }}
              >
                Total Products
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: colors.text.primary }}
              >
                15
              </p>
              <p
                className="text-sm"
                style={{ color: colors.interactive.primary }}
              >
                10 Categories
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.background.accent }}
            >
              <Package2
                className="w-6 h-6"
                style={{ color: colors.interactive.primary }}
              />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: colors.text.secondary }}
              >
                Registered Users
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: colors.text.primary }}
              >
                347
              </p>
              <p
                className="text-sm"
                style={{ color: colors.status.success }}
              >
                Active Today: 89
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.background.accent }}
            >
              <Users
                className="w-6 h-6"
                style={{ color: colors.status.success }}
              />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: colors.text.secondary }}
              >
                Total Orders
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: colors.text.primary }}
              >
                1,286
              </p>
              <p
                className="text-sm"
                style={{ color: colors.status.success }}
              >
                Today: 23 orders
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.background.accent }}
            >
              <BarChart3
                className="w-6 h-6"
                style={{ color: colors.status.warning }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text.primary }}
          >
            Product Categories
          </h3>
          <div className="space-y-3">
            {sampleCategories.slice(0, 2).map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <span
                    className="font-medium"
                    style={{ color: colors.text.primary }}
                  >
                    {category.name}
                  </span>
                </div>
                <span
                  className="text-sm"
                  style={{ color: colors.text.secondary }}
                >
                  {category.products} products
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text.primary }}
          >
            Top Companies
          </h3>
          <div className="space-y-3">
            {sampleCompanies.slice(0, 3).map((company) => (
              <div key={company.id} className="flex items-center justify-between">
                <span
                  className="font-medium"
                  style={{ color: colors.text.primary }}
                >
                  {company.name}
                </span>
                <span
                  className="text-sm"
                  style={{ color: colors.text.secondary }}
                >
                  {company.products} products
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;