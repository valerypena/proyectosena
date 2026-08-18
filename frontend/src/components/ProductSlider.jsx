import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ProductSlider.css';

const ProductSlider = ({ title, products }) => {
    const sliderRef = useRef(null);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const { scrollLeft, clientWidth } = sliderRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth * 0.8
                : scrollLeft + clientWidth * 0.8;

            sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <section className="container product-slider-section">
            <div className="slider-header">
                <h2 className="section-title">{title}</h2>
                <div className="slider-nav">
                    <button className="nav-btn" onClick={() => scroll('left')}><ChevronLeft size={24} /></button>
                    <button className="nav-btn" onClick={() => scroll('right')}><ChevronRight size={24} /></button>
                </div>
            </div>

            <div className="slider-container" ref={sliderRef}>
                {products.map(prod => {
                    // Simular una promo si no tiene una real
                    const hasPromo = Math.random() > 0.6;
                    const discount = hasPromo ? Math.floor(Math.random() * 20) + 10 : 0;
                    const originalPrice = hasPromo ? prod.precio * 1.3 : prod.precio;

                    return (
                        <Link to={`/items/${prod.id}`} key={prod.id} className="card product-card slider-card">
                            <div className="product-img-container">
                                <img src={prod.url_imagen || "https://via.placeholder.com/224"} alt={prod.nombre} />
                            </div>
                            <div className="product-info">
                                {hasPromo && (
                                    <div className="product-promo-tag">{discount}% OFF</div>
                                )}
                                <div className="price-row">
                                    <h3 className="product-price">{formatPrice(prod.precio)}</h3>
                                    {hasPromo && <span className="original-price">{formatPrice(originalPrice)}</span>}
                                </div>
                                <span className="shipping-free">Envío gratis</span>
                                <p className="product-title">{prod.nombre}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default ProductSlider;
