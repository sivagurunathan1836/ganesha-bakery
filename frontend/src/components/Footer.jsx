import { Link } from 'react-router-dom';
import { GiCupcake } from 'react-icons/gi';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>
                            <GiCupcake style={{ marginRight: '10px' }} />
                            Sri Ganesha Bakery
                        </h3>
                        <p>
                            Bringing you the finest baked goods, traditional sweets, and delicious snacks
                            since 1995. Every product is made with love and the freshest ingredients.
                        </p>
                    </div>

                    <div>
                        <h4 className="footer-title">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/categories">Categories</Link></li>
                            <li><Link to="/cart">Cart</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer-title">Categories</h4>
                        <ul className="footer-links">
                            <li><Link to="/products?category=biscuits">Biscuits</Link></li>
                            <li><Link to="/products?category=cakes">Cakes</Link></li>
                            <li><Link to="/products?category=sweets">Sweets</Link></li>
                            <li><Link to="/products?category=puffs">Puffs</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer-title">Contact Us</h4>
                        <ul className="footer-links">
                            <li>
                                <FiMapPin style={{ marginRight: '8px' }} />
                                11/27A, Thanga Tamil Park, Panchamadevikarur
                            </li>
                            <li>
                                <FiPhone style={{ marginRight: '8px' }} />
                                +91 9500966009
                            </li>
                            <li>
                                <FiMail style={{ marginRight: '8px' }} />
                                sriganeshabakery@gmail.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 Sri Ganesha Bakery. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
