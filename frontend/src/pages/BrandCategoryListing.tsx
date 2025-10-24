import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, Package } from 'lucide-react';
import { useProducts } from '../api/productApi';
import { useUser } from '../api/userQueries';
import { useCartContext } from '../contexts/CartContext';
import { useAdminTheme } from '../contexts/AdminThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Swal from 'sweetalert2';

// Brand-Category mapping for display names
const brandLabels: Record<string, string> = {
    'autodesk': 'Autodesk',
    'microsoft': 'Microsoft',
    'adobe': 'Adobe',
    'coreldraw': 'Coreldraw',
    'antivirus': 'Antivirus',
    'structural-softwares': 'Structural Softwares',
    'architectural-softwares': 'Architectural Softwares',
    'ebook': 'Ebook'
};

const categoryLabels: Record<string, string> = {
    'autocad': 'AutoCAD',
    '3ds-max': '3ds MAX',
    'revit': 'Revit',
    'maya': 'Maya',
    'fusion': 'Fusion',
    'navisworks-manage': 'Navisworks Manage',
    'inventor-professional': 'Inventor Professional',
    'autocad-lt': 'AutoCAD LT',
    'aec-collection': 'AEC Collection',
    'civil-3d': 'Civil 3D',
    'map-3d': 'Map 3D',
    'autocad-mechanical': 'AutoCAD Mechanical',
    'autocad-electrical': 'AutoCAD Electrical',
    'autocad-mep': 'AutoCAD MEP',
    'microsoft-365': 'Microsoft 365',
    'microsoft-professional': 'Microsoft Professional',
    'microsoft-projects': 'Microsoft Projects',
    'server': 'Server',
    'adobe-acrobat': 'Adobe Acrobat',
    'photoshop': 'Photoshop',
    'lightroom': 'Lightroom',
    'after-effect': 'After Effect',
    'premier-pro': 'Premier Pro',
    'illustrator': 'Illustrator',
    'adobe-creative-cloud': 'Adobe Creative Cloud',
    'coreldraw-graphics-suite': 'Coreldraw Graphics Suite',
    'coreldraw-technical-suite': 'Coreldraw Technical Suite',
    'k7-security': 'K7 Security',
    'quick-heal': 'Quick Heal',
    'hyper-say': 'Hyper Say',
    'norton': 'Norton',
    'mcafee': 'McAfee',
    'eset': 'ESET',
    'e-tab': 'E-Tab',
    'safe': 'Safe',
    'sap-2000': 'Sap 2000',
    'tekla': 'Tekla',
    'lumion': 'Lumion',
    'twin-motion': 'Twin Motion',
    'd5-render': 'D5 Render',
    'archi-cad': 'Archi CAD'
};

