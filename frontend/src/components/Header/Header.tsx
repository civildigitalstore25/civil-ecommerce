import React, { useState } from 'react';
import { Search, Phone, User, ShoppingCart, Menu, X, LogOut, Settings } from 'lucide-react';
import { headerConfig } from './HeaderConfig';
import DesktopNavigation from './DesktopNavigation';
import AuthDropdown from './AuthDropdown';
import MobileMenu from './MobileMenu';
import AdminDashboard from '../../ui/admin/AdminDashboard';
import FormSelect from '../Select/FormSelect';
import { useCategories, useCompanies } from '../../api/productApi';
import { useNavigate } from 'react-router-dom';
import { clearAuth, isAdmin } from '../../utils/auth';
import { useUser, useUserInvalidate, useLogout } from '../../api/userQueries';
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const { data: user } = useUser();
  const invalidateUser = useUserInvalidate();
  const navigate = useNavigate();



  const { data: categories = [] } = useCategories();
  const { data: companies = [] } = useCompanies();

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((category: string) => ({
      value: category,
      label: category
    }))
  ];

  const companyOptions = [
    { value: '', label: 'All Brands' },
    ...companies.map((company: string) => ({
      value: company,
      label: company
    }))
  ];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryValue = e.target.value;
    setSelectedCategory(categoryValue);

    if (categoryValue) {
      navigate(`/software?category=${encodeURIComponent(categoryValue)}`);
    } else {
      navigate('/software');
    }
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const companyValue = e.target.value;
    setSelectedCompany(companyValue);

    if (companyValue) {
      navigate(`/company/${encodeURIComponent(companyValue)}`);
    } else {
      navigate('/companies');
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAuthDropdown = () => setIsAuthDropdownOpen(!isAuthDropdownOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNavigation = (href: string) => {
    if (href === '/admin-login') {
      setShowAdminDashboard(true);
    } else if (href === '/') {
      setShowAdminDashboard(false);
      navigate('/');
    } else if (href === '/logout') {
      handleLogout();
    } else {
      navigate(href);
    }
    setIsMenuOpen(false);
    setIsAuthDropdownOpen(false);
    setIsUserDropdownOpen(false);
  };
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        clearAuth();
        invalidateUser();
        navigate('/');
        window.location.reload();
      },
      onError: () => {
        // Fallback if mutation fails
        clearAuth();
        invalidateUser();
        navigate('/');
        window.location.reload();
      }
    });
  };

  if (showAdminDashboard) {
    return (
      <div>
        <header className="bg-white shadow-sm border-b border-gray-200 w-full">
          {/* Admin header content */}
          <div className="bg-gray-50 border-b border-gray-200 hidden sm:block">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
              <div className="flex justify-start py-1 sm:py-2">
                <div className="flex flex-wrap gap-2 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                  {headerConfig.legal.map((link, index) => (
                    <React.Fragment key={link.href}>
                      <button
                        onClick={() => handleNavigation(link.href)}
                        className="hover:text-blue-600 transition-colors duration-200 whitespace-nowrap"
                      >
                        {link.label}
                      </button>
                      {index < headerConfig.legal.length - 1 && (
                        <span className="text-gray-400 hidden sm:inline">|</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-center justify-between py-2 sm:py-4 px-2 sm:px-4 lg:px-8">
              <div className="flex items-center flex-shrink-0">
                <button
                  onClick={() => handleNavigation(headerConfig.logo.href)}
                  className="flex items-center"
                >
                  <img
                    src="/logo1.png"
                    alt="Logo"
                    className="h-8 sm:h-10 md:h-12 max-h-12 w-auto object-contain"
                  />
                </button>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium">Admin Panel Active</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAdminDashboard(false)}
                  className="bg-gray-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                >
                  Exit Admin
                </button>
              </div>
            </div>
          </div>
        </header>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 w-full">
      {/* Top legal bar */}
      <div className="bg-gray-50 border-b border-gray-200 hidden sm:block">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-start py-1 sm:py-2">
            <div className="flex flex-wrap gap-2 sm:space-x-4 text-xs sm:text-sm text-gray-600">
              {headerConfig.legal.map((link, index) => (
                <React.Fragment key={link.href}>
                  <button
                    onClick={() => handleNavigation(link.href)}
                    className="hover:text-blue-600 transition-colors duration-200 whitespace-nowrap"
                  >
                    {link.label}
                  </button>
                  {index < headerConfig.legal.length - 1 && (
                    <span className="text-gray-400 hidden sm:inline">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main header content */}
      <div className="w-full">
        <div className="flex items-center justify-between py-2 sm:py-4 px-2 sm:px-4 lg:px-8">
          {/* Logo flush left */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={() => handleNavigation(headerConfig.logo.href)}
              className="flex items-center"
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="h-8 sm:h-10 md:h-12 max-h-12 w-auto object-contain"
              />
            </button>
          </div>

          {/* Center section - Desktop */}
          <div className="flex-1 flex items-center justify-center px-4 lg:px-8">
            {/* Category and Company Dropdowns - Desktop Only */}
            <div className="hidden lg:flex items-center space-x-3 mr-6">
              <div className="min-w-[140px] max-w-[180px]">
                <FormSelect
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="text-sm"
                />
              </div>
              <div className="min-w-[140px] max-w-[180px]">
                <FormSelect
                  options={companyOptions}
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <DesktopNavigation onNavigate={handleNavigation} />

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md xl:max-w-lg ml-4">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={headerConfig.search.placeholder}
                  className="w-full pl-3 pr-10 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {/* Contact info - Desktop */}
            <div className="hidden xl:flex items-center space-x-2 text-gray-700">
              <Phone className="w-4 h-4" />
              <span className="text-sm whitespace-nowrap">Need help? Call us:</span>
              <a
                href={headerConfig.contact?.phoneHref || '#'}
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200 whitespace-nowrap"
              >
                {headerConfig.contact?.phone || 'Contact Us'}
              </a>
            </div>

            <div className="hidden lg:flex xl:hidden items-center space-x-2 text-gray-700">
              <Phone className="w-4 h-4" />
              <a
                href={headerConfig.contact?.phoneHref || '#'}
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
              >
                {headerConfig.contact?.phone || 'Contact'}
              </a>
            </div>

            {/* User dropdown or Auth dropdown */}
            {user ? (
              <div className="hidden sm:block relative">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-1 lg:space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-1 lg:px-2"
                >
                  <User className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="text-sm lg:text-base whitespace-nowrap">
                    {user.fullName || user.email}
                  </span>
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                    {isAdmin(user) && (
                      <button
                        onClick={() => handleNavigation('/admin-dashboard')}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => handleNavigation('/logout')}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:block relative">
                <button
                  onClick={toggleAuthDropdown}
                  className="flex items-center space-x-1 lg:space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-1 lg:px-2"
                >
                  <User className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="text-sm lg:text-base whitespace-nowrap">Sign In</span>
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AuthDropdown
                  isOpen={isAuthDropdownOpen}
                  onClose={() => setIsAuthDropdownOpen(false)}
                  onNavigate={handleNavigation}
                />
              </div>
            )}

            {/* Cart */}
            <button
              onClick={() => handleNavigation('/cart')}
              className="relative flex items-center space-x-1 lg:space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-1 lg:px-2"
            >
              <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden sm:inline text-sm lg:text-base whitespace-nowrap">My Cart</span>
              <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-blue-600 text-white text-xs rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-1.5 sm:p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200 ml-2"
            >
              {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        searchQuery={searchQuery}
        onClose={() => setIsMenuOpen(false)}
        onSearch={handleSearch}
        onSearchChange={setSearchQuery}
        onSearchKeyPress={handleKeyPress}
        onNavigate={handleNavigation}
        categoryOptions={categoryOptions}
        companyOptions={companyOptions}
        selectedCategory={selectedCategory}
        selectedCompany={selectedCompany}
        onCategoryChange={handleCategoryChange}
        onCompanyChange={handleCompanyChange}
        user={user}
        onLogout={handleLogout}
      />

      {/* Overlay to close dropdowns */}
      {(isAuthDropdownOpen || isUserDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsAuthDropdownOpen(false);
            setIsUserDropdownOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;