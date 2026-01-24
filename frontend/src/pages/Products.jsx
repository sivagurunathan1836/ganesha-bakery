import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { productsAPI, categoriesAPI } from '../services/api';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        subcategory: searchParams.get('subcategory') || '',
        sort: searchParams.get('sort') || '',
        inStock: searchParams.get('inStock') || ''
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoriesAPI.getAll();
                setCategories(response.data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {
                    page: searchParams.get('page') || 1,
                    limit: 12
                };

                if (filters.search) params.search = filters.search;
                if (filters.category) params.category = filters.category;
                if (filters.subcategory) params.subcategory = filters.subcategory;
                if (filters.sort) params.sort = filters.sort;
                if (filters.inStock) params.inStock = filters.inStock;

                const response = await productsAPI.getAll(params);
                setProducts(response.data.products || []);
                setPagination({
                    page: response.data.page,
                    pages: response.data.pages,
                    total: response.data.total
                });
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams, filters]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v) params.set(k, v);
        });
        setSearchParams(params);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        handleFilterChange('search', filters.search);
    };

    const selectedCategory = categories.find(c => c._id === filters.category);

    return (
        <div className="page">
            <div className="container">
                <div className="section-header">
                    <h1 className="section-title">Our Products</h1>
                    <p className="section-description">
                        Browse our delicious collection of baked goods
                    </p>
                </div>

                {/* Filters */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '40px',
                    alignItems: 'flex-end'
                }}>
                    {/* Search */}
                    <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '250px' }}>
                        <div style={{ position: 'relative' }}>
                            <FiSearch style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--gray-400)'
                            }} />
                            <input
                                type="text"
                                className="form-input"
                                style={{ paddingLeft: '44px' }}
                                placeholder="Search products..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>
                    </form>

                    {/* Category Filter */}
                    <div style={{ minWidth: '180px' }}>
                        <select
                            className="form-input form-select"
                            value={filters.category}
                            onChange={(e) => {
                                handleFilterChange('category', e.target.value);
                                handleFilterChange('subcategory', '');
                            }}
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Subcategory Filter */}
                    {selectedCategory && selectedCategory.subcategories?.length > 0 && (
                        <div style={{ minWidth: '180px' }}>
                            <select
                                className="form-input form-select"
                                value={filters.subcategory}
                                onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                            >
                                <option value="">All Subcategories</option>
                                {selectedCategory.subcategories.map((sub, idx) => (
                                    <option key={idx} value={sub.name}>{sub.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Sort */}
                    <div style={{ minWidth: '180px' }}>
                        <select
                            className="form-input form-select"
                            value={filters.sort}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                        >
                            <option value="">Sort By</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="name">Name: A-Z</option>
                        </select>
                    </div>

                    {/* Stock Filter */}
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '14px 16px',
                        background: 'var(--white)',
                        borderRadius: 'var(--border-radius-sm)',
                        cursor: 'pointer'
                    }}>
                        <input
                            type="checkbox"
                            checked={filters.inStock === 'true'}
                            onChange={(e) => handleFilterChange('inStock', e.target.checked ? 'true' : '')}
                        />
                        In Stock Only
                    </label>
                </div>

                {/* Results count */}
                <p style={{ marginBottom: '20px', color: 'var(--gray-600)' }}>
                    Showing {products.length} of {pagination.total} products
                </p>

                {/* Products Grid */}
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="products-grid">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '8px',
                                marginTop: '40px'
                            }}>
                                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        className={`btn ${page === pagination.page ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                                        onClick={() => {
                                            const params = new URLSearchParams(searchParams);
                                            params.set('page', page);
                                            setSearchParams(params);
                                        }}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-state">
                        <FiFilter className="empty-state-icon" />
                        <h3 className="empty-state-title">No products found</h3>
                        <p className="empty-state-text">
                            Try adjusting your filters or search terms
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setFilters({ search: '', category: '', subcategory: '', sort: '', inStock: '' });
                                setSearchParams({});
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
