import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BannerSlider from '../components/BannerSlider';
import { OfferTabs } from '../components/OfferTabs';
import { SidebarFilters } from '../components/SidebarFilters';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/SkeletonLoader';
import { apiFetch } from '../utils/api';
import './Home.css';

const Home = () => {
    const [searchParams] = useSearchParams();
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const categoryId = searchParams.get('category');
    const min = searchParams.get('min');
    const max = searchParams.get('max');
    const promo = searchParams.get('promo');
    const shipping = searchParams.get('shipping');

    useEffect(() => {
        setLoading(true);
        let endpoint = '/productos?limit=60';
        if (categoryId) endpoint += `&categoria_id=${categoryId}`;
        if (min) endpoint += `&precio_min=${min}`;
        if (max) endpoint += `&precio_max=${max}`;

        apiFetch(endpoint)
            .then(data => {
                setAllProducts(data || []);
            })
            .catch(err => console.error("Error fetching products:", err))
            .finally(() => setLoading(false));
    }, [categoryId, min, max, promo, shipping]);

    return (
        <main className="home-container">
            {/* Barra de Pestañas de Ofertas con Iconos */}
            <OfferTabs />

            {/* Layout Principal: Menú Lateral a la Izquierda desde Arriba + Catálogo a la Derecha */}
            <section className="container home-catalog-section">
                <div className="home-catalog-layout">
                    <SidebarFilters totalCount={allProducts.length} title="Ofertas" />

                    <div className="home-catalog-content">
                        {loading ? (
                            <ProductSkeleton count={9} />
                        ) : allProducts.length === 0 ? (
                            <div className="card" style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                                No se encontraron productos para los filtros seleccionados.
                            </div>
                        ) : (
                            <div className="results-grid-ml">
                                {allProducts.map(prod => (
                                    <ProductCard key={prod.id} product={prod} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
