import { useState, useEffect } from 'react';
import { categoriesAPI } from '../services/api';
import CategoryCard from '../components/CategoryCard';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoriesAPI.getAll();
                setCategories(response.data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

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
                <div className="section-header">
                    <h1 className="section-title">Product Categories</h1>
                    <p className="section-description">
                        Browse our bakery products by category
                    </p>
                </div>

                <div className="categories-grid">
                    {categories.map((category) => (
                        <CategoryCard key={category._id} category={category} />
                    ))}
                </div>

                {/* Subcategories */}
                {categories.map((category) => (
                    category.subcategories && category.subcategories.length > 0 && (
                        <div key={category._id} style={{ marginTop: '60px' }}>
                            <h2 style={{
                                fontSize: '1.5rem',
                                marginBottom: '24px',
                                color: 'var(--secondary)'
                            }}>
                                {category.name} Subcategories
                            </h2>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '12px'
                            }}>
                                {category.subcategories.map((sub, idx) => (
                                    <a
                                        key={idx}
                                        href={`/products?category=${category._id}&subcategory=${sub.name}`}
                                        style={{
                                            padding: '12px 24px',
                                            background: 'var(--white)',
                                            borderRadius: '25px',
                                            boxShadow: 'var(--card-shadow)',
                                            color: 'var(--secondary)',
                                            fontWeight: '500',
                                            transition: 'var(--transition)'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.background = 'var(--primary-light)';
                                            e.target.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.background = 'var(--white)';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        {sub.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default Categories;
