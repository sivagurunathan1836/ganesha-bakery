import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiPackage, FiGrid, FiShoppingBag, FiSettings, FiBox } from 'react-icons/fi';
import { productsAPI, categoriesAPI, ordersAPI } from '../../services/api';

const AdminDashboard = () => {
    const location = useLocation();
    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        orders: 0,
        lowStock: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [productsRes, categoriesRes, ordersRes] = await Promise.all([
                    productsAPI.getAll({ limit: 100 }),
                    categoriesAPI.getAll(),
                    ordersAPI.getAllAdmin({ limit: 5 })
                ]);

                const products = productsRes.data.products || [];
                const lowStockCount = products.filter(p => p.stock < 5).length;

                setStats({
                    products: productsRes.data.total || products.length,
                    categories: categoriesRes.data?.length || 0,
                    orders: ordersRes.data.total || 0,
                    lowStock: lowStockCount
                });

                setRecentOrders(ordersRes.data.orders || []);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
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
            {/* Sidebar */}
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

            {/* Main Content */}
            <main className="admin-content">
                <div className="admin-header">
                    <h1 className="admin-title">Dashboard</h1>
                    <Link to="/" className="btn btn-secondary btn-sm">View Store</Link>
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="admin-stats">
                            <div className="stat-card">
                                <div className="stat-card-icon products">
                                    <FiPackage />
                                </div>
                                <div className="stat-card-value">{stats.products}</div>
                                <div className="stat-card-label">Total Products</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-card-icon orders">
                                    <FiShoppingBag />
                                </div>
                                <div className="stat-card-value">{stats.orders}</div>
                                <div className="stat-card-label">Total Orders</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-card-icon users">
                                    <FiGrid />
                                </div>
                                <div className="stat-card-value">{stats.categories}</div>
                                <div className="stat-card-label">Categories</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-card-icon revenue" style={{
                                    background: stats.lowStock > 0 ? '#ffebee' : '#e8f5e9',
                                    color: stats.lowStock > 0 ? '#c62828' : '#2e7d32'
                                }}>
                                    <FiBox />
                                </div>
                                <div className="stat-card-value" style={{
                                    color: stats.lowStock > 0 ? 'var(--danger)' : 'var(--success)'
                                }}>
                                    {stats.lowStock}
                                </div>
                                <div className="stat-card-label">Low Stock Items</div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div style={{ marginTop: '30px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '16px'
                            }}>
                                <h2 style={{ fontSize: '1.3rem', color: 'var(--secondary)' }}>Recent Orders</h2>
                                <Link to="/admin/orders" className="btn btn-secondary btn-sm">View All</Link>
                            </div>

                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order #</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                                No orders yet
                                            </td>
                                        </tr>
                                    ) : (
                                        recentOrders.map((order) => (
                                            <tr key={order._id}>
                                                <td style={{ fontWeight: '500' }}>{order.orderNumber}</td>
                                                <td>{order.user?.name || 'N/A'}</td>
                                                <td>{order.items?.length || 0} items</td>
                                                <td style={{ fontWeight: '600' }}>₹{order.totalAmount?.toFixed(2)}</td>
                                                <td>
                                                    <span className={`order-status ${getStatusClass(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>{formatDate(order.createdAt)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
