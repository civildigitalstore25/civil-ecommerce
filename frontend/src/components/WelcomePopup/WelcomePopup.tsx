import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePopup.css';
import { createWelcomeLead } from '../../api/leadApi';
import type { WelcomeLeadData } from '../../api/leadApi';

interface WelcomePopupProps {
    onClose: () => void;
}

interface FormErrors {
    name?: string;
    email?: string;
    whatsappNumber?: string;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<WelcomeLeadData>({
        name: '',
        email: '',
        whatsappNumber: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [discountCode, setDiscountCode] = useState('');
    const [discountValue, setDiscountValue] = useState(0);
    const [validUntil, setValidUntil] = useState<Date | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [generalError, setGeneralError] = useState('');

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // WhatsApp number validation
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!formData.whatsappNumber.trim()) {
            newErrors.whatsappNumber = 'WhatsApp number is required';
        } else if (!phoneRegex.test(formData.whatsappNumber.replace(/[\s-]/g, ''))) {
            newErrors.whatsappNumber = 'Please enter a valid phone number (10-15 digits)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }

        // Clear general error
        if (generalError) {
            setGeneralError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setGeneralError('');

        try {
            const response = await createWelcomeLead(formData);

            if (response.success) {
                setDiscountCode(response.data.discountCode);
                setDiscountValue(response.data.discountValue);
                setValidUntil(new Date(response.data.validUntil));
                setIsSuccess(true);

                // Mark popup as completed in localStorage
                localStorage.setItem('welcomePopupCompleted', 'true');
                localStorage.setItem('welcomeDiscountCode', response.data.discountCode);
            }
        } catch (error: any) {
            console.error('Error submitting form:', error);

            if (error.response?.data?.error) {
                const errorData = error.response.data;

                // Handle registered user error
                if (errorData.isRegistered) {
                    setGeneralError(errorData.error);
                    // Mark popup as completed so it doesn't show again
                    localStorage.setItem('welcomePopupCompleted', 'true');
                }
                // Handle already claimed error
                else if (errorData.alreadyClaimed) {
                    setGeneralError(errorData.error);
                    // Mark popup as completed so it doesn't show again
                    localStorage.setItem('welcomePopupCompleted', 'true');
                }
                // Other errors
                else {
                    setGeneralError(errorData.error);
                }
            } else {
                setGeneralError('Something went wrong. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(discountCode);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy code:', error);
        }
    };

    const handleShopNow = () => {
        onClose();
        // Navigate to home page
        navigate('/');
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isSuccess) {
            onClose();
        }
    };

    const formatDate = (date: Date | null): string => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="welcome-popup-overlay" onClick={handleOverlayClick}>
            <div className="welcome-popup">
                {!isSuccess && (
                    <button className="welcome-popup-close" onClick={onClose} aria-label="Close">
                        ×
                    </button>
                )}

                {!isSuccess ? (
                    <>
                        <div className="welcome-popup-header">
                            <img src="/whitelogo.png" alt="Store Logo" className="welcome-popup-logo" />
                            <h2>Welcome to Our Store!</h2>
                            <p>Fill this form to get discount</p>
                        </div>

                        <div className="welcome-popup-content">
                            <form className="welcome-popup-form" onSubmit={handleSubmit}>
                                {generalError && (
                                    <div className="welcome-error-message" style={{ textAlign: 'center', marginBottom: '10px' }}>
                                        {generalError}
                                    </div>
                                )}

                                <div className="welcome-form-group">
                                    <label htmlFor="name">
                                        Full Name <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className={`welcome-form-input ${errors.name ? 'error' : ''}`}
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        disabled={isSubmitting}
                                    />
                                    {errors.name && (
                                        <span className="welcome-error-message">{errors.name}</span>
                                    )}
                                </div>

                                <div className="welcome-form-group">
                                    <label htmlFor="email">
                                        Email Address <span className="required">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className={`welcome-form-input ${errors.email ? 'error' : ''}`}
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        disabled={isSubmitting}
                                    />
                                    {errors.email && (
                                        <span className="welcome-error-message">{errors.email}</span>
                                    )}
                                </div>

                                <div className="welcome-form-group">
                                    <label htmlFor="whatsappNumber">
                                        WhatsApp Number <span className="required">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="whatsappNumber"
                                        name="whatsappNumber"
                                        className={`welcome-form-input ${errors.whatsappNumber ? 'error' : ''}`}
                                        value={formData.whatsappNumber}
                                        onChange={handleChange}
                                        placeholder="Enter your WhatsApp number"
                                        disabled={isSubmitting}
                                    />
                                    {errors.whatsappNumber && (
                                        <span className="welcome-error-message">{errors.whatsappNumber}</span>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="welcome-submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="welcome-loading-spinner" style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}></div>
                                            Processing...
                                        </>
                                    ) : (
                                        'Submit'
                                    )}
                                </button>

                                <p className="welcome-privacy-note">
                                    Your information is safe with us. We respect your privacy.
                                </p>
                            </form>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="welcome-popup-header">
                            <img src="/whitelogo.png" alt="Store Logo" className="welcome-popup-logo" />
                            <h2>Congratulations!</h2>
                            <p>Your discount code is ready</p>
                        </div>

                        <div className="welcome-popup-content">
                            <div className="welcome-success-content">
                                <p className="welcome-success-message">
                                    We've sent this code to your email at <strong>{formData.email}</strong>
                                </p>

                                <div className="welcome-coupon-display">
                                    <div className="welcome-coupon-label">Your Discount Code</div>
                                    <div className="welcome-coupon-code-wrapper">
                                        <div className="welcome-coupon-code">{discountCode}</div>
                                        <button
                                            className={`welcome-copy-btn ${isCopied ? 'copied' : ''}`}
                                            onClick={handleCopyCode}
                                        >
                                            {isCopied ? '✓ Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                    <div className="welcome-discount-badge">
                                        {discountValue}% OFF
                                    </div>
                                    <div className="welcome-coupon-info">
                                        <p style={{ margin: '5px 0' }}>
                                            ✅ Valid until: <strong>{formatDate(validUntil)}</strong>
                                        </p>
                                        <p style={{ margin: '5px 0' }}>
                                            ✅ One-time use only
                                        </p>
                                        <p style={{ margin: '5px 0' }}>
                                            ✅ Apply at checkout
                                        </p>
                                    </div>
                                </div>

                                <button className="welcome-shop-now-btn" onClick={handleShopNow}>
                                    Start Shopping Now 🛍️
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WelcomePopup;
