import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiMapPin } from 'react-icons/fi';
import { GiCupcake } from 'react-icons/gi';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { productsAPI, categoriesAPI } from '../services/api';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState('');
    const [checkResult, setCheckResult] = useState(null); // 'success', 'error', or null

    const handleCityCheck = (e) => {
        e.preventDefault();
        if (city.trim().toLowerCase() === 'karur') {
            setCheckResult('success');
        } else {
            setCheckResult('error');
        }
    };

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
            {/* Location Check Bar */}
            <div style={{ background: 'var(--primary)', padding: '20px 0', color: 'white' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FiMapPin style={{ fontSize: '24px' }} />
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Check Delivery Availability</span>
                    </div>

                    <form onSubmit={handleCityCheck} style={{ display: 'flex', gap: '15px', alignItems: 'center', flex: 1, maxWidth: '600px', justifyContent: 'flex-end' }}>
                        <select
                            value={city}
                            onChange={(e) => {
                                setCity(e.target.value);
                                setCheckResult(null);
                            }}
                            style={{
                                padding: '12px 20px',
                                borderRadius: '6px',
                                border: 'none',
                                outline: 'none',
                                fontSize: '1.1rem',
                                width: '100%',
                                maxWidth: '350px',
                                cursor: 'pointer',
                                color: city ? '#333' : '#666'
                            }}
                            required
                        >
                            <option value="" disabled>Select your city</option>
                            <option value="Ariyalur">Ariyalur</option>
                            <option value="Chengalpattu">Chengalpattu</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Coimbatore">Coimbatore</option>
                            <option value="Cuddalore">Cuddalore</option>
                            <option value="Dharmapuri">Dharmapuri</option>
                            <option value="Dindigul">Dindigul</option>
                            <option value="Erode">Erode</option>
                            <option value="Kallakurichi">Kallakurichi</option>
                            <option value="Kancheepuram">Kancheepuram</option>
                            <option value="Karur">Karur</option>
                            <option value="Krishnagiri">Krishnagiri</option>
                            <option value="Madurai">Madurai</option>
                            <option value="Mayiladuthurai">Mayiladuthurai</option>
                            <option value="Nagapattinam">Nagapattinam</option>
                            <option value="Namakkal">Namakkal</option>
                            <option value="Nilgiris">Nilgiris</option>
                            <option value="Perambalur">Perambalur</option>
                            <option value="Pudukkottai">Pudukkottai</option>
                            <option value="Ramanathapuram">Ramanathapuram</option>
                            <option value="Ranipet">Ranipet</option>
                            <option value="Salem">Salem</option>
                            <option value="Sivaganga">Sivaganga</option>
                            <option value="Tenkasi">Tenkasi</option>
                            <option value="Thanjavur">Thanjavur</option>
                            <option value="Theni">Theni</option>
                            <option value="Thoothukudi">Thoothukudi</option>
                            <option value="Tiruchirappalli">Tiruchirappalli</option>
                            <option value="Tirunelveli">Tirunelveli</option>
                            <option value="Tirupathur">Tirupathur</option>
                            <option value="Tiruppur">Tiruppur</option>
                            <option value="Tiruvallur">Tiruvallur</option>
                            <option value="Tiruvannamalai">Tiruvannamalai</option>
                            <option value="Tiruvarur">Tiruvarur</option>
                            <option value="Vellore">Vellore</option>
                            <option value="Viluppuram">Viluppuram</option>
                            <option value="Virudhunagar">Virudhunagar</option>
                        </select>
                        <button type="submit" className="btn" style={{
                            background: 'var(--secondary)',
                            color: 'white',
                            padding: '12px 30px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}>Check</button>
                    </form>
                </div>
            </div>

            {/* Check Result Message */}
            {checkResult && (
                <div style={{
                    textAlign: 'center',
                    padding: '8px',
                    background: checkResult === 'success' ? '#d4edda' : '#f8d7da',
                    color: checkResult === 'success' ? '#155724' : '#721c24',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    fontSize: '0.9rem'
                }}>
                    <div className="container">
                        {checkResult === 'success' ? (
                            <><strong>Great!</strong> We deliver to Karur. <Link to="/products" style={{ textDecoration: 'underline', fontWeight: 'bold', marginLeft: '5px', color: 'inherit' }}>Shop Now</Link></>
                        ) : (
                            <><strong>Sorry!</strong> We currently only deliver to Karur.</>
                        )}
                    </div>
                </div>
            )}

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
                        <h2 className="section-title">Why Choose Sri Ganesha Bakery?</h2>
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
