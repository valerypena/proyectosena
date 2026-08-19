import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OfferTabs } from '../components/OfferTabs';
import { SidebarFilters } from '../components/SidebarFilters';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/SkeletonLoader';
import { apiFetch } from '../utils/api';
import './SearchResults.css';

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [orden, setOrden] = useState(searchParams.get('orden') || '');

    const query = searchParams.get('search');
    const categoryId = searchParams.get('category');
    const min = searchParams.get('min');
    const max = searchParams.get('max');
    const promo = searchParams.get('promo');
    const orderParam = searchParams.get('orden');

    useEffect(() => {
        setLoading(true);
        setProducts([]);

        let endpoint = '/productos?limit=60';
        if (query) endpoint += `&busqueda=${encodeURIComponent(query)}`;
        if (categoryId) endpoint += `&categoria_id=${categoryId}`;
        if (min) endpoint += `&precio_min=${min}`;
        if (max) endpoint += `&precio_max=${max}`;
        if (orderParam) endpoint += `&orden=${orderParam}`;

        apiFetch(endpoint)
            .then(data => {
                setProducts(data || []);
            })
            .catch(err => {
                console.error("Error buscando productos:", err);
                setProducts([]);
            })
            .finally(() => setLoading(false));
    }, [query, categoryId, min, max, promo, orderParam]);

    const handleOrderChange = (e) => {
        const val = e.target.value;
        setOrden(val);
        const newParams = new URLSearchParams(searchParams);
        if (val) newParams.set('orden', val); else newParams.delete('orden');
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams(new URLSearchParams());
    };

    const pageTitle = query 
        ? query 
        : categoryId 
            ? 'Categoría seleccionada' 
            : 'Ofertas';

    return (
        <main className="search-results-page">
            {/* Barra superior de pestañas de ofertas con iconos */}
            <OfferTabs />

            <div className="container search-results-layout">
                {/* Barra lateral de filtros completa */}
                <SidebarFilters 
                    totalCount={products.length} 
                    title={pageTitle} 
                />

                <section className="results-main">
                    <div className="results-toolbar">
                        <span className="results-count-text">
                            {loading ? 'Buscando productos...' : `${products.length} productos`}
                        </span>
                        <div className="order-dropdown">
                            <span>Ordenar por:</span>
                            <select 
                                value={orden} 
                                onChange={handleOrderChange}
                            >
                                <option value="">Más relevantes</option>
                                <option value="price_asc">Menor precio</option>
                                <option value="price_desc">Mayor precio</option>
                                <option value="newest">Más recientes</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <ProductSkeleton count={9} />
                    ) : products.length === 0 ? (
                        <div className="no-results card" style={{ padding: '60px 20px', textAlign: 'center' }}>
                            <p style={{ fontSize: '16px', color: '#475569', marginBottom: '16px' }}>
                                No se encontraron productos que coincidan con los filtros aplicados.
                            </p>
                            <button className="btn-primary" onClick={clearFilters}>Ver todas las ofertas</button>
                        </div>
                    ) : (
                        <div className="results-grid-ml">
                            {products.map(prod => (
                                <ProductCard key={prod.id} product={prod} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default SearchResults;
