import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { getAllMenus, createMenu } from '../../api/menuApi';
import type { IMenu, CreateMenuDTO } from '../../api/menuApi';
import { useAdminTheme } from '../../contexts/AdminThemeContext';

const MenuManagement: React.FC = () => {
  const { colors } = useAdminTheme();
  const [menus, setMenus] = useState<IMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<CreateMenuDTO>({
    name: '',
    slug: '',
    parentId: null,
    order: 0,
    isActive: true,
    icon: '',
    type: 'category',
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await getAllMenus(true); // Include inactive
      setMenus(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch menus');
      console.error('Error fetching menus:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMenu(formData);
      fetchMenus();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create menu');
      console.error('Error creating menu:', err);
    }
  };



  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      parentId: null,
      order: 0,
      isActive: true,
      icon: '',
      type: 'category',
    });
    setShowAddForm(false);
  };

  const flattenMenus = (menuList: IMenu[]): IMenu[] => {
    let result: IMenu[] = [];
    menuList.forEach((menu) => {
      result.push(menu);
      if (menu.children && menu.children.length > 0) {
        result = result.concat(flattenMenus(menu.children));
      }
    });
    return result;
  };

  const renderMenuTree = (menuList: IMenu[], level: number = 0) => {
    return menuList.map((menu) => (
      <div key={menu._id} style={{ marginLeft: `${level * 24}px` }}>
        <div
          className="flex items-center justify-between p-3 mb-2 rounded-lg border"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3
                  className="font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  {menu.name}
                </h3>
                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: menu.isActive ? '#10b981' : '#ef4444',
                    color: '#fff',
                  }}
                >
                  {menu.isActive ? 'Active' : 'Inactive'}
                </span>
                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: colors.background.tertiary,
                    color: colors.text.secondary,
                  }}
                >
                  {menu.type}
                </span>
              </div>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                Slug: {menu.slug} | Order: {menu.order}
              </p>
            </div>
          </div>
        </div>
        {menu.children && menu.children.length > 0 && renderMenuTree(menu.children, level + 1)}
      </div>
    ));
  };

  const getAllParentMenus = (menuList: IMenu[]): IMenu[] => {
    let parents: IMenu[] = [];
    menuList.forEach((menu) => {
      if (!menu.parentId || menu.type === 'category') {
        parents.push(menu);
      }
      if (menu.children && menu.children.length > 0) {
        parents = parents.concat(getAllParentMenus(menu.children));
      }
    });
    return parents;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: colors.interactive.primary }}></div>
          <p style={{ color: colors.text.secondary }}>Loading menus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" style={{ backgroundColor: colors.background.primary }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold" style={{ color: colors.text.primary }}>
            Menu Management
          </h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors"
            style={{
              backgroundColor: colors.interactive.primary,
              color: '#fff',
            }}
          >
            <Plus size={20} />
            Add Menu
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-100 border border-red-300 text-red-800">
            {error}
            <button onClick={() => setError(null)} className="float-right font-bold">
              ×
            </button>
          </div>
        )}

        {showAddForm && (
          <div className="mb-6 p-6 rounded-lg border" style={{ backgroundColor: colors.background.secondary, borderColor: colors.border.primary }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: colors.text.primary }}>
                Add New Menu
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-gray-200 rounded transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-semibold" style={{ color: colors.text.primary }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded border"
                  style={{ borderColor: colors.border.primary }}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold" style={{ color: colors.text.primary }}>
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded border"
                  style={{ borderColor: colors.border.primary }}
                  placeholder="lowercase-with-hyphens"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold" style={{ color: colors.text.primary }}>
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded border"
                  style={{ borderColor: colors.border.primary }}
                >
                  <option value="category">Category</option>
                  <option value="subcategory">Subcategory</option>
                  <option value="brand">Brand</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold" style={{ color: colors.text.primary }}>
                  Parent Menu
                </label>
                <select
                  name="parentId"
                  value={formData.parentId || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded border"
                  style={{ borderColor: colors.border.primary }}
                >
                  <option value="">None (Top Level)</option>
                  {getAllParentMenus(menus).map((menu) => (
                    <option key={menu._id} value={menu._id}>
                      {menu.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold" style={{ color: colors.text.primary }}>
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded border"
                  style={{ borderColor: colors.border.primary }}
                  min="0"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold" style={{ color: colors.text.primary }}>
                  Icon (optional)
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded border"
                  style={{ borderColor: colors.border.primary }}
                  placeholder="lucide-icon-name"
                />
              </div>

              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label className="font-semibold" style={{ color: colors.text.primary }}>
                  Active
                </label>
              </div>

              <div className="flex gap-2 md:col-span-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-semibold transition-colors"
                  style={{
                    backgroundColor: colors.interactive.primary,
                    color: '#fff',
                  }}
                >
                  Create Menu
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg font-semibold border transition-colors"
                  style={{
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-2">
          {menus.length === 0 ? (
            <div className="text-center py-12" style={{ color: colors.text.secondary }}>
              <p className="text-lg">No menus found. Create your first menu to get started.</p>
            </div>
          ) : (
            renderMenuTree(menus)
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
