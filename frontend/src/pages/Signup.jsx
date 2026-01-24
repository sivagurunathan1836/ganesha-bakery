import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiUserPlus } from 'react-icons/fi';
import { GiCupcake } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const result = await signup(
            formData.name,
            formData.email,
            formData.password,
            formData.phone
        );

        if (result.success) {
            toast.success('Account created successfully!');
            navigate('/');
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
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join us for delicious treats</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <FiUser style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--gray-400)'
                            }} />
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                style={{ paddingLeft: '44px' }}
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

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
                        <label className="form-label">Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <FiPhone style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--gray-400)'
                            }} />
                            <input
                                type="tel"
                                name="phone"
                                className="form-input"
                                style={{ paddingLeft: '44px' }}
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
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
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
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
                                name="confirmPassword"
                                className="form-input"
                                style={{ paddingLeft: '44px' }}
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
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
                        {loading ? 'Creating account...' : (
                            <>
                                <FiUserPlus /> Sign Up
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
