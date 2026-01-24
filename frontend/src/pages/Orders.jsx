import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiPackage, FiClock, FiCheck, FiX } from 'react-icons/fi';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

const Orders = () => {
    const { id } = useParams();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (id) {
                    const response = await ordersAPI.getById(id);
                    setSelectedOrder(response.data);
                } else {
                    const response = await ordersAPI.getAll();
                    setOrders(response.data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [id]);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        try {
            await ordersAPI.cancel(orderId);
            toast.success('Order cancelled successfully');
            // Refresh
            if (id) {
                const response = await ordersAPI.getById(orderId);
                setSelectedOrder(response.data);
            } else {
                const response = await ordersAPI.getAll();
                setOrders(response.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusClass = (status) => {
        const classes = {
            pending: 'status-pending',
            confirmed: 'status-confirmed',
            preparing: 'status-preparing',
            out_for_delivery: 'status-confirmed',
            delivered: 'status-delivered',
            cancelled: 'status-cancelled'
        };
        return classes[status] || 'status-pending';
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

    // Single order view
    if (selectedOrder) {
        return (
            <div className="page">
                <div className="container">
                    <div style={{
                        background: 'var(--success)',
                        color: 'white',
                        padding: '40px',
                        borderRadius: 'var(--border-radius)',
                        textAlign: 'center',
                        marginBottom: '30px'
                    }}>
                        <FiCheck style={{ fontSize: '3rem', marginBottom: '16px' }} />
                        <h1>Order Placed Successfully!</h1>
                        <p>Order #{selectedOrder.orderNumber}</p>
                    </div>

                    <div className="order-card">
                        <div className="order-header">
                            <div>
                                <p className="order-number">Order #{selectedOrder.orderNumber}</p>
                                <p className="order-date">{formatDate(selectedOrder.createdAt)}</p>
                            </div>
                            <span className={`order-status ${getStatusClass(selectedOrder.status)}`}>
                                {selectedOrder.status.replace('_', ' ')}
                            </span>
                        </div>

                        {/* Order Items */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ marginBottom: '16px' }}>Order Items</h3>
                            {selectedOrder.items.map((item, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '12px 0',
                                    borderBottom: '1px solid var(--gray-200)'
                                }}>
                                    <div>
                                        <p style={{ fontWeight: '500' }}>{item.name}</p>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                                            Qty: {item.quantity}
                                            {item.weight && ` (${item.weight}kg)`}
                                        </p>
                                    </div>
                                    <p style={{ fontWeight: '500' }}>₹{item.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        {/* Shipping Address */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ marginBottom: '12px' }}>Shipping Address</h3>
                            <p>{selectedOrder.shippingAddress.name}</p>
                            <p>{selectedOrder.shippingAddress.phone}</p>
                            <p>{selectedOrder.shippingAddress.street}</p>
                            <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                        </div>

                        {/* Total */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '16px 0',
                            borderTop: '2px solid var(--gray-200)',
                            fontSize: '1.2rem',
                            fontWeight: '700'
                        }}>
                            <span>Total Amount</span>
                            <span>₹{selectedOrder.totalAmount.toFixed(2)}</span>
                        </div>

                        {selectedOrder.status === 'pending' && (
                            <button
                                className="btn btn-danger"
                                onClick={() => handleCancelOrder(selectedOrder._id)}
                                style={{ marginTop: '16px' }}
                            >
                                <FiX /> Cancel Order
                            </button>
                        )}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <Link to="/orders" className="btn btn-secondary">View All Orders</Link>
                        <Link to="/products" className="btn btn-primary" style={{ marginLeft: '16px' }}>Continue Shopping</Link>
                    </div>
                </div>
            </div>
        );
    }

    // Orders list view
    return (
        <div className="page">
            <div className="container">
                <h1 className="section-title" style={{ marginBottom: '40px' }}>My Orders</h1>

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <FiPackage className="empty-state-icon" />
                        <h3 className="empty-state-title">No orders yet</h3>
                        <p className="empty-state-text">You haven't placed any orders yet</p>
                        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                    </div>
                ) : (
                    <div>
                        {orders.map((order) => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <p className="order-number">Order #{order.orderNumber}</p>
                                        <p className="order-date">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <span className={`order-status ${getStatusClass(order.status)}`}>
                                        {order.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                    {order.items.slice(0, 3).map((item, idx) => (
                                        <div key={idx} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '8px 12px',
                                            background: 'var(--gray-100)',
                                            borderRadius: 'var(--border-radius-sm)'
                                        }}>
                                            <span>{item.name}</span>
                                            <span style={{ color: 'var(--gray-500)' }}>×{item.quantity}</span>
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <span style={{ color: 'var(--gray-500)', alignSelf: 'center' }}>
                                            +{order.items.length - 3} more
                                        </span>
                                    )}
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                                        Total: ₹{order.totalAmount.toFixed(2)}
                                    </p>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        {order.status === 'pending' && (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleCancelOrder(order._id)}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <Link to={`/orders/${order._id}`} className="btn btn-primary btn-sm">
                                            View Details
                                        </Link>
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

export default Orders;
