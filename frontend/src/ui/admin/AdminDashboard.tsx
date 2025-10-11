// ui/admin/AdminDashboard.tsx
import React, { useState } from 'react';
import {
  BarChart3,
  Package,
  Tag,
  Building2,
  ShoppingCart,
  Settings as SettingsIcon,
  Users,Image ,TicketPercent,
} from 'lucide-react';
import Dashboard from './Dashboard';
import Products from './products/Products';
import Categories from './Categories';
import Companies from './Companies';
import Orders from './Orders';
import Settings from './Settings';
import UserManagement from './users/UserManagement';
import { useAdminTheme } from '../../contexts/AdminThemeContext';
import Banner from './Banner';
import Coupons from '../admin/coupons/Coupons';
type MenuType = 'dashboard'|'users' | 'products' | 'categories' | 'companies' | 'orders' | 'settings' | 'banner' | 'coupons';

const AdminDashboardContent: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<MenuType>('dashboard');
  const { colors } = useAdminTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'banner', label: 'Banner', icon: Image },
    { id: 'coupons', label: 'Coupons', icon: TicketPercent },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'products':
        return <Products />;
      case 'categories':
        return <Categories />;
      case 'companies':
        return <Companies />;
      case 'orders':
        return <Orders />;
        case 'banner': 
        return <Banner />;
      case 'coupons':
        return <Coupons />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: colors.background.primary }}
    >
      {/* Header */}
      <div
        className="shadow-xl transition-colors duration-200"
        style={{
          backgroundColor: colors.background.tertiary,
          borderBottomColor: colors.border.primary,
          borderBottomWidth: '1px'
        }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1
                className="text-2xl font-bold transition-colors duration-200"
                style={{ color: colors.text.primary }}
              >
                Admin Dashboard
              </h1>
              <p
                className="transition-colors duration-200"
                style={{ color: colors.text.secondary }}
              >
                Manage your e-commerce platform
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-6">
          <nav className="flex space-x-8 overflow-x-auto">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id as MenuType)}
                  className="flex items-center space-x-2 py-4 border-b-2 transition-colors whitespace-nowrap"
                  style={{
                    borderBottomColor: isActive ? colors.interactive.primary : 'transparent',
                    color: isActive ? colors.interactive.primary : colors.text.secondary,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = colors.text.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = colors.text.secondary;
                    }
                  }}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  return <AdminDashboardContent />;
};

export default AdminDashboard;