import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiPackage, FiGrid, FiShoppingBag, FiBox, FiSettings } from 'react-icons/fi';
import { ordersAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ManageOrders = () => {
    const location = useLocation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchOrders = async () => {
        try {
            const params = statusFilter ? { status: statusFilter } : {};
            const response = await ordersAPI.getAllAdmin(params);
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await ordersAPI.updateStatus(orderId, newStatus);
            toast.success('Order status updated');
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
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

    const sidebarLinks = [
        { to: '/admin', icon: FiHome, label: 'Dashboard' },
        { to: '/admin/products', icon: FiPackage, label: 'Products' },
        { to: '/admin/categories', icon: FiGrid, label: 'Categories' },
        { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
        { to: '/admin/stock', icon: FiBox, label: 'Stock Management' }
    ];

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h2 className="admin-sidebar-title">
                    <FiSettings style={{ marginRight: '8px' }} />
                    Admin Panel
                </h2>
                <nav>
                    <ul className="admin-sidebar-nav">
                        {sidebarLinks.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className={`admin-sidebar-link ${location.pathname === link.to ? 'active' : ''}`}
                                >
                                    <link.icon />
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            <main className="admin-content">
                <div className="admin-header">
                    <h1 className="admin-title">Manage Orders</h1>
                    <select
                        className="form-input form-select"
                        style={{ width: '200px' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {loading ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">
                        <FiShoppingBag className="empty-state-icon" />
                        <h3 className="empty-state-title">No orders found</h3>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td style={{ fontWeight: '500' }}>{order.orderNumber}</td>
                                    <td>
                                        <div>{order.user?.name || 'N/A'}</div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {order.items?.map((item, index) => (
                                                <div key={index} style={{ fontSize: '0.9rem' }}>
                                                    {item.product?.name || 'Unknown Product'}
                                                    <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem', marginLeft: '10px' }}>
                                                        [<span style={{ fontWeight: 'bold', color: '#000' }}>{item.quantity}</span>]
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: '600' }}>₹{order.totalAmount?.toFixed(2)}</td>
                                    <td>
                                        <span style={{
                                            textTransform: 'uppercase',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            {order.paymentMethod}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`order-status ${getStatusClass(order.status)}`}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.9rem' }}>{formatDate(order.createdAt)}</td>
                                    <td>
                                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                            <select
                                                className="form-input form-select"
                                                style={{ width: '150px', padding: '8px' }}
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="preparing">Preparing</option>
                                                <option value="out_for_delivery">Out for Delivery</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
};

export default ManageOrders;
