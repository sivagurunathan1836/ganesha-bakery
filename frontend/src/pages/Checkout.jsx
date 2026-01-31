import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiCreditCard, FiCheck } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { cartAPI, ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'cod',
        notes: ''
    });

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await cartAPI.get();
                if (!response.data.cart || response.data.cart.items.length === 0) {
                    toast.error('Your cart is empty');
                    navigate('/cart');
                    return;
                }
                setCart(response.data.cart);
                setTotalAmount(response.data.totalAmount);
            } catch (error) {
                console.error('Error fetching cart:', error);
                navigate('/cart');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [navigate]);

    // Generate dynamic UPI payment URL with total amount
    const generateUPIUrl = () => {
        const upiId = 'sekarparameshwari09-1@oksbi';
        const payeeName = 'Ganesh Bakery';
        const amount = totalAmount.toFixed(2);
        const currency = 'INR';
        const transactionNote = 'Order Payment';

        return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=${currency}&tn=${encodeURIComponent(transactionNote)}`;
    };


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.street || !formData.city || !formData.state || !formData.pincode) {
            toast.error('Please fill in all address fields');
            return;
        }

        setSubmitting(true);
        try {
            const orderData = {
                shippingAddress: {
                    name: formData.name,
                    phone: formData.phone,
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode
                },
                paymentMethod: formData.paymentMethod,
                notes: formData.notes
            };

            const response = await ordersAPI.create(orderData);
            toast.success('Order placed successfully!');
            navigate(`/orders/${response.data._id}`);
        } catch (error) {
            console.error('Order placement error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to place order';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="page">
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <h1 className="section-title" style={{ marginBottom: '40px' }}>Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="checkout-container">
                        {/* Checkout Form */}
                        <div className="checkout-form">
                            {/* Shipping Address */}
                            <div style={{ marginBottom: '32px' }}>
                                <h2 className="checkout-section-title">
                                    <FiMapPin /> Shipping Address
                                </h2>

                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-input"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Street Address</label>
                                    <input
                                        type="text"
                                        name="street"
                                        className="form-input"
                                        placeholder="House No, Street, Area"
                                        value={formData.street}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            className="form-input"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            className="form-input"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        className="form-input"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div style={{ marginBottom: '32px' }}>
                                <h2 className="checkout-section-title">
                                    <FiCreditCard /> Payment Method
                                </h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '16px',
                                        border: formData.paymentMethod === 'cod' ? '2px solid var(--primary)' : '2px solid var(--gray-200)',
                                        borderRadius: 'var(--border-radius-sm)',
                                        cursor: 'pointer',
                                        background: formData.paymentMethod === 'cod' ? 'var(--primary-light)' : 'var(--white)'
                                    }}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleChange}
                                        />
                                        <div>
                                            <strong>Cash on Delivery</strong>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', margin: 0 }}>
                                                Pay when you receive your order
                                            </p>
                                        </div>
                                    </label>

                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '16px',
                                        border: formData.paymentMethod === 'online' ? '2px solid var(--primary)' : '2px solid var(--gray-200)',
                                        borderRadius: 'var(--border-radius-sm)',
                                        cursor: 'pointer',
                                        background: formData.paymentMethod === 'online' ? 'var(--primary-light)' : 'var(--white)'
                                    }}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            checked={formData.paymentMethod === 'online'}
                                            onChange={handleChange}
                                        />
                                        <div>
                                            <strong>Online Payment (UPI)</strong>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', margin: 0 }}>
                                                Pay using UPI - Scan QR code below
                                            </p>
                                        </div>
                                    </label>

                                    {/* QR Code Section - Show when online payment is selected */}
                                    {formData.paymentMethod === 'online' && (
                                        <div style={{
                                            marginTop: '16px',
                                            padding: '24px',
                                            background: 'var(--white)',
                                            border: '2px solid var(--primary)',
                                            borderRadius: 'var(--border-radius)',
                                            textAlign: 'center'
                                        }}>
                                            <h3 style={{
                                                fontSize: '1.1rem',
                                                fontWeight: '600',
                                                color: 'var(--secondary)',
                                                marginBottom: '16px'
                                            }}>
                                                Scan QR Code to Pay
                                            </h3>

                                            {/* Dynamic QR Code */}
                                            <div style={{
                                                background: 'var(--gray-50)',
                                                padding: '20px',
                                                borderRadius: 'var(--border-radius-sm)',
                                                display: 'inline-block',
                                                marginBottom: '16px'
                                            }}>
                                                <QRCodeSVG
                                                    value={generateUPIUrl()}
                                                    size={220}
                                                    level="H"
                                                    includeMargin={true}
                                                    bgColor="#ffffff"
                                                    fgColor="#000000"
                                                />
                                            </div>

                                            {/* Amount Display */}
                                            <div style={{
                                                background: 'linear-gradient(135deg, var(--primary-light) 0%, #fff5eb 100%)',
                                                padding: '12px 16px',
                                                borderRadius: 'var(--border-radius-sm)',
                                                marginBottom: '12px'
                                            }}>
                                                <p style={{
                                                    fontSize: '0.85rem',
                                                    color: 'var(--gray-600)',
                                                    margin: '0 0 4px 0',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    Amount to Pay
                                                </p>
                                                <p style={{
                                                    fontSize: '1.8rem',
                                                    fontWeight: '700',
                                                    color: 'var(--secondary)',
                                                    margin: 0
                                                }}>
                                                    ₹{totalAmount.toFixed(2)}
                                                </p>
                                            </div>

                                            <div style={{
                                                background: 'var(--primary-light)',
                                                padding: '12px 16px',
                                                borderRadius: 'var(--border-radius-sm)',
                                                marginBottom: '12px'
                                            }}>
                                                <p style={{
                                                    fontSize: '0.9rem',
                                                    color: 'var(--secondary)',
                                                    fontWeight: '500',
                                                    margin: 0
                                                }}>
                                                    UPI ID: sekarparameshwari09-1@oksbi
                                                </p>
                                            </div>

                                            <p style={{
                                                fontSize: '0.85rem',
                                                color: 'var(--gray-600)',
                                                margin: '8px 0 0 0'
                                            }}>
                                                Scan using any UPI app (Google Pay, PhonePe, Paytm, etc.)
                                            </p>

                                            <p style={{
                                                fontSize: '0.85rem',
                                                color: 'var(--success)',
                                                marginTop: '8px',
                                                fontWeight: '500'
                                            }}>
                                                ✓ Amount ₹{totalAmount.toFixed(2)} will be auto-filled in your UPI app
                                            </p>

                                            <p style={{
                                                fontSize: '0.8rem',
                                                color: 'var(--warning)',
                                                marginTop: '12px',
                                                fontWeight: '500'
                                            }}>
                                                ⚠️ After payment, click "Place Order" to complete your order
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Notes */}
                            <div className="form-group">
                                <label className="form-label">Order Notes (Optional)</label>
                                <textarea
                                    name="notes"
                                    className="form-input"
                                    rows="3"
                                    placeholder="Any special instructions..."
                                    value={formData.notes}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="cart-summary">
                            <h3 className="cart-summary-title">Order Summary</h3>

                            {cart?.items.map((item) => (
                                <div key={item._id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '12px 0',
                                    borderBottom: '1px solid var(--gray-200)'
                                }}>
                                    <div>
                                        <p style={{ fontWeight: '500' }}>{item.product?.name}</p>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                                            Qty: {item.quantity}
                                            {item.weight && ` (${item.weight}kg)`}
                                        </p>
                                    </div>
                                    <p style={{ fontWeight: '500' }}>
                                        ₹{(item.product?.priceUnit === 'kg' && item.weight
                                            ? item.product?.price * item.weight
                                            : item.product?.price * item.quantity
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            ))}

                            <div className="cart-summary-row" style={{ marginTop: '16px' }}>
                                <span>Subtotal</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>

                            <div className="cart-summary-row">
                                <span>Delivery</span>
                                <span style={{ color: 'var(--success)' }}>Free</span>
                            </div>

                            <div className="cart-summary-row total">
                                <span>Total</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%', marginTop: '24px' }}
                                disabled={submitting}
                            >
                                {submitting ? 'Placing Order...' : (
                                    <>
                                        <FiCheck /> Place Order
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
