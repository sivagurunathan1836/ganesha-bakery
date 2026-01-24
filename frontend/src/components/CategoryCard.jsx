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

    return (
        <Link to={`/products?category=${category._id}`} className="category-card">
            <div
                className="category-card-bg"
                style={{ background: gradient }}
            />
            <div className="category-card-content">
                <Icon className="category-card-icon" />
                <h3 className="category-card-name">{category.name}</h3>
                {category.subcategories && category.subcategories.length > 0 && (
                    <p className="category-card-count">
                        {category.subcategories.length} subcategories
                    </p>
                )}
            </div>
        </Link>
    );
};

export default CategoryCard;
