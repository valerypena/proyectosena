import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BannerSlider from '../components/BannerSlider';
import ProductSlider from '../components/ProductSlider';
import { formatPrice } from '../utils/currency';
import './Home.css';

const Home = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [offers, setOffers] = useState([]);
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/productos?limit=100')
            .then(res => res.json())
            .then(data => {
                setAllProducts(data);

                // Simular lógica de productos al azar para sliders
                const shuffled = [...data].sort(() => 0.5 - Math.random());
                setOffers(shuffled.slice(0, 15));

                const shuffled2 = [...data].sort(() => 0.5 - Math.random());
                setFeatured(shuffled2.slice(0, 15));
            })
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    return (
        <main className="home-container">
            <BannerSlider />

            <section className="container">
                <div className="payment-methods-bar card">
                    <div className="pm-item">
                        <span className="pm-icon">💳</span>
                        <div className="pm-text">
                            <strong>Tarjetas bancarias</strong>
                            <span>Ver promociones</span>
                        </div>
                    </div>
                    <div className="pm-item">
                        <span className="pm-icon">⚡</span>
                        <div className="pm-text">
                            <strong>Cuotas sin interés</strong>
                            <span>Con bancos aliados</span>
                        </div>
                    </div>
                    <div className="pm-item">
                        <span className="pm-icon">💸</span>
                        <div className="pm-text">
                            <strong>Efectivo</strong>
                            <span>Paga en puntos aliados</span>
                        </div>
                    </div>
                    <div className="pm-item">
                        <span className="pm-icon">➕</span>
                        <div className="pm-text">
                            <strong>Más medios</strong>
                            <span>Ver todos</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Slider de Ofertas */}
            <ProductSlider title="Ofertas Relámpago" products={offers} />

            {/* Slider de Recomendados */}
            <ProductSlider title="Inspirado en lo último que viste" products={featured} />

            {/* Grid Principal (El resto de productos) */}
            <section className="container products-section">
                <h2 className="section-title">Descubre más productos</h2>
                <div className="products-grid">
                    {allProducts.slice(0, 20).map(prod => (
                        <Link to={`/items/${prod.id}`} key={prod.id} className="card product-card">
                            <div className="product-img-container">
                                <img src={prod.url_imagen || "https://via.placeholder.com/224"} alt={prod.nombre} />
                            </div>
                            <div className="product-info">
                                <h3 className="product-price">{formatPrice(prod.precio)}</h3>
                                <span className="shipping-free">Envío gratis</span>
                                <p className="product-title">{prod.nombre}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Home;
