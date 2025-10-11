# Admin Dashboard Theme System

This document describes the theme system implemented for the admin dashboard.

## Overview

The admin dashboard now supports both light and dark themes with a smooth toggle between them. The theme system is built using React Context and provides consistent styling across all admin components.

## Features

- **Dynamic Theme Switching**: Toggle between light and dark themes
- **Persistent Theme**: Theme preference is saved in localStorage
- **Smooth Transitions**: All color changes have smooth animations
- **Consistent Colors**: Centralized color scheme for easy maintenance
- **Responsive Design**: Theme works across all screen sizes

## Usage

### Basic Implementation

```tsx
import { useAdminTheme } from '../../contexts/AdminThemeContext';

const MyComponent: React.FC = () => {
  const { colors, theme, toggleTheme } = useAdminTheme();
  
  return (
    <div style={{ backgroundColor: colors.background.primary }}>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
      </button>
    </div>
  );
};
```

### Using Theme Utility Hook

```tsx
import { useAdminThemeStyles } from '../hooks/useAdminThemeStyles';

const MyCard: React.FC = () => {
  const { cardStyle, buttonStyle } = useAdminThemeStyles();
  
  return (
    <div style={cardStyle()}>
      <button style={buttonStyle('primary')}>Primary Button</button>
    </div>
  );
};
```

## Theme Structure

### Color Scheme

The theme system defines colors in four main categories:

1. **Background Colors**
   - `primary`: Main background
   - `secondary`: Cards, panels
   - `tertiary`: Headers, navigation
   - `accent`: Highlighted areas

2. **Text Colors**
   - `primary`: Main text
   - `secondary`: Muted text
   - `accent`: Highlighted text
   - `inverse`: Contrast text

3. **Border Colors**
   - `primary`: Main borders
   - `secondary`: Subtle borders
   - `accent`: Active/highlighted borders

4. **Status Colors**
   - `success`: Green for success states
   - `warning`: Yellow for warning states
   - `error`: Red for error states
   - `info`: Blue for informational states

5. **Interactive Colors**
   - `primary`: Primary buttons, links
   - `primaryHover`: Hover state for primary elements
   - `secondary`: Secondary buttons
   - `secondaryHover`: Hover state for secondary elements

### Light Theme

- Clean white backgrounds with subtle grays
- Dark text for excellent readability
- Blue accent colors for interactive elements

### Dark Theme

- Dark gray backgrounds for reduced eye strain
- Light text for contrast
- Yellow/amber accent colors for visual appeal

## Components Updated

The following admin components have been updated to use the theme system:

- **AdminDashboard**: Main wrapper with theme provider and toggle
- **Dashboard**: Stats cards and overview sections
- **Products**: Product listing and management
- **ProductViewModal**: Product detail modal
- **UserManagement**: User listing and management

## File Structure

```
src/
├── contexts/
│   └── AdminThemeContext.tsx      # Theme context and provider
├── components/
│   └── ThemeToggle/
│       └── AdminThemeToggle.tsx   # Theme toggle component
├── hooks/
│   └── useAdminThemeStyles.ts     # Theme utility hooks
├── styles/
│   └── adminTheme.css            # Global theme styles
└── ui/admin/
    ├── AdminDashboard.tsx        # Updated with theme support
    ├── Dashboard.tsx             # Updated with theme support
    └── products/
        ├── Products.tsx          # Updated with theme support
        └── ProductViewModal.tsx  # Updated with theme support
```

## Implementation Details

### Theme Provider Setup

The `AdminThemeProvider` wraps the entire admin dashboard and provides theme context to all child components:

```tsx
const AdminDashboard: React.FC = () => {
  return (
    <AdminThemeProvider>
      <AdminDashboardContent />
    </AdminThemeProvider>
  );
};
```

### Theme Toggle

The theme toggle button is located in the admin dashboard header and allows users to switch between light and dark themes instantly.

### Persistence

Theme preference is automatically saved to `localStorage` and restored when the user revisits the admin dashboard.

## Best Practices

1. **Use Theme Colors**: Always use colors from the theme context instead of hardcoded colors
2. **Add Transitions**: Include `transition-colors duration-200` for smooth color changes
3. **Test Both Themes**: Ensure components look good in both light and dark themes
4. **Use Utility Hooks**: Leverage `useAdminThemeStyles` for common styling patterns
5. **Consistent Spacing**: Maintain consistent spacing and layout regardless of theme

## Troubleshooting

### Theme Not Applying

- Ensure component is wrapped in `AdminThemeProvider`
- Check that `useAdminTheme` hook is called within a provider
- Verify TypeScript imports are correct

### Colors Not Updating

- Check that inline styles are used for dynamic colors
- Ensure CSS classes don't override theme colors
- Add transition classes for smooth color changes

### Performance Issues

- Theme changes should be instantaneous
- If performance is slow, check for unnecessary re-renders
- Optimize component dependencies on theme context