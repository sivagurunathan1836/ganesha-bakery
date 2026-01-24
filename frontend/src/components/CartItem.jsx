import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

const CartItem = ({ item, onUpdateQuantity, onRemove, loading }) => {
    const { product, quantity, weight } = item;

    if (!product) return null;

    const getProductImage = () => {
        if (product.image && product.image.startsWith('/uploads')) {
            return `http://localhost:5000${product.image}`;
        }
        if (product.image && product.image.startsWith('http')) {
            return product.image;
        }
        return `https://placehold.co/100x100/f5e6d3/5c4033?text=${encodeURIComponent(product.name)}`;
    };

    const calculatePrice = () => {
        if (product.priceUnit === 'kg' && weight) {
            return product.price * weight;
        }
        return product.price * quantity;
    };

    const formatPrice = () => {
        const total = calculatePrice();
        if (product.priceUnit === 'kg') {
            return `₹${product.price}/kg × ${weight || 1}kg = ₹${total}`;
        }
        return `₹${product.price} × ${quantity} = ₹${total}`;
    };

    return (
        <div className="cart-item">
            <img
                src={getProductImage()}
                alt={product.name}
                className="cart-item-image"
                onError={(e) => {
                    e.target.src = `https://placehold.co/100x100/f5e6d3/5c4033?text=${encodeURIComponent(product.name)}`;
                }}
            />

            <div className="cart-item-info">
                <h3>{product.name}</h3>
                <p className="cart-item-price">{formatPrice()}</p>
                {product.stock < quantity && (
                    <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>
                        Only {product.stock} available
                    </p>
                )}
            </div>

            <div className="cart-item-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="cart-item-quantity">
                    <button
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(product._id, quantity - 1)}
                        disabled={loading || quantity <= 1}
                    >
                        <FiMinus />
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(product._id, quantity + 1)}
                        disabled={loading || quantity >= product.stock}
                    >
                        <FiPlus />
                    </button>
                </div>

                <button
                    className="btn btn-danger btn-icon btn-sm"
                    onClick={() => onRemove(product._id)}
                    disabled={loading}
                >
                    <FiTrash2 />
                </button>
            </div>
        </div>
    );
};

export default CartItem;
