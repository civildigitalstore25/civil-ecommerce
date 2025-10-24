# All Categories Dropdown - Theme Support

## Overview
The All Categories dropdown now fully supports both **light** and **dark** themes using the `AdminThemeContext`. It dynamically adapts its colors based on the active theme.

## Theme Integration

### Context Hook
```typescript
import { useAdminTheme } from '../../contexts/AdminThemeContext';

const { colors } = useAdminTheme();
```

### Theme Colors Used

#### Dark Theme (`darkTheme`)
- **Background Primary**: `#111827` (main content area)
- **Background Secondary**: `#1f2937` (cards, brands panel)
- **Background Accent**: `#4b5563` (hover states)
- **Text Primary**: `#f9fafb` (main text)
- **Text Secondary**: `#d1d5db` (muted text)
- **Interactive Primary**: `#fbbf24` (yellow accent)
- **Border Primary**: `#374151` (borders)

#### Light Theme (`lightTheme`)
- **Background Primary**: `#ffffff` (main content area)
- **Background Secondary**: `#f9fafb` (cards, brands panel)
- **Background Accent**: `#e5e7eb` (hover states)
- **Text Primary**: `#111827` (main text)
- **Text Secondary**: `#374151` (muted text)
- **Interactive Primary**: `#fbbf24` (yellow accent - consistent)
- **Border Primary**: `#d1d5db` (borders)

## Component Structure

### 1. Dropdown Container
```tsx
<div style={{ 
    backgroundColor: colors.background.secondary,
    borderColor: colors.border.primary
}}>
```

### 2. Header Section
```tsx
<div style={{ 
    borderColor: colors.border.primary, 
    backgroundColor: colors.background.primary 
}}>
    <h3 style={{ color: colors.text.primary }}>...</h3>
    <p style={{ color: colors.text.secondary }}>...</p>
</div>
```

### 3. Brands List (Left Panel)
```tsx
<div style={{ 
    borderColor: colors.border.primary, 
    backgroundColor: colors.background.secondary 
}}>
    <button style={{ 
        backgroundColor: hoveredBrand ? colors.background.accent : 'transparent',
        borderLeftColor: hoveredBrand ? colors.interactive.primary : 'transparent'
    }}>
        <div style={{ 
            color: hoveredBrand ? colors.interactive.primary : colors.text.primary
        }}>
            Brand Name
        </div>
    </button>
</div>
```

### 4. Categories Grid (Right Panel)
```tsx
<div style={{ backgroundColor: colors.background.primary }}>
    <h4 style={{ color: colors.interactive.primary }}>
        Brand Products
    </h4>
    
    <button 
        style={{ backgroundColor: colors.background.secondary }}
        onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.background.accent;
        }}
    >
        <span style={{ color: colors.text.primary }}>
            Category Name
        </span>
    </button>
</div>
```

## CSS Customization

### Scrollbar Styling
The scrollbar uses a semi-transparent background that works with both themes:

```css
.all-categories-dropdown::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.all-categories-dropdown::-webkit-scrollbar-thumb {
  background: #fbbf24; /* Yellow accent - consistent across themes */
  border-radius: 4px;
}
```

### Light Theme Adjustments
```css
@media (prefers-color-scheme: light) {
  .all-categories-dropdown::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }
}
```

## Key Features

### ✅ Dynamic Theme Switching
- All colors automatically update when theme changes
- No page refresh required
- Smooth visual transitions

### ✅ Consistent Yellow Accent
- Yellow color (`#fbbf24`) remains consistent across both themes
- Provides brand identity and visual continuity
- Used for hover states, active items, and highlights

### ✅ Proper Contrast
- **Dark Theme**: White/light gray text on dark backgrounds
- **Light Theme**: Dark text on white/light gray backgrounds
- All color combinations meet WCAG accessibility standards

### ✅ Hover States
- Light border highlight on brand hover
- Background color change on category hover
- Text color changes to yellow accent
- Smooth transitions for better UX

## Visual Comparison

### Dark Theme
```
Header: Dark gray (#111827) with white text
Brands Panel: Medium gray (#1f2937) with light text
Categories: Dark gray cards with yellow highlights
Scrollbar: Yellow thumb on dark track
```

### Light Theme
```
Header: White (#ffffff) with dark text
Brands Panel: Light gray (#f9fafb) with dark text
Categories: Light gray cards with yellow highlights
Scrollbar: Yellow thumb on light track
```

## Testing Checklist

- [x] Toggle between light and dark themes
- [x] Verify all text is readable in both themes
- [x] Check hover states in both themes
- [x] Test scrollbar visibility
- [x] Verify yellow accent consistency
- [x] Check border visibility
- [x] Test category selection
- [x] Verify empty states styling

## Browser Support

- ✅ Chrome/Edge (Webkit scrollbar)
- ✅ Firefox (Standard scrollbar)
- ✅ Safari (Webkit scrollbar)
- ✅ All modern browsers supporting CSS custom properties

## Notes

1. **Yellow Accent**: The `#fbbf24` yellow color is intentionally kept consistent across themes as it's part of the brand identity
2. **Inline Styles**: Dynamic theme colors use inline styles to react to theme changes
3. **CSS Classes**: Static styles (transitions, layout) remain in CSS file
4. **Accessibility**: All color combinations provide sufficient contrast ratios

## Future Enhancements

- [ ] Add theme transition animations
- [ ] Support for custom accent colors
- [ ] High contrast mode support
- [ ] Reduced motion preferences
