import { Link } from 'react-router-dom';
import { FaCookieBite, FaBirthdayCake, FaCandyCane, FaBreadSlice, FaHamburger } from 'react-icons/fa';

const categoryIcons = {
    'Biscuits': FaCookieBite,
    'Cakes': FaBirthdayCake,
    'Sweets': FaCandyCane,
    'Breads': FaBreadSlice,
    'Snacks': FaHamburger
};

const categoryColors = {
    'Biscuits': 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    'Cakes': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'Sweets': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'Breads': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'Snacks': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
};

const CategoryCard = ({ category }) => {
    const Icon = categoryIcons[category.name] || FaCookieBite;
    const gradient = categoryColors[category.name] || 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)';
    const hasImage = category.image && category.image.trim() !== '';

    return (
        <Link to={`/products?category=${category._id}`} className="category-card">
            {/* Show image if available, otherwise show gradient background */}
            {hasImage ? (
                <div
                    className="category-card-bg"
                    style={{
                        backgroundImage: `url(${category.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
            ) : (
                <div
                    className="category-card-bg"
                    style={{ background: gradient }}
                />
            )}

            {/* Overlay for better text visibility when using image */}
            {hasImage && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)',
                        borderRadius: 'inherit'
                    }}
                />
            )}

            <div className="category-card-content">
                {!hasImage && <Icon className="category-card-icon" />}
                <h3 className="category-card-name" style={hasImage ? { color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' } : {}}>
                    {category.name}
                </h3>
                {category.subcategories && category.subcategories.length > 0 && (
                    <p className="category-card-count" style={hasImage ? { color: 'rgba(255,255,255,0.9)' } : {}}>
                        {category.subcategories.length} subcategories
                    </p>
                )}
            </div>
        </Link>
    );
};

export default CategoryCard;
