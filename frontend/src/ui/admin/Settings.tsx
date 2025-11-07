import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

const Settings: React.FC = () => {
  const { colors } = useAdminTheme();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        Settings
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text.primary }}
          >
            General Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: colors.text.secondary }}
              >
                Platform Name
              </label>
              <input
                type="text"
                defaultValue="E-commerce Platform"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.interactive.primary;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border.primary;
                }}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: colors.text.secondary }}
              >
                Admin Email
              </label>
              <input
                type="email"
                defaultValue="admin@platform.com"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.interactive.primary;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border.primary;
                }}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: colors.text.secondary }}
              >
                Currency
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.interactive.primary;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border.primary;
                }}
              >
                <option>INR (₹)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text.primary }}
          >
            Notification Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span style={{ color: colors.text.primary }}>
                Email Notifications
              </span>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4"
                style={{ accentColor: colors.interactive.primary }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: colors.text.primary }}>Order Alerts</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4"
                style={{ accentColor: colors.interactive.primary }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: colors.text.primary }}>
                Low Stock Alerts
              </span>
              <input
                type="checkbox"
                className="w-4 h-4"
                style={{ accentColor: colors.interactive.primary }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: colors.text.primary }}>
                User Registration
              </span>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4"
                style={{ accentColor: colors.interactive.primary }}
              />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text.primary }}
          >
            Security
          </h3>
          <div className="space-y-4">
            <button
              className="w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200"
              style={{
                backgroundColor: colors.interactive.primary,
                color: colors.text.inverse,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.interactive.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.interactive.primary;
              }}
            >
              Change Password
            </button>
            <button
              className="w-full py-2 px-4 rounded-lg transition-colors duration-200"
              style={{
                backgroundColor: colors.interactive.secondary,
                color: colors.text.primary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.interactive.secondaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.interactive.secondary;
              }}
            >
              Two-Factor Authentication
            </button>
            <button
              className="w-full py-2 px-4 rounded-lg transition-colors duration-200"
              style={{
                backgroundColor: colors.status.error,
                color: colors.text.inverse,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Clear Cache
            </button>
          </div>
        </div>

        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text.primary }}
          >
            System Info
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: colors.text.secondary }}>Version:</span>
              <span style={{ color: colors.text.primary }}>v2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: colors.text.secondary }}>Last Update:</span>
              <span style={{ color: colors.text.primary }}>Sept 10, 2024</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: colors.text.secondary }}>Database:</span>
              <span style={{ color: colors.status.success }}>Connected</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: colors.text.secondary }}>Storage:</span>
              <span style={{ color: colors.text.primary }}>2.4GB / 10GB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