const BrandCategoryListing: React.FC = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const brand = params.get("brand") || "";
    const category = params.get("category") || "";

    // Build query based on brand and category
    const queryParams: any = {};
    if (brand) {
        queryParams.company = brand; // Backend uses 'company' field
    }
    if (category) {
        queryParams.category = category;
    }

    const { data = { products: [], totalPages: 0, currentPage: 0, total: 0 } } = useProducts(queryParams);
    const products = data.products || [];
    const navigate = useNavigate();
    const { addItem } = useCartContext();
    const { data: user } = useUser();
    const { colors } = useAdminTheme();
    const { formatPriceWithSymbol } = useCurrency();

    const handleAddToCart = async (product: any, licenseType: '1year' = '1year') => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await addItem(product, licenseType, 1);
            Swal.fire({
                title: 'Added to Cart!',
                text: `${product.name} has been added to your cart`,
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to add item to cart',
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };

    // Get display title
    const getDisplayTitle = () => {
        if (category && brand) {
            const categoryName = categoryLabels[category] || category;
            const brandName = brandLabels[brand] || brand;
            return `${categoryName} - ${brandName}`;
        } else if (brand) {
            return brandLabels[brand] || brand;
        } else if (category) {
            return categoryLabels[category] || category;
        }
        return 'All Products';
    };

    return (
        <div
            className="min-h-screen transition-colors duration-200"
            style={{ backgroundColor: colors.background.secondary }}
        >
            <div className="max-w-7xl mx-auto py-8 px-4">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm mb-4 transition-colors duration-200" style={{ color: colors.text.secondary }}>
                    <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">
                        Home
                    </button>
                    {brand && (
                        <>
                            <span className="mx-2">/</span>
                            <button onClick={() => navigate(`/category?brand=${brand}`)} className="hover:text-blue-600 transition-colors">
                                {brandLabels[brand] || brand}
                            </button>
                        </>
                    )}
                    {category && (
                        <>
                            <span className="mx-2">/</span>
                            <span style={{ color: colors.text.primary }}>{categoryLabels[category] || category}</span>
                        </>
                    )}
                </div>

                {/* Header */}
                <div className="mb-6">
                    <h1
                        className="text-4xl font-bold mb-2 transition-colors duration-200"
                        style={{ color: colors.text.primary }}
                    >
                        {getDisplayTitle()}
                    </h1>
                    <p
                        className="text-lg transition-colors duration-200"
                        style={{ color: colors.text.secondary }}
                    >
                        {products.length} product{products.length !== 1 && 's'} found
                    </p>
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Package className="w-24 h-24 mb-4" style={{ color: colors.text.secondary }} />
                        <h3 className="text-2xl font-semibold mb-2" style={{ color: colors.text.primary }}>
                            No Products Found
                        </h3>
                        <p className="text-lg mb-6" style={{ color: colors.text.secondary }}>
                            We couldn't find any products in this category.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {products.map((product: any) => (
                            <div
                                key={product._id}
                                className="border rounded-2xl shadow hover:shadow-lg transition-all duration-200 p-5 flex flex-col hover:scale-[1.02]"
                                style={{
                                    backgroundColor: colors.background.primary,
                                    borderColor: colors.border.primary
                                }}
                            >
                                {/* Image */}
                                <div
                                    className="rounded-xl overflow-hidden h-52 mb-3 cursor-pointer transition-colors duration-200 relative"
                                    style={{ backgroundColor: colors.background.secondary }}
                                    onClick={() => navigate(`/product/${product._id}`)}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                                    />
                                    {product.isBestSeller && (
                                        <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full flex items-center text-xs font-semibold">
                                            <Star className="w-3 h-3 mr-1 fill-current" />
                                            Best Seller
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 flex flex-col">
                                    <h2
                                        className="text-lg font-semibold mb-1 transition-colors duration-200 cursor-pointer hover:text-blue-600"
                                        style={{ color: colors.text.primary }}
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        {product.name}
                                    </h2>
                                    <p
                                        className="text-sm mb-2 transition-colors duration-200"
                                        style={{ color: colors.text.secondary }}
                                    >
                                        Version: {product.version}
                                    </p>
                                    {product.shortDescription && (
                                        <p
                                            className="text-sm mb-3 line-clamp-2 transition-colors duration-200"
                                            style={{ color: colors.text.secondary }}
                                        >
                                            {product.shortDescription}
                                        </p>
                                    )}

                                    {/* Pricing */}
                                    <div className="mt-auto">
                                        <div className="flex items-baseline gap-2 mb-3">
                                            <span
                                                className="text-2xl font-bold transition-colors duration-200"
                                                style={{ color: colors.text.primary }}
                                            >
                                                {formatPriceWithSymbol(product.price1INR || product.price1)}
                                            </span>
                                            <span
                                                className="text-sm transition-colors duration-200"
                                                style={{ color: colors.text.secondary }}
                                            >
                                                / 1 Year
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/product/${product._id}`)}
                                                className="flex-1 py-2.5 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandCategoryListing;
