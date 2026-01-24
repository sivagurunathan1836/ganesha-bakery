import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { productsAPI, cartAPI } from '../services/api';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [weight, setWeight] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await productsAPI.getById(id);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Product not found');
                navigate('/products');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
            return;
        }

        if (product.stock <= 0) {
            toast.error('Product is out of stock');
            return;
        }

        setAdding(true);
        try {
            await cartAPI.add(
                product._id,
                quantity,
                product.priceUnit === 'kg' ? weight : null
            );
            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        } finally {
            setAdding(false);
        }
    };

    const getProductImage = () => {
        if (product.image && product.image.startsWith('/uploads')) {
            return `http://localhost:5000${product.image}`;
        }
        if (product.image && product.image.startsWith('http')) {
            return product.image;
        }
        return `https://placehold.co/600x400/f5e6d3/5c4033?text=${encodeURIComponent(product.name)}`;
    };

    const calculateTotal = () => {
        if (product.priceUnit === 'kg') {
            return product.price * weight;
        }
        return product.price * quantity;
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

    if (!product) {
        return null;
    }

    const isOutOfStock = product.stock <= 0;

    return (
        <div className="page">
            <div className="container">
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: '24px' }}
                >
                    <FiArrowLeft /> Back
                </button>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '60px',
                    alignItems: 'start'
                }}>
                    {/* Product Image */}
                    <div>
                        <div style={{
                            borderRadius: 'var(--border-radius)',
                            overflow: 'hidden',
                            boxShadow: 'var(--card-shadow)'
                        }}>
                            <img
                                src={getProductImage()}
                                alt={product.name}
                                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.src = `https://placehold.co/600x400/f5e6d3/5c4033?text=${encodeURIComponent(product.name)}`;
                                }}
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <p style={{
                            color: 'var(--primary-dark)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontSize: '0.9rem',
                            marginBottom: '8px'
                        }}>
                            {product.category?.name} {product.subcategory && `• ${product.subcategory}`}
                        </p>

                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            marginBottom: '16px',
                            color: 'var(--secondary)'
                        }}>
                            {product.name}
                        </h1>

                        <div style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            color: 'var(--primary-dark)',
                            marginBottom: '24px'
                        }}>
                            ₹{product.price}
                            {product.priceUnit === 'kg' && (
                                <span style={{
                                    fontSize: '1rem',
                                    fontWeight: '400',
                                    color: 'var(--gray-500)'
                                }}> per kg</span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div style={{ marginBottom: '24px' }}>
                            {isOutOfStock ? (
                                <span style={{
                                    background: 'var(--gray-700)',
                                    color: 'var(--white)',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600'
                                }}>
                                    Out of Stock
                                </span>
                            ) : (
                                <span style={{
                                    background: 'var(--success)',
                                    color: 'var(--white)',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600'
                                }}>
                                    In Stock ({product.stock} available)
                                </span>
                            )}
                        </div>

                        <p style={{
                            color: 'var(--gray-600)',
                            lineHeight: '1.8',
                            marginBottom: '32px'
                        }}>
                            {product.description || 'Delicious bakery product made fresh daily with the finest ingredients.'}
                        </p>

                        {/* Quantity/Weight Selector */}
                        <div style={{ marginBottom: '32px' }}>
                            {product.priceUnit === 'kg' ? (
                                <div>
                                    <label className="form-label">Weight (kg)</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => setWeight(Math.max(0.5, weight - 0.5))}
                                            disabled={isOutOfStock}
                                        >
                                            <FiMinus />
                                        </button>
                                        <span style={{
                                            fontSize: '1.25rem',
                                            fontWeight: '600',
                                            minWidth: '60px',
                                            textAlign: 'center'
                                        }}>
                                            {weight} kg
                                        </span>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => setWeight(weight + 0.5)}
                                            disabled={isOutOfStock}
                                        >
                                            <FiPlus />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="form-label">Quantity</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={isOutOfStock}
                                        >
                                            <FiMinus />
                                        </button>
                                        <span style={{
                                            fontSize: '1.25rem',
                                            fontWeight: '600',
                                            minWidth: '40px',
                                            textAlign: 'center'
                                        }}>
                                            {quantity}
                                        </span>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            disabled={isOutOfStock || quantity >= product.stock}
                                        >
                                            <FiPlus />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Total */}
                        <div style={{
                            padding: '20px',
                            background: 'var(--gray-100)',
                            borderRadius: 'var(--border-radius-sm)',
                            marginBottom: '24px'
                        }}>
                            <span style={{ color: 'var(--gray-600)' }}>Total: </span>
                            <span style={{
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                color: 'var(--primary-dark)'
                            }}>
                                ₹{calculateTotal()}
                            </span>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%' }}
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || adding}
                        >
                            {adding ? 'Adding...' : (
                                <>
                                    <FiShoppingCart />
                                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
