import React from 'react';
import { useAdminTheme } from '../../contexts/AdminThemeContext';
import { getSortOptions } from '../../utils/orderUtils';

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = React.memo(({ value, onChange }) => {
  const { colors } = useAdminTheme();
  const sortOptions = getSortOptions();

  return (
    <div className="flex items-center gap-2">
      <span 
        className="text-sm font-medium"
        style={{ color: colors.text.secondary }}
      >
        Sort by :
      </span>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors duration-200"
        style={{ 
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
          color: colors.text.primary
        }}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

SortDropdown.displayName = 'SortDropdown';

export default SortDropdown;
