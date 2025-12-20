import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useCartContext } from '../contexts/CartContext';

const PaymentCallback: React.FC = () => {
  const navigate = useNavigate();
  const { clearCart } = useCartContext();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [message, setMessage] = useState('Processing payment...');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      // Get transaction ID from session storage (stored before redirect)
      const merchantTransactionId = sessionStorage.getItem('phonepe_transaction_id');

      if (!merchantTransactionId) {
        setStatus('failed');
        setMessage('Payment verification failed. Transaction ID not found.');
        toast.error('Payment verification failed');
        return;
      }

      console.log('🔍 Verifying PhonePe payment:', merchantTransactionId);

      // Verify payment with backend
      const response = await axios.post(
        `${API_BASE_URL}/api/payments/verify-phonepe`,
        { merchantTransactionId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setStatus('success');
        setMessage('Payment successful! Redirecting to orders...');
        toast.success('Payment completed successfully!');
        
        // Clear session storage
        sessionStorage.removeItem('phonepe_transaction_id');
        sessionStorage.removeItem('phonepe_order_id');
        
        // Clear cart
        clearCart();

        // Redirect to orders page after 2 seconds
        setTimeout(() => {
          navigate('/my-orders');
        }, 2000);
      } else {
        setStatus('failed');
        setMessage('Payment verification failed. Please contact support.');
        toast.error('Payment verification failed');
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      setStatus('failed');
      setMessage(error.response?.data?.message || 'Payment verification failed');
      toast.error('Payment verification failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '48px 32px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {status === 'processing' && (
          <>
            <div style={{
              width: '80px',
              height: '80px',
              border: '6px solid #f3f3f3',
              borderTop: '6px solid #7c3aed',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 24px'
            }} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1a1a1a',
              marginBottom: '12px'
            }}>
              Processing Payment
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#666',
              marginBottom: '24px'
            }}>
              {message}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#999'
            }}>
              Please wait while we verify your payment...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              animation: 'scaleIn 0.5s ease-out'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <style>{`
              @keyframes scaleIn {
                0% { transform: scale(0); }
                100% { transform: scale(1); }
              }
            `}</style>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#10b981',
              marginBottom: '12px'
            }}>
              Payment Successful!
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#666',
              marginBottom: '24px'
            }}>
              {message}
            </p>
            <button
              onClick={() => navigate('/my-orders')}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              View Orders
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#ef4444',
              marginBottom: '12px'
            }}>
              Payment Failed
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#666',
              marginBottom: '24px'
            }}>
              {message}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/checkout')}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                style={{
                  background: '#f3f4f6',
                  color: '#1a1a1a',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Go Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
