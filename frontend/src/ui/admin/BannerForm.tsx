import React, { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  description: string;
  ctaButtonText: string;
  startDate: string;
  endDate: string;
  position: string;
  bannerType: string;
  priority: number;
  status: string;
}

interface BannerFormProps {
  editingBanner?: Banner | null;
  onSubmit: (bannerData: Partial<Banner>) => void;
  onCancel: () => void;
}

const BannerForm: React.FC<BannerFormProps> = ({ editingBanner, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Banner>>({
    title: '',
    description: '',
    ctaButtonText: 'Shop Now',
    startDate: '',
    endDate: '',
    position: 'Home Page Only',
    bannerType: 'Normal',
    priority: 1,
    status: 'Active'
  });

  useEffect(() => {
    if (editingBanner) {
      setFormData(editingBanner);
    } else {
      resetForm();
    }
  }, [editingBanner]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      ctaButtonText: 'Shop Now',
      startDate: '',
      endDate: '',
      position: 'Home Page Only',
      bannerType: 'Normal',
      priority: 1,
      status: 'Active'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields (Title, Start Date, and End Date)');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">
              {editingBanner ? 'Edit Banner' : 'Create New Banner'}
            </h1>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Banner Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    placeholder="Enter banner title"
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    placeholder="Enter banner description (optional)"
                    rows={3}
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">CTA Button Text</label>
                  <input
                    type="text"
                    name="ctaButtonText"
                    value={formData.ctaButtonText || ''}
                    onChange={handleInputChange}
                    placeholder="Shop Now"
                    className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate || ''}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate || ''}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Position</label>
                    <select
                      name="position"
                      value={formData.position || ''}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="Home Page Only">Home Page Only</option>
                      <option value="Product Page">Product Page</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Banner Type</label>
                    <select
                      name="bannerType"
                      value={formData.bannerType || ''}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Festival">Festival</option>
                      <option value="Flash Sale">Flash Sale</option>
                      <option value="Seasonal">Seasonal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Priority (1-10)</label>
                    <input
                      type="number"
                      name="priority"
                      value={formData.priority || 1}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Status</label>
                    <select
                      name="status"
                      value={formData.status || ''}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Scheduled">Scheduled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Eye size={20} />
                    Banner Preview
                  </h3>
                  
                  {/* Banner Preview Card */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold">
                        {formData.title || 'Banner Title'}
                      </h4>
                      {formData.description && (
                        <p className="text-blue-100">
                          {formData.description}
                        </p>
                      )}
                      <div className="flex justify-start">
                        <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                          {formData.ctaButtonText || 'Shop Now'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Details Preview */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-gray-700 mb-3">Banner Details:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="font-medium w-20">Title:</span>
                        <span className="text-gray-600">{formData.title || 'Not specified'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-20">Description:</span>
                        <span className="text-gray-600 flex-1">{formData.description || 'Not specified'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-20">CTA:</span>
                        <span className="text-gray-600">{formData.ctaButtonText || 'Shop Now'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-20">Position:</span>
                        <span className="text-gray-600">{formData.position || 'Home Page Only'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-20">Type:</span>
                        <span className="text-gray-600">{formData.bannerType || 'Normal'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-20">Priority:</span>
                        <span className="text-gray-600">{formData.priority || 1}/10</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-20">Status:</span>
                        <span className="text-gray-600">{formData.status || 'Active'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-20">Duration:</span>
                        <span className="text-gray-600">
                          {formData.startDate && formData.endDate 
                            ? `${formData.startDate} to ${formData.endDate}` 
                            : 'Not specified'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 mt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {editingBanner ? 'Update Banner' : 'Create Banner'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerForm;