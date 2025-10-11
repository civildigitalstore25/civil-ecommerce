import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProductDetail } from '../api/productApi';
import { useCartContext } from '../contexts/CartContext';
import { useUser } from '../api/userQueries';
import { useAdminTheme } from '../contexts/AdminThemeContext';
import Swal from 'sweetalert2';
import * as LucideIcons from 'lucide-react';

// Enhanced FAQ Item Component
interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
  colors: any;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, index, colors }) => {
  const [isOpen, setIsOpen] = useState(index === 0); // First item open by default

  return (
    <div
      className="rounded-2xl border transition-all duration-300"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: isOpen ? colors.interactive.primary : colors.border.primary
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between group transition-colors duration-200"
        style={{ color: colors.text.primary }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200"
            style={{
              backgroundColor: isOpen ? colors.interactive.primary : colors.background.primary,
              color: isOpen ? colors.background.primary : colors.text.secondary
            }}
          >
            {index + 1}
          </div>
          <h4 className="text-lg font-semibold group-hover:opacity-80">
            {question}
          </h4>
        </div>
        <div
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: colors.interactive.primary }}
        >
          <LucideIcons.ChevronDown size={24} />
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6">
          <div
            className="pl-12 border-l-2 transition-colors duration-200"
            style={{ borderColor: colors.interactive.primary + '30' }}
          >
            <p
              className="leading-relaxed"
              style={{ color: colors.text.secondary }}
            >
              {answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProductDetail(id);
  const [selectedLicense, setSelectedLicense] = useState<string>('yearly');
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'features' | 'requirements' | 'reviews' | 'faq'>('features');
  const { addItem, isItemInCart, getItemQuantity } = useCartContext();
  const { data: user } = useUser();
  const navigate = useNavigate();
  const { colors } = useAdminTheme();
  const [banners, setBanners] = useState<any[]>([]);
const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
const [bannersLoading, setBannersLoading] = useState(true);
const [isBannerClosed, setIsBannerClosed] = useState(false); // ADD THIS LINE

  // Helper function to render Lucide icons dynamically
  const renderIcon = (iconName: string, className?: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={className} size={24} />;
    }
    // Fallback to a default icon if the specified icon doesn't exist
    return <LucideIcons.Check className={className} size={24} />;
  };

  // Get all available pricing options
  const getAllPricingOptions = () => {
    if (!product) return [];

    const options = [];

    // Add subscription durations if available (main pricing options)
    if (product.subscriptionDurations && product.subscriptionDurations.length > 0) {
      product.subscriptionDurations.forEach((sub, index) => {
        if ((sub.price && sub.price > 0) || (sub.priceINR && sub.priceINR > 0) || (sub.priceUSD && sub.priceUSD > 0)) {
          options.push({
            id: `subscription-${index}`,
            label: sub.duration,
            priceINR: sub.priceINR || sub.price || 0,
            priceUSD: sub.priceUSD || (sub.price ? sub.price / 83 : 0),
            type: 'subscription',
            badge: sub.duration.toLowerCase().includes('1') ? 'Most Popular' :
              sub.duration.toLowerCase().includes('3') ? 'Save 30%' : null,
            savings: null
          });
        }
      });
    } else {
      // Fallback to legacy pricing structure
      if ((product.price1 && product.price1 > 0) || (product.price1INR && product.price1INR > 0)) {
        options.push({
          id: 'yearly',
          label: '1 Year License',
          priceINR: product.price1INR || product.price1 || 0,
          priceUSD: product.price1USD || (product.price1 ? product.price1 / 83 : 0),
          type: 'yearly',
          badge: 'Most Popular',
          savings: null
        });
      }

      if ((product.price3 && product.price3 > 0) || (product.price3INR && product.price3INR > 0)) {
        options.push({
          id: '3year',
          label: '3 Year License',
          priceINR: product.price3INR || product.price3 || 0,
          priceUSD: product.price3USD || (product.price3 ? product.price3 / 83 : 0),
          type: '3year',
          badge: 'Save 30%',
          savings: null
        });
      }
    }

    // Add lifetime option if available
    const lifetimePrice = product.lifetimePriceINR || product.priceLifetime || product.lifetimePrice || 0;
    if (lifetimePrice > 0) {
      const yearlyPrice = options.find(opt => opt.type === 'yearly' || opt.type === 'subscription')?.priceINR || 0;
      const threeYearTotal = yearlyPrice * 3;
      const savings = threeYearTotal > lifetimePrice ? threeYearTotal - lifetimePrice : 0;

      options.push({
        id: 'lifetime',
        label: 'Lifetime License',
        priceINR: lifetimePrice,
        priceUSD: product.lifetimePriceUSD || (lifetimePrice / 83),
        type: 'lifetime',
        badge: 'Best Value',
        savings: savings > 0 ? `Save ₹${savings.toLocaleString()}` : null
      });
    }

    // Add membership option if available
    const membershipPrice = product.membershipPriceINR || product.membershipPrice || 0;
    if (membershipPrice > 0) {
      options.push({
        id: 'membership',
        label: 'Membership',
        priceINR: membershipPrice,
        priceUSD: product.membershipPriceUSD || (membershipPrice / 83),
        type: 'membership',
        badge: 'Premium Access',
        savings: null
      });
    }

    return options;
  };

  const pricingOptions = getAllPricingOptions();
  const selectedOption = pricingOptions.find(opt => opt.id === selectedLicense) || pricingOptions[0];

  // Get admin subscription plans separately
  const getAdminSubscriptionPlans = () => {
    if (!product || !product.subscriptions) return [];

    return product.subscriptions
      .filter(sub => (sub.price && sub.price > 0) || (sub.priceINR && sub.priceINR > 0) || (sub.priceUSD && sub.priceUSD > 0))
      .map((sub, index) => ({
        id: `admin-subscription-${index}`,
        label: sub.duration,
        priceINR: sub.priceINR || sub.price || 0,
        priceUSD: sub.priceUSD || (sub.price ? sub.price / 83 : 0),
        type: 'admin-subscription',
        badge: sub.duration.toLowerCase().includes('monthly') ? 'Flexible' :
          sub.duration.toLowerCase().includes('annual') ? 'Best Deal' : null,
        savings: null
      }));
  };

  // Group pricing options by type
  const licenseOptions = pricingOptions.filter(opt => opt.type === 'yearly' || opt.type === '3year');
  const subscriptionOptions = pricingOptions.filter(opt => opt.type === 'subscription');
  const lifetimeOptions = pricingOptions.filter(opt => opt.type === 'lifetime');
  const membershipOptions = pricingOptions.filter(opt => opt.type === 'membership');
  const adminSubscriptionOptions = getAdminSubscriptionPlans();


React.useEffect(() => {
  if (pricingOptions.length > 0 && !selectedOption) {
    setSelectedLicense(pricingOptions[0].id);
  }
}, [pricingOptions, selectedOption]);




// Fetch product page banners
React.useEffect(() => {
  const fetchProductBanners = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      console.log('Fetching banners from:', `${API_BASE_URL}/banners/active/product`);
      
      const response = await fetch(`${API_BASE_URL}/banners/active/product`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Banner result:', result);
        
        if (result.success && result.data) {
          console.log('Banners found:', result.data);
          setBanners(result.data);
        } else {
          console.log('No banners in result');
        }
      } else {
        console.log('Response not OK:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching product banners:', error);
    } finally {
      console.log('Setting bannersLoading to false');
      setBannersLoading(false);
    }
  };

  fetchProductBanners();
}, []);


  // Early returns after all hooks are defined to avoid hook order violations
  if (isLoading) return (
    <div
      className="text-center py-20 transition-colors duration-200"
      style={{ color: colors.text.primary }}
    >
      Loading...
    </div>
  );

  if (!product) return (
    <div
      className="text-center py-20 transition-colors duration-200"
      style={{ color: colors.text.primary }}
    >
      Product not found.
    </div>
  );

  // Images - prioritize imageUrl over image field, and handle additional images
  const mainImageUrl = product.imageUrl || product.image;
  const additionalImages = product.additionalImages?.filter(img => img && img.trim() !== '') || [];
  const images = [mainImageUrl, ...additionalImages].filter(img => img);

  // Include demo video as part of media gallery
  const mediaItems = [...images];
  if (product.videoUrl) {
    mediaItems.push(`video:${product.videoUrl}`);
  }

  const currentMainImage = mainImage || mainImageUrl;

  // Cart functionality
  const handleAddToCart = async () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate('/login', { state: { returnTo: `/product/${id}` } });
      return;
    }

    // Convert license types for cart compatibility
    const getCartLicenseType = () => {
      if (selectedLicense === 'yearly' || selectedLicense.includes('subscription-0')) return '1year';
      if (selectedLicense === '3year' || selectedLicense.includes('subscription-1')) return '3year';
      if (selectedLicense === 'lifetime') return 'lifetime';
      return '1year'; // default fallback
    };

    const cartLicenseType = getCartLicenseType();

    if (isInCart) {
      Swal.fire({
        title: 'Already in Cart',
        text: `${product.name} is already in your cart with ${selectedOption?.label} license`,
        icon: 'info',
        confirmButtonText: 'View Cart'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/cart');
        }
      });
      return;
    }

    if (product && selectedOption && selectedOption.priceINR > 0) {
      try {
        await addItem(product, cartLicenseType, 1);
        Swal.fire({
          title: 'Added to Cart!',
          text: `${product.name} has been added to your cart`,
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'View Cart',
          cancelButtonText: 'Continue Shopping'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/cart');
          }
        });
      } catch (error) {
        Swal.fire('Error', 'Failed to add item to cart', 'error');
      }
    }
  };

  const getCartLicenseTypeForCheck = () => {
    if (selectedLicense === 'yearly' || selectedLicense.includes('subscription-0')) return '1year';
    if (selectedLicense === '3year' || selectedLicense.includes('subscription-1')) return '3year';
    if (selectedLicense === 'lifetime') return 'lifetime';
    return '1year'; // default fallback
  };

  const cartLicenseType = getCartLicenseTypeForCheck();
  const isInCart = product ? isItemInCart(product._id!, cartLicenseType) : false;
  const cartQuantity = product ? getItemQuantity(product._id!, cartLicenseType) : 0;
  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: colors.background.primary, color: colors.text.primary }}
    >
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-2 lg:py-4">
        <div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm overflow-x-auto" style={{ color: colors.text.secondary }}>
          <span>Home</span>
          <span>{'>'}</span>
          <span>{product.category}</span>
          <span>{'>'}</span>
          <span style={{ color: colors.interactive.primary }}>{product.name}</span>
        </div>
      </div>
{/* ADD BANNER COMPONENT HERE - AFTER BREADCRUMB, BEFORE MAIN CONTENT */}
     {/* Product Page Banner */}
{!bannersLoading && banners.length > 0 && !isBannerClosed && (
  <div className="max-w-7xl mx-auto px-4 mb-6">
    <div
      className="rounded-2xl p-6 lg:p-8 shadow-lg transition-all duration-500 relative overflow-hidden"
      style={{
        backgroundColor: banners[currentBannerIndex].backgroundColor || '#3B82F6',
        color: banners[currentBannerIndex].textColor || '#FFFFFF',
      }}
    >
      {/* Close Button - ADD THIS */}
      <button
        onClick={() => setIsBannerClosed(true)}
        className="absolute top-4 left-4 bg-white bg-opacity-30 hover:bg-opacity-50 backdrop-blur-sm p-2 rounded-full transition-all duration-200 z-20 group"
        aria-label="Close banner"
      >
        <LucideIcons.X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
      </button>

      {/* Banner Type Badge */}
      <div className="absolute top-4 right-4">
        <span className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase">
          {banners[currentBannerIndex].bannerType}
        </span>
      </div>

      {/* Rest of your banner code stays the same */}
      <div className="max-w-3xl relative z-10">
        <h2 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight">
          {banners[currentBannerIndex].title}
        </h2>
        
        {banners[currentBannerIndex].description && (
          <p className="text-base lg:text-lg mb-4 opacity-90">
            {banners[currentBannerIndex].description}
          </p>
        )}

        <button
          onClick={() => {
            const link = banners[currentBannerIndex].ctaButtonLink;
            if (link) {
              if (link.startsWith('http')) {
                window.open(link, '_blank');
              } else {
                navigate(link);
              }
            }
          }}
          className="bg-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          style={{ color: banners[currentBannerIndex].backgroundColor || '#3B82F6' }}
        >
          {banners[currentBannerIndex].ctaButtonText}
        </button>
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentBannerIndex((prev) => prev === 0 ? banners.length - 1 : prev - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 backdrop-blur-sm p-2 rounded-full transition-all duration-200 z-10"
          >
            <LucideIcons.ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setCurrentBannerIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 backdrop-blur-sm p-2 rounded-full transition-all duration-200 z-10"
          >
            <LucideIcons.ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentBannerIndex ? 'w-8 bg-white' : 'w-2 bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  </div>
)}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Left Side - Product Gallery */}
          <div className="space-y-3 lg:space-y-4">
            {/* Main Media Display */}
            <div className="aspect-square flex items-center justify-center p-2 lg:p-4">
              {currentMainImage && currentMainImage.startsWith('video:') ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="aspect-video w-full max-w-sm lg:max-w-md rounded-lg lg:rounded-xl overflow-hidden shadow-lg">
                    {currentMainImage.replace('video:', '').includes('youtube.com') || currentMainImage.replace('video:', '').includes('youtu.be') ? (
                      <iframe
                        src={currentMainImage.replace('video:', '').replace('watch?v=', 'embed/')}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                        title="Product Demo Video"
                      />
                    ) : (
                      <video
                        src={currentMainImage.replace('video:', '')}
                        className="w-full h-full"
                        controls
                        title="Product Demo Video"
                      />
                    )}
                  </div>
                </div>
              ) : (
                <img
                  src={currentMainImage}
                  className="max-w-full max-h-full object-contain rounded-lg lg:rounded-xl shadow-lg"
                  alt={product.name}
                />
              )}
            </div>

            {/* Media Thumbnails */}
            <div className="flex gap-2 lg:gap-3 justify-center flex-wrap">
              {mediaItems.map((item, idx) => (
                <div
                  key={idx}
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg lg:rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 relative"
                  style={{
                    borderColor: item === currentMainImage ? colors.interactive.primary : colors.border.primary
                  }}
                  onClick={() => setMainImage(item)}
                >
                  {item.startsWith('video:') ? (
                    <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-br from-blue-500 to-purple-600">
                      <LucideIcons.Play
                        className="absolute inset-0 m-auto text-white bg-black bg-opacity-50 rounded-full p-1"
                        size={20}
                      />
                      <div className="text-xs font-semibold text-center text-white absolute bottom-1">
                        Video
                      </div>
                    </div>
                  ) : (
                    <img src={item} className="object-cover w-full h-full" alt={`thumb-${idx}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="space-y-4 lg:space-y-6">
            {/* Brand Badge */}
            <div className="flex items-center gap-2 lg:gap-3">
              <span
                className="px-2 py-1 lg:px-3 lg:py-1 rounded-lg text-xs lg:text-sm font-bold transition-colors duration-200"
                style={{
                  backgroundColor: colors.interactive.primary,
                  color: colors.background.primary
                }}
              >
                {product.brand || product.company}
              </span>
              <span style={{ color: colors.interactive.primary }} className="text-sm">{product.version}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl lg:text-4xl font-bold" style={{ color: colors.text.primary }}>{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {'★'.repeat(4)}
                <span style={{ color: colors.text.secondary }}>☆</span>
              </div>
              <span style={{ color: colors.text.primary }}>4.9 (2,341)</span>
            </div>

            {/* Description */}
            <p className="text-base lg:text-lg leading-relaxed" style={{ color: colors.text.secondary }}>
              {product.shortDescription}
            </p>

            {/* License Selection */}
            <div
              className="rounded-lg lg:rounded-xl p-3 lg:p-4 transition-colors duration-200"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h3 className="text-base lg:text-lg font-bold" style={{ color: colors.text.primary }}>Choose Your License</h3>
                {selectedOption?.badge && (
                  <span
                    className="px-2 py-1 rounded text-xs font-bold"
                    style={{
                      backgroundColor: '#10b981',
                      color: colors.background.primary
                    }}
                  >
                    {selectedOption.badge}
                  </span>
                )}
              </div>

              {/* License Plans Section - Small boxes in a row */}
              {licenseOptions.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-semibold mb-2" style={{ color: colors.text.secondary }}>License Plans</h4>
                  <div className="flex gap-2 overflow-x-auto">
                    {licenseOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => setSelectedLicense(option.id)}
                        className="flex-shrink-0 p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] text-center min-w-[100px]"
                        style={{
                          borderColor: selectedLicense === option.id ? colors.interactive.primary : colors.border.primary,
                          backgroundColor: selectedLicense === option.id ? colors.interactive.primary + '20' : 'transparent'
                        }}
                      >
                        <div className="text-xs font-bold mb-1" style={{ color: colors.text.primary }}>
                          {option.label.replace(' License', '')}
                        </div>
                        {option.badge && (
                          <div className="text-xs px-1 py-0.5 rounded font-bold mb-1" style={{
                            backgroundColor: option.badge === 'Most Popular' ? '#3b82f6' : '#f59e0b',
                            color: colors.background.primary,
                            fontSize: '10px'
                          }}>
                            {option.badge}
                          </div>
                        )}
                        <div className="text-sm font-bold" style={{ color: colors.text.primary }}>
                          ${option.priceUSD.toFixed(0)}
                        </div>
                        <div className="text-xs" style={{ color: colors.text.secondary }}>
                          ₹{option.priceINR.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subscription Plans Section - Small boxes in a row */}
              {subscriptionOptions.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-semibold mb-2" style={{ color: colors.text.secondary }}>Pricing Plans</h4>
                  <div className="flex gap-2 overflow-x-auto">
                    {subscriptionOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => setSelectedLicense(option.id)}
                        className="flex-shrink-0 p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] text-center min-w-[90px]"
                        style={{
                          borderColor: selectedLicense === option.id ? colors.interactive.primary : colors.border.primary,
                          backgroundColor: selectedLicense === option.id ? colors.interactive.primary + '20' : 'transparent'
                        }}
                      >
                        <div className="text-xs font-bold mb-1" style={{ color: colors.text.primary }}>
                          {option.label}
                        </div>
                        <div className="text-sm font-bold" style={{ color: colors.text.primary }}>
                          ${option.priceUSD.toFixed(0)}
                        </div>
                        <div className="text-xs" style={{ color: colors.text.secondary }}>
                          ₹{option.priceINR.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lifetime License Section - Small box */}
              {lifetimeOptions.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-semibold mb-2" style={{ color: colors.text.secondary }}>Lifetime Access</h4>
                  <div className="flex gap-2">
                    {lifetimeOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => setSelectedLicense(option.id)}
                        className="flex-shrink-0 p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] text-center min-w-[120px]"
                        style={{
                          borderColor: selectedLicense === option.id ? colors.interactive.primary : colors.border.primary,
                          backgroundColor: selectedLicense === option.id ? colors.interactive.primary + '20' : 'transparent'
                        }}
                      >
                        <div className="text-xs font-bold mb-1" style={{ color: colors.text.primary }}>
                          {option.label}
                        </div>
                        <div className="text-xs px-1 py-0.5 rounded font-bold mb-1" style={{
                          backgroundColor: '#10b981',
                          color: colors.background.primary,
                          fontSize: '10px'
                        }}>
                          Best Value
                        </div>
                        <div className="text-sm font-bold" style={{ color: colors.text.primary }}>
                          ${option.priceUSD.toFixed(0)}
                        </div>
                        <div className="text-xs" style={{ color: colors.text.secondary }}>
                          ₹{option.priceINR.toLocaleString()}
                        </div>
                        {option.savings && (
                          <div className="text-xs text-green-400 mt-1">{option.savings}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Membership Section - Small box */}
              {membershipOptions.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-semibold mb-2" style={{ color: colors.text.secondary }}>Premium Membership</h4>
                  <div className="flex gap-2">
                    {membershipOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => setSelectedLicense(option.id)}
                        className="flex-shrink-0 p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] text-center min-w-[110px]"
                        style={{
                          borderColor: selectedLicense === option.id ? colors.interactive.primary : colors.border.primary,
                          backgroundColor: selectedLicense === option.id ? colors.interactive.primary + '20' : 'transparent'
                        }}
                      >
                        <div className="text-xs font-bold mb-1" style={{ color: colors.text.primary }}>
                          {option.label}
                        </div>
                        <div className="text-xs px-1 py-0.5 rounded font-bold mb-1" style={{
                          backgroundColor: '#f59e0b',
                          color: colors.background.primary,
                          fontSize: '10px'
                        }}>
                          Premium
                        </div>
                        <div className="text-sm font-bold" style={{ color: colors.text.primary }}>
                          ${option.priceUSD.toFixed(0)}
                        </div>
                        <div className="text-xs" style={{ color: colors.text.secondary }}>
                          ₹{option.priceINR.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Subscription Plans */}
              {adminSubscriptionOptions.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-semibold mb-2" style={{ color: colors.text.secondary }}>Subscription Plans</h4>
                  <div className="flex gap-2">
                    {adminSubscriptionOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => setSelectedLicense(option.id)}
                        className="flex-shrink-0 p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] text-center min-w-[110px]"
                        style={{
                          borderColor: selectedLicense === option.id ? colors.interactive.primary : colors.border.primary,
                          backgroundColor: selectedLicense === option.id ? colors.interactive.primary + '20' : 'transparent'
                        }}
                      >
                        <div className="text-xs font-bold mb-1" style={{ color: colors.text.primary }}>
                          {option.label}
                        </div>
                        {option.badge && (
                          <div className="text-xs px-1 py-0.5 rounded font-bold mb-1" style={{
                            backgroundColor: option.badge === 'Flexible' ? '#10b981' : '#3b82f6',
                            color: colors.background.primary,
                            fontSize: '10px'
                          }}>
                            {option.badge}
                          </div>
                        )}
                        <div className="text-sm font-bold" style={{ color: colors.text.primary }}>
                          ${option.priceUSD.toFixed(0)}
                        </div>
                        <div className="text-xs" style={{ color: colors.text.secondary }}>
                          ₹{option.priceINR.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Option Summary */}
              {pricingOptions.length > 1 && selectedOption && (
                <div
                  className="rounded-lg p-3 text-center transition-colors duration-200"
                  style={{ backgroundColor: colors.background.primary }}
                >
                  <div className="text-lg lg:text-2xl font-bold mb-1" style={{ color: colors.text.primary }}>
                    ${selectedOption.priceUSD.toFixed(0)}
                  </div>
                  <div className="text-sm lg:text-base mb-1" style={{ color: colors.text.secondary }}>
                    ₹{selectedOption.priceINR.toLocaleString()}
                  </div>
                  <p className="text-xs lg:text-sm" style={{ color: colors.text.secondary }}>
                    {selectedOption.label} • GST Included
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleAddToCart}
                className="w-full font-bold py-2.5 lg:py-3 rounded-lg text-sm lg:text-base transition-colors duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: colors.interactive.primary,
                  color: colors.background.primary
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.interactive.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.interactive.primary;
                }}
              >
                <span>🛒</span>
                {isInCart ? `In Cart (${cartQuantity})` : 'Add to Cart'}
              </button>

              <button
                className="w-full border font-bold py-3 rounded-xl transition-colors duration-200"
                style={{
                  borderColor: colors.interactive.primary,
                  color: colors.interactive.primary,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.interactive.primary;
                  e.currentTarget.style.color = colors.background.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.interactive.primary;
                }}
              >
                Buy Now
              </button>

              <button
                className="w-full border font-medium py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.secondary,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.background.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>❓</span>
                Request Inquiry
              </button>
            </div>
          </div>
        </div>

        {/* Keep only Activation Video if it exists separately */}
        {product.activationVideoUrl && (
          <div className="mt-8 lg:mt-16">
            <div
              className="rounded-xl lg:rounded-2xl p-4 lg:p-8 transition-colors duration-200"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                <span className="text-xl lg:text-2xl">▶️</span>
                <h2 className="text-xl lg:text-2xl font-bold" style={{ color: colors.text.primary }}>Activation Video Demo</h2>
              </div>
              <p className="mb-6" style={{ color: colors.text.secondary }}>
                Watch this step-by-step guide to activate your {product.name} license
              </p>
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                {product.activationVideoUrl.includes('youtube.com') || product.activationVideoUrl.includes('youtu.be') ? (
                  <iframe
                    src={product.activationVideoUrl.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    title="Activation Video Demo"
                  />
                ) : (
                  <video
                    src={product.activationVideoUrl}
                    className="w-full h-full"
                    controls
                    title="Activation Video Demo"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tabs Section */}
        <div className="mt-8 lg:mt-16">
          {/* Tab Navigation */}
          <div className="border-b" style={{ borderColor: colors.border.primary }}>
            <div className="flex gap-4 lg:gap-8 overflow-x-auto scrollbar-hide">
              {[
                { key: 'features', label: 'Features' },
                { key: 'requirements', label: 'System' },
                { key: 'reviews', label: 'Reviews (3)' },
                { key: 'faq', label: 'FAQ' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className="py-3 lg:py-4 px-1 lg:px-2 font-medium transition-colors duration-200 border-b-2 whitespace-nowrap text-sm lg:text-base flex-shrink-0"
                  style={{
                    borderColor: activeTab === tab.key ? colors.interactive.primary : 'transparent',
                    color: activeTab === tab.key ? colors.interactive.primary : colors.text.secondary
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.key) {
                      e.currentTarget.style.color = colors.text.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.key) {
                      e.currentTarget.style.color = colors.text.secondary;
                    }
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="py-4 lg:py-8">
            {activeTab === 'features' && (
              <div>
                <h3 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6" style={{ color: colors.text.primary }}>Key Features</h3>
                <p className="mb-6 lg:mb-8 text-sm lg:text-base" style={{ color: colors.text.secondary }}>
                  Comprehensive overview of {product.name} capabilities and tools
                </p>

                {/* Show structured features if available */}
                {product.keyFeatures && product.keyFeatures.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {product.keyFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="rounded-xl lg:rounded-2xl p-4 lg:p-6 border transition-colors duration-200"
                        style={{
                          backgroundColor: colors.background.secondary,
                          borderColor: colors.border.primary
                        }}
                      >
                        <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                          <div className="text-yellow-400 flex-shrink-0">
                            {renderIcon(feature.icon, "w-5 h-5 lg:w-6 lg:h-6")}
                          </div>
                          <h4 className="text-lg lg:text-xl font-bold" style={{ color: colors.text.primary }}>{feature.title}</h4>
                        </div>
                        <p className="text-sm lg:text-base" style={{ color: colors.text.secondary }}>{feature.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Default features if no structured or rich text features data */}
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon('Check', 'text-green-400 w-6 h-6')}
                        <h4 className="text-xl font-bold" style={{ color: colors.text.primary }}>Advanced 2D Drafting</h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>Precise drafting tools with automated workflows</p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon('Zap', 'text-orange-400 w-6 h-6')}
                        <h4 className="text-xl font-bold" style={{ color: colors.text.primary }}>3D Modeling & Visualization</h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>Create stunning 3D models with photorealistic rendering</p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon('Users', 'text-blue-400 w-6 h-6')}
                        <h4 className="text-xl font-bold" style={{ color: colors.text.primary }}>Cloud Collaboration</h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>Real-time collaboration with team members worldwide</p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon('Shield', 'text-purple-400 w-6 h-6')}
                        <h4 className="text-xl font-bold" style={{ color: colors.text.primary }}>Industry-Specific Toolsets</h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>Specialized tools for architecture, engineering, and construction</p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon('Smartphone', 'text-yellow-400 w-6 h-6')}
                        <h4 className="text-xl font-bold" style={{ color: colors.text.primary }}>Mobile & Web Access</h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>Access your designs anywhere with mobile and web apps</p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon('Lock', 'text-red-400 w-6 h-6')}
                        <h4 className="text-xl font-bold" style={{ color: colors.text.primary }}>Enhanced Security</h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>Enterprise-grade security features and compliance</p>
                    </div>
                  </div>
                )}

                {/* Additional product info */}
                <div
                  className="mt-8 rounded-2xl p-6 transition-colors duration-200"
                  style={{ backgroundColor: colors.background.secondary }}
                >
                  <h4 className="text-xl font-bold mb-4" style={{ color: colors.text.primary }}>Product Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ color: colors.text.secondary }}>
                    <div>
                      <span className="font-medium" style={{ color: colors.interactive.primary }}>Category:</span>
                      <span className="ml-2 capitalize">{product.category?.replace('-', ' ')}</span>
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: colors.interactive.primary }}>Brand:</span>
                      <span className="ml-2">{product.brand || product.company}</span>
                    </div>
                    <div>
                      <span className="text-orange-400 font-medium">Version:</span>
                      <span className="ml-2">{product.version}</span>
                    </div>
                    {product.status && (
                      <div>
                        <span className="text-orange-400 font-medium">Status:</span>
                        <span className={`ml-2 capitalize ${product.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {product.status}
                        </span>
                      </div>
                    )}
                    {product.isBestSeller && (
                      <div>
                        <span className="text-orange-400 font-medium">Badge:</span>
                        <span className="ml-2 text-yellow-400">⭐ Best Seller</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requirements' && (
              <div>
                <h3 className="text-2xl font-bold mb-6" style={{ color: colors.text.primary }}>System Requirements</h3>
                <p className="mb-8" style={{ color: colors.text.secondary }}>
                  Minimum system specifications for {product.name}
                </p>

                {/* Show structured requirements if available */}
                {product.systemRequirements && product.systemRequirements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.systemRequirements.map((requirement, index) => (
                      <div
                        key={index}
                        className="rounded-2xl p-6 border transition-colors duration-200"
                        style={{
                          backgroundColor: colors.background.secondary,
                          borderColor: colors.border.primary
                        }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="text-blue-400">
                            {renderIcon(requirement.icon, "w-6 h-6")}
                          </div>
                          <h4 className="text-xl font-bold" style={{ color: colors.text.primary }}>{requirement.title}</h4>
                        </div>
                        <p style={{ color: colors.text.secondary }}>{requirement.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Default requirements if no structured or rich text requirements data */}
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon('Monitor', 'text-blue-400 w-6 h-6')}
                        <h4 className="text-xl font-bold" style={{ color: colors.text.primary }}>Operating System</h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>Windows 10/11 (64-bit) or macOS 10.15+</p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon('Cpu', 'text-green-400 w-6 h-6')}
                        <h4 className="text-xl font-bold" style={{ color: colors.text.primary }}>Processor</h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>Intel Core i5 or equivalent AMD processor (2.5GHz or higher)</p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon('MemoryStick', 'text-purple-400 w-6 h-6')}
                        <h4 className="text-xl font-bold" style={{ color: colors.text.primary }}>Memory (RAM)</h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>8 GB RAM minimum (16 GB recommended for optimal performance)</p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon('Gamepad2', 'text-orange-400 w-6 h-6')}
                        <h4 className="text-xl font-bold" style={{ color: colors.text.primary }}>Graphics Card</h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>DirectX 11 or DirectX 12 compatible graphics card with 1GB VRAM</p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon('HardDrive', 'text-yellow-400 w-6 h-6')}
                        <h4 className="text-xl font-bold" style={{ color: colors.text.primary }}>Storage Space</h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>7 GB free disk space for installation</p>
                    </div>
                    <div
                      className="rounded-2xl p-6 transition-colors duration-200"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {renderIcon('Wifi', 'text-cyan-400 w-6 h-6')}
                        <h4 className="text-xl font-bold" style={{ color: colors.text.primary }}>Internet Connection</h4>
                      </div>
                      <p style={{ color: colors.text.secondary }}>Broadband internet connection required for activation and cloud features</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-2xl font-bold mb-6" style={{ color: colors.text.primary }}>Customer Reviews</h3>
                <p className="mb-8" style={{ color: colors.text.secondary }}>
                  What users are saying about {product.name}
                </p>

                {/* Review Form */}
                <div
                  className="rounded-2xl p-6 mb-8 transition-colors duration-200"
                  style={{ backgroundColor: colors.background.secondary }}
                >
                  <h4 className="text-xl font-bold mb-4" style={{ color: colors.text.primary }}>Write a Review</h4>
                  <p className="mb-4" style={{ color: colors.text.secondary }}>Share your experience with this product...</p>
                  <button
                    className="font-bold py-3 px-6 rounded-xl transition-colors duration-200"
                    style={{
                      backgroundColor: colors.interactive.primary,
                      color: colors.background.primary
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.interactive.primaryHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.interactive.primary;
                    }}
                  >
                    Post Review
                  </button>
                </div>

                {/* Sample Review */}
                <div
                  className="rounded-2xl p-6 transition-colors duration-200"
                  style={{ backgroundColor: colors.background.secondary }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                      style={{
                        backgroundColor: colors.interactive.primary,
                        color: colors.background.primary
                      }}
                    >
                      JS
                    </div>
                    <div>
                      <h5 className="font-bold" style={{ color: colors.text.primary }}>John Smith</h5>
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(5)}
                        </div>
                        <span className="text-sm" style={{ color: colors.text.secondary }}>2025-01-15</span>
                      </div>
                    </div>
                  </div>
                  <p className="mb-4" style={{ color: colors.text.secondary }}>
                    Excellent software with powerful features. Great for professional CAD work. The new collaboration features are game-changing!
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      className="flex items-center gap-2 transition-colors duration-200"
                      style={{ color: colors.text.secondary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = colors.text.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = colors.text.secondary;
                      }}
                    >
                      <span>👍</span>
                      Helpful (12)
                    </button>
                    <button
                      className="transition-colors duration-200"
                      style={{ color: colors.text.secondary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = colors.text.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = colors.text.secondary;
                      }}
                    >
                      Reply
                    </button>
                  </div>

                  {/* Reply */}
                  <div
                    className="ml-8 mt-4 rounded-xl p-4 transition-colors duration-200"
                    style={{ backgroundColor: colors.background.primary }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold" style={{ color: colors.interactive.primary }}>AutoCAD Support</span>
                      <span className="text-sm" style={{ color: colors.text.secondary }}>2025-01-16</span>
                    </div>
                    <p style={{ color: colors.text.secondary }}>
                      Thank you for the positive feedback! We're glad you're enjoying the new features.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div>
                <h3 className="text-2xl font-bold mb-6" style={{ color: colors.text.primary }}>Frequently Asked Questions</h3>
                <p className="mb-8" style={{ color: colors.text.secondary }}>
                  Get answers to common questions about {product.name}
                </p>

                <div className="space-y-4">
                  {product.faqs && product.faqs.length > 0 ? (
                    product.faqs.map((faq, index) => (
                      <FAQItem
                        key={index}
                        question={faq.question}
                        answer={faq.answer}
                        index={index}
                        colors={colors}
                      />
                    ))
                  ) : (
                    <>
                      <FAQItem
                        question="How do I activate my license?"
                        answer="After purchase, you'll receive an email with your license key and activation instructions. You can also watch our activation video demo above for step-by-step guidance. The process typically takes just a few minutes and requires an internet connection for initial activation."
                        index={0}
                        colors={colors}
                      />
                      <FAQItem
                        question="What's the difference between Yearly and Lifetime licenses?"
                        answer="Yearly licenses provide access for 12 months with all updates and support included. Lifetime licenses give you permanent access with no expiration date and all future updates, making them the most cost-effective option for long-term users. Both license types include full technical support."
                        index={1}
                        colors={colors}
                      />
                      <FAQItem
                        question="Do you provide technical support?"
                        answer="Yes! We provide comprehensive technical support for all licensed users. Our support team is available via email, live chat, and phone during business hours (9 AM - 6 PM EST, Monday-Friday). We also have an extensive knowledge base and video tutorials available 24/7."
                        index={2}
                        colors={colors}
                      />
                      <FAQItem
                        question="Can I use this on multiple devices?"
                        answer="Your license allows installation on up to 3 devices for personal use, as long as you're the primary user. For commercial or team use with multiple users, please contact us for multi-user licensing options. We offer volume discounts for businesses and educational institutions."
                        index={3}
                        colors={colors}
                      />
                      <FAQItem
                        question="What are the system requirements?"
                        answer="Please check the 'Requirements' tab above for detailed system specifications. Generally, you'll need a modern operating system (Windows 10/11 or macOS 10.15+), at least 8GB RAM, and a compatible graphics card. For optimal performance, we recommend 16GB RAM and a dedicated graphics card."
                        index={4}
                        colors={colors}
                      />
                      <FAQItem
                        question="Is there a money-back guarantee?"
                        answer="Yes, we offer a 30-day money-back guarantee on all purchases. If you're not completely satisfied with your purchase, contact our support team within 30 days for a full refund. The software must be uninstalled from all devices to process the refund."
                        index={5}
                        colors={colors}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-8 lg:mt-16">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-3xl font-bold">Related Products</h2>
            <button className="text-orange-400 hover:text-orange-300 font-medium">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sample Related Products */}
            {[
              { name: 'Inventor Professional 2025', price: '$2,300', image: '/api/placeholder/300/200' },
              { name: '3ds Max 2025', price: '$1,950', image: '/api/placeholder/300/200' },
              { name: 'Maya 2025', price: '$2,100', image: '/api/placeholder/300/200' },
              { name: 'Revit Architecture 2025', price: '$2,650', image: '/api/placeholder/300/200' }
            ].map((relatedProduct, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                <div className="aspect-video bg-gray-700 flex items-center justify-center">
                  <img src={relatedProduct.image} alt={relatedProduct.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2">{relatedProduct.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-400">{relatedProduct.price}</span>
                    <button className="bg-orange-400 hover:bg-orange-500 text-black font-bold py-2 px-4 rounded-lg text-sm transition-colors duration-200">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
