import React, { useState, useEffect } from 'react';
import { Calendar, Eye, Edit, Trash2, Plus, X, ExternalLink } from 'lucide-react';

interface Banner {
  _id?: string;
  title: string;
  description: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  startDate: string;
  endDate: string;
  position: string;
  bannerType: string;
  priority: number;
  status: string;
  backgroundColor: string;
  textColor: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BannerManagement: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<Partial<Banner>>({
    title: '',
    description: '',
    ctaButtonText: 'Shop Now',
    ctaButtonLink: '',
    startDate: '',
    endDate: '',
    position: 'Home Page Only',
    bannerType: 'Normal',
    priority: 1,
    status: 'Active',
    backgroundColor: '#3B82F6',
    textColor: '#FFFFFF'
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/banners`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch banners');
      }
      
      const result = await response.json();
      // Fix: Handle the wrapped response structure
      setBanners(result.success ? result.data : []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      alert('Error fetching banners');
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      ctaButtonText: 'Shop Now',
      ctaButtonLink: '',
      startDate: '',
      endDate: '',
      position: 'Home Page Only',
      bannerType: 'Normal',
      priority: 1,
      status: 'Active',
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF'
    });
    setEditingBanner(null);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const url = editingBanner 
        ? `${API_URL}/api/banners/${editingBanner._id}`
        : `${API_URL}/api/banners`;
      
      const response = await fetch(url, {
        method: editingBanner ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save banner');
      }

      await fetchBanners();
      setShowCreateForm(false);
      resetForm();
      alert(editingBanner ? 'Banner updated successfully' : 'Banner created successfully');
    } catch (error) {
      console.error('Error saving banner:', error);
      alert(error instanceof Error ? error.message : 'Error saving banner');
    }
  };

  const handleEdit = (banner: Banner) => {
    // Fix: Convert dates to YYYY-MM-DD format for date inputs
    const formattedBanner = {
      ...banner,
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : '',
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : '',
    };
    setFormData(formattedBanner);
    setEditingBanner(banner);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete banner');
      }

      await fetchBanners();
      alert('Banner deleted successfully');
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert(error instanceof Error ? error.message : 'Error deleting banner');
    }
  };

  // Fix: Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getBannerTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'FESTIVAL': return 'bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold';
      case 'FLASH SALE': return 'bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold';
      case 'SEASONAL': return 'bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold';
      default: return 'bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold';
      case 'INACTIVE': return 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold';
      default: return 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold';
    }
  };

  if (showCreateForm) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h1 className="text-3xl font-bold">{editingBanner ? 'Edit Banner' : 'Create New Banner'}</h1>
              <button onClick={() => { setShowCreateForm(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Title <span className="text-red-500">*</span></label>
                    <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Description</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows={3}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none resize-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">CTA Button Text</label>
                      <input type="text" name="ctaButtonText" value={formData.ctaButtonText || ''} onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none" />
                    </div>
                    {/* <div>
                      <label className="block text-sm font-semibold mb-2">CTA Link</label>
                      <input type="text" name="ctaButtonLink" value={formData.ctaButtonLink || ''} onChange={handleInputChange}
                        placeholder="/products" className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none" />
                    </div> */}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Start Date <span className="text-red-500">*</span></label>
                      <input type="date" name="startDate" value={formData.startDate || ''} onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">End Date <span className="text-red-500">*</span></label>
                      <input type="date" name="endDate" value={formData.endDate || ''} onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Position</label>
                      <select name="position" value={formData.position || ''} onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none">
                        <option value="Home Page Only">Home Page Only</option>
                        <option value="Product Page">Product Page</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Banner Type</label>
                      <select name="bannerType" value={formData.bannerType || ''} onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none">
                        <option value="Normal">Normal</option>
                        <option value="Festival">Festival</option>
                        <option value="Flash Sale">Flash Sale</option>
                        <option value="Seasonal">Seasonal</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Priority (1-10)</label>
                      <input type="number" name="priority" value={formData.priority || 1} onChange={handleInputChange} min="1" max="10"
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Status</label>
                      <select name="status" value={formData.status || ''} onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Scheduled">Scheduled</option>
                      </select>
                    </div>
                  </div>

                  {/* <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Background Color</label>
                      <input type="color" name="backgroundColor" value={formData.backgroundColor || '#3B82F6'} onChange={handleInputChange}
                        className="w-full h-12 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Text Color</label>
                      <input type="color" name="textColor" value={formData.textColor || '#FFFFFF'} onChange={handleInputChange}
                        className="w-full h-12 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" />
                    </div>
                  </div> */}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Eye size={20} />Banner Preview</h3>
                  <div className="rounded-lg p-6" style={{ backgroundColor: formData.backgroundColor, color: formData.textColor }}>
                    <div className="space-y-4">
                      <span className="inline-block bg-white bg-opacity-20 px-4 py-1 rounded-full text-xs font-semibold">
                        {formData.bannerType}
                      </span>
                      <h4 className="text-2xl font-bold">{formData.title || 'Banner Title'}</h4>
                      {formData.description && <p className="opacity-90">{formData.description}</p>}
                      <button className="bg-white px-6 py-2 rounded-lg font-semibold" style={{ color: formData.backgroundColor }}>
                        {formData.ctaButtonText || 'Shop Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 mt-8 border-t">
                <button onClick={() => { setShowCreateForm(false); resetForm(); }}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                  Cancel
                </button>
                <button onClick={handleSubmit} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                  {editingBanner ? 'Update' : 'Create'} Banner
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h1 className="text-3xl font-bold">Banner Management</h1>
              <p className="text-gray-600 mt-2">Create and manage promotional banners</p>
            </div>
            <button onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
              <Plus size={20} />Add Banner
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-16">Loading...</div>
            ) : banners.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <p className="text-gray-500 mb-4">No banners found</p>
                <button onClick={() => setShowCreateForm(true)} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                  Create Your First Banner
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {banners.map((banner) => (
                  <div key={banner._id} className="border-2 rounded-lg p-6 hover:border-gray-300">
                    <div className="flex justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl font-bold">{banner.title}</h3>
                          <span className={getBannerTypeColor(banner.bannerType)}>{banner.bannerType}</span>
                          <span className={getStatusColor(banner.status)}>{banner.status}</span>
                        </div>
                        <p className="text-gray-700">{banner.description}</p>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-500" />
                            <span className="font-medium">Duration:</span>
                            <span className="text-gray-600">{formatDate(banner.startDate)} - {formatDate(banner.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ExternalLink size={16} className="text-gray-500" />
                            <span className="font-medium">Priority:</span>
                            <span className="text-gray-600">{banner.priority}/10</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(banner)}
                          className="p-2 text-gray-500 hover:text-green-600 border rounded-lg hover:border-green-300 hover:bg-green-50">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(banner._id!)}
                          className="p-2 text-gray-500 hover:text-red-600 border rounded-lg hover:border-red-300 hover:bg-red-50">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerManagement;