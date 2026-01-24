import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import { GiCupcake } from 'react-icons/gi';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { productsAPI, categoriesAPI } from '../services/api';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    productsAPI.getAll({ featured: 'true', limit: 8 }),
                    categoriesAPI.getAll()
                ]);
                setFeaturedProducts(productsRes.data.products || []);
                setCategories(categoriesRes.data || []);
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <FiStar /> Fresh Baked Daily
                        </div>
                        <h1 className="hero-title">
                            Delicious <span>Bakery</span> Treats Delivered to Your Door
                        </h1>
                        <p className="hero-description">
                            Experience the finest baked goods, traditional sweets, and savory snacks
                            made with love and the freshest ingredients. From crispy biscuits to
                            melt-in-your-mouth cakes!
                        </p>
                        <div className="hero-buttons">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                Shop Now <FiArrowRight />
                            </Link>
                            <Link to="/categories" className="btn btn-secondary btn-lg">
                                Browse Categories
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image">
                        <GiCupcake style={{
                            fontSize: '300px',
                            color: 'var(--primary)',
                            opacity: 0.8
                        }} />
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">Browse By</span>
                        <h2 className="section-title">Shop by Category</h2>
                        <p className="section-description">
                            Explore our wide range of bakery products organized by category
                        </p>
                    </div>

                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="categories-grid">
                            {categories.map((category) => (
                                <CategoryCard key={category._id} category={category} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="section" style={{ background: 'var(--white)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">Hot Picks</span>
                        <h2 className="section-title">Featured Products</h2>
                        <p className="section-description">
                            Our most loved products picked just for you
                        </p>
                    </div>

                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    ) : featuredProducts.length > 0 ? (
                        <>
                            <div className="products-grid">
                                {featuredProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                                <Link to="/products" className="btn btn-primary btn-lg">
                                    View All Products <FiArrowRight />
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <p>No featured products available</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">Why Us</span>
                        <h2 className="section-title">Why Choose Ganesh Bakery?</h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '30px'
                    }}>
                        {[
                            { icon: '🍞', title: 'Fresh Daily', desc: 'All products baked fresh every morning' },
                            { icon: '🌿', title: 'Quality Ingredients', desc: 'We use only the finest ingredients' },
                            { icon: '🚚', title: 'Fast Delivery', desc: 'Quick delivery to your doorstep' },
                            { icon: '💝', title: 'Made with Love', desc: 'Traditional recipes passed down generations' }
                        ].map((item, index) => (
                            <div key={index} className="card" style={{
                                padding: '30px',
                                textAlign: 'center',
                                cursor: 'default'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{item.icon}</div>
                                <h3 style={{ marginBottom: '12px', color: 'var(--secondary)' }}>{item.title}</h3>
                                <p style={{ color: 'var(--gray-600)' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
