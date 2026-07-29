import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import './SearchResults.css';

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [minPrice, setMinPrice] = useState(searchParams.get('min') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '');
    const [orden, setOrden] = useState(searchParams.get('orden') || '');

    const query = searchParams.get('search');
    const categoryId = searchParams.get('category');
    const min = searchParams.get('min');
    const max = searchParams.get('max');
    const orderParam = searchParams.get('orden');

    useEffect(() => {
        setLoading(true);
        // Reset products to empty so sidebar doesn't show old count
        setProducts([]);

        // Base URL
        let url = 'http://127.0.0.1:8000/productos?limit=50';

        // Filters
        if (query) url += `&busqueda=${encodeURIComponent(query)}`;
        if (categoryId) url += `&categoria_id=${categoryId}`;
        if (min) url += `&precio_min=${min}`;
        if (max) url += `&precio_max=${max}`;
        if (orderParam) url += `&orden=${orderParam}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        fetch(url, { signal: controller.signal })
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
                clearTimeout(timeoutId);
            })
            .catch(err => {
                if (err.name === 'AbortError') {
                    console.error("Search request timed out");
                } else {
                    console.error("Error searching products:", err);
                }
                setLoading(false);
                setProducts([]);
            });
    }, [query, categoryId, min, max, orderParam]);

    const handleFilterPrice = (e) => {
        e.preventDefault();
        const newParams = new URLSearchParams(searchParams);
        if (minPrice) newParams.set('min', minPrice); else newParams.delete('min');
        if (maxPrice) newParams.set('max', maxPrice); else newParams.delete('max');
        setSearchParams(newParams);
    };

    const handleOrderChange = (e) => {
        const val = e.target.value;
        setOrden(val);
        const newParams = new URLSearchParams(searchParams);
        if (val) newParams.set('orden', val); else newParams.delete('orden');
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        const newParams = new URLSearchParams();
        if (query) newParams.set('search', query);
        if (categoryId) newParams.set('category', categoryId);
        setSearchParams(newParams);
        setMinPrice('');
        setMaxPrice('');
        setOrden('');
    };

    return (
        <main className="container search-results-layout">
            <aside className="filters-sidebar">
                <h3>{query ? `"${query}"` : 'Resultados'}</h3>
                {!loading ? (
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>{products.length} resultados</p>
                ) : (
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>Buscando...</p>
                )}

                <div className="filter-group">
                    <h4>Precio</h4>
                    <form onSubmit={handleFilterPrice} className="price-filter-form">
                        <div className="price-inputs">
                            <input type="number" placeholder="Mínimo" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                            <span>-</span>
                            <input type="number" placeholder="Máximo" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-filter-price">Aplicar</button>
                    </form>
                    {(min || max || orderParam) && (
                        <button onClick={clearFilters} style={{ marginTop: '10px', fontSize: '12px', color: '#3483fa', background: 'none', border: 'none', cursor: 'pointer' }}>
                            Limpiar filtros
                        </button>
                    )}
                </div>

                <div className="filter-group">
                    <h4>Condición</h4>
                    <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: '#666' }}>
                        <li style={{ marginBottom: '8px' }}>Nuevo</li>
                        <li>Usado</li>
                    </ul>
                </div>
            </aside>

            <section className="results-main">
                <div className="results-toolbar" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <div className="order-dropdown">
                        <span style={{ fontSize: '14px', color: '#333', marginRight: '10px' }}>Ordenar por</span>
                        <select value={orden} onChange={handleOrderChange} style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px' }}>
                            <option value="">Más relevantes</option>
                            <option value="price_asc">Menor precio</option>
                            <option value="price_desc">Mayor precio</option>
                            <option value="newest">Más recientes</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="loading">Cargando resultados...</div>
                ) : products.length === 0 ? (
                    <div className="no-results card" style={{ padding: '40px', textAlign: 'center' }}>
                        <p>No se encontraron productos que coincidan con tu búsqueda.</p>
                        <button className="btn-link" onClick={clearFilters}>Ver todos los productos</button>
                    </div>
                ) : (
                    <div className="results-list">
                        {products.map(prod => (
                            <Link to={`/items/${prod.id}`} key={prod.id} className="result-item card">
                                <div className="result-img-wrapper">
                                    <img src={prod.url_imagen || "https://via.placeholder.com/160"} alt={prod.nombre} />
                                </div>
                                <div className="result-info">
                                    <h3 className="result-title">{prod.nombre}</h3>
                                    <div className="result-price">{formatPrice(prod.precio)}</div>
                                    <p className="result-shipping">Envío gratis</p>
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
