import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SidebarFilters } from '../components/SidebarFilters';
import { ProductSkeleton } from '../components/SkeletonLoader';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { formatPrice } from '../utils/currency';
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
    const orderParam = searchParams.get('orden');

    useEffect(() => {
        setLoading(true);
        setProducts([]);

        let endpoint = '/productos?limit=50';
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
    }, [query, categoryId, min, max, orderParam]);

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
            : 'Ofertas y Productos';

    return (
        <main className="container search-results-layout">
            {/* Barra lateral de filtros completa */}
            <SidebarFilters 
                totalCount={products.length} 
                title={pageTitle} 
            />

            <section className="results-main">
                <div className="results-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>
                        {loading ? 'Buscando...' : `${products.length} productos disponibles`}
                    </span>
                    <div className="order-dropdown">
                        <span style={{ fontSize: '14px', color: '#333', marginRight: '10px' }}>Ordenar por:</span>
                        <select 
                            value={orden} 
                            onChange={handleOrderChange} 
                            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#fff', cursor: 'pointer' }}
                        >
                            <option value="">Más relevantes</option>
                            <option value="price_asc">Menor precio</option>
                            <option value="price_desc">Mayor precio</option>
                            <option value="newest">Más recientes</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <ProductSkeleton count={6} />
                ) : products.length === 0 ? (
                    <div className="no-results card" style={{ padding: '50px 20px', textAlign: 'center' }}>
                        <p style={{ fontSize: '16px', color: '#475569', marginBottom: '16px' }}>No se encontraron productos que coincidan con tu búsqueda.</p>
                        <button className="btn-primary" onClick={clearFilters}>Ver todos los productos</button>
                    </div>
                ) : (
                    <div className="results-list">
                        {products.map(prod => (
                            <Link to={`/items/${prod.id}`} key={prod.id} className="result-item card">
                                <div className="result-img-wrapper">
                                    <ImageWithFallback src={prod.url_imagen} alt={prod.nombre} />
                                </div>
                                <div className="result-info">
                                    <h3 className="result-title">{prod.nombre}</h3>
                                    <div className="result-price">{formatPrice(prod.precio)}</div>
                                    <p className="result-shipping" style={{ color: '#00a650', fontWeight: 'bold' }}>Envío gratis</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default SearchResults;
