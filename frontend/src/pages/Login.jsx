import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { GiCupcake } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            toast.success('Welcome back!');
            navigate(from, { replace: true });
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <GiCupcake />
                    </div>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Login to your account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div style={{ position: 'relative' }}>
                            <FiMail style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--gray-400)'
                            }} />
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                style={{ paddingLeft: '44px' }}
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <FiLock style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--gray-400)'
                            }} />
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                style={{ paddingLeft: '44px' }}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%', marginTop: '8px' }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : (
                            <>
                                <FiLogIn /> Login
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>

                {/* Demo credentials */}
                <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    background: 'var(--gray-100)',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '0.875rem'
                }}>
                    <strong>Demo Credentials:</strong><br />
                    User: user@test.com / user123<br />
                    Admin: admin@bakery.com / admin123
                </div>
            </div>
        </div>
    );
};

export default Login;
