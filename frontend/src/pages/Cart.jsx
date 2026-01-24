import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiTrash2, FiArrowRight } from 'react-icons/fi';
import CartItem from '../components/CartItem';
import { cartAPI } from '../services/api';
import toast from 'react-hot-toast';

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchCart = async () => {
        try {
            const response = await cartAPI.get();
            setCart(response.data.cart);
            setTotalItems(response.data.totalItems);
            setTotalAmount(response.data.totalAmount);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleUpdateQuantity = async (productId, quantity) => {
        setUpdating(true);
        try {
            if (quantity <= 0) {
                await cartAPI.remove(productId);
                toast.success('Item removed from cart');
            } else {
                await cartAPI.update(productId, quantity);
            }
            await fetchCart();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update cart');
        } finally {
            setUpdating(false);
        }
    };

    const handleRemove = async (productId) => {
        setUpdating(true);
        try {
            await cartAPI.remove(productId);
            toast.success('Item removed from cart');
            await fetchCart();
        } catch (error) {
            toast.error('Failed to remove item');
        } finally {
            setUpdating(false);
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm('Are you sure you want to clear your cart?')) return;

        setUpdating(true);
        try {
            await cartAPI.clear();
            toast.success('Cart cleared');
            await fetchCart();
        } catch (error) {
            toast.error('Failed to clear cart');
        } finally {
            setUpdating(false);
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

    const items = cart?.items || [];

    return (
        <div className="page">
            <div className="container">
                <h1 className="section-title" style={{ marginBottom: '40px' }}>Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="empty-state">
                        <FiShoppingBag className="empty-state-icon" />
                        <h3 className="empty-state-title">Your cart is empty</h3>
                        <p className="empty-state-text">
                            Looks like you haven't added any items yet
                        </p>
                        <Link to="/products" className="btn btn-primary">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="cart-container">
                        {/* Cart Items */}
                        <div className="cart-items">
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}>
                                <h2 style={{ fontSize: '1.2rem' }}>
                                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                                </h2>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={handleClearCart}
                                    disabled={updating}
                                >
                                    <FiTrash2 /> Clear Cart
                                </button>
                            </div>

                            {items.map((item) => (
                                <CartItem
                                    key={item.product?._id || item._id}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemove}
                                    loading={updating}
                                />
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="cart-summary">
                            <h3 className="cart-summary-title">Order Summary</h3>

                            <div className="cart-summary-row">
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
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%', marginTop: '24px' }}
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout <FiArrowRight />
                            </button>

                            <Link
                                to="/products"
                                style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    marginTop: '16px',
                                    color: 'var(--primary-dark)'
                                }}
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
