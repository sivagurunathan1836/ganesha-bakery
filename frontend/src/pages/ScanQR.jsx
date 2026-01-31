import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCamera, FiAlertTriangle } from 'react-icons/fi';
import QRScanner from '../components/QRScanner';
import { productsAPI, ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

const ScanQR = () => {
    const navigate = useNavigate();
    const [scanResult, setScanResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleScanSuccess = async (decodedText) => {
        console.log("Scanned:", decodedText);
        setScanResult(decodedText);
        setLoading(true);

        try {
            // Logic to handle different types of QR codes

            // 1. Check if it's a valid MongoDB ID (24 hex characters)
            const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

            if (mongoIdPattern.test(decodedText)) {
                // Try searching as Product ID first
                try {
                    await productsAPI.getById(decodedText);
                    toast.success('Product found!');
                    navigate(`/products/${decodedText}`);
                    return;
                } catch (productError) {
                    // Not a product, try Order ID
                    try {
                        await ordersAPI.getById(decodedText);
                        toast.success('Order found!');
                        navigate(`/orders/${decodedText}`);
                        return;
                    } catch (orderError) {
                        toast.error('ID found but no matching Product or Order.');
                    }
                }
            }

            // 2. Check if it's a URL within our app
            else if (decodedText.includes(window.location.origin)) {
                const path = decodedText.replace(window.location.origin, '');
                navigate(path);
                return;
            }

            // 3. Fallback: Show result
            toast('QR Code Scanned: ' + decodedText, {
                icon: '📷',
                duration: 4000
            });

        } catch (error) {
            console.error('Scan handling error:', error);
            toast.error('Error processing QR code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '600px' }}>
                <h1 className="section-title" style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <FiCamera style={{ marginBottom: '-4px' }} /> Scan QR
                </h1>

                <div className="card" style={{ padding: '20px', minHeight: '400px' }}>
                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p style={{ marginTop: '20px' }}>Processing...</p>
                        </div>
                    ) : (
                        <QRScanner onScanSuccess={handleScanSuccess} />
                    )}
                </div>

                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <div style={{
                        background: 'var(--primary-light)',
                        padding: '16px',
                        borderRadius: 'var(--border-radius-sm)',
                        display: 'inline-block',
                        textAlign: 'left'
                    }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <FiAlertTriangle /> How to use
                        </h4>
                        <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem' }}>
                            <li>Allow camera access when prompted</li>
                            <li>Ensure good lighting</li>
                            <li>Scan product or order QR codes</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScanQR;
