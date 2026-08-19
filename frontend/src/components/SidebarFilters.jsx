import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { ChevronRight, Zap, X } from 'lucide-react';
import './SidebarFilters.css';

export const SidebarFilters = ({ totalCount = 0, title = 'Resultados' }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState([]);
    const [fullShipping, setFullShipping] = useState(false);
    const [minPrice, setMinPrice] = useState(searchParams.get('min') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '');

    const currentCategoryId = searchParams.get('category');
    const currentMin = searchParams.get('min');
    const currentMax = searchParams.get('max');
    const currentPromotion = searchParams.get('promo');
    const currentShipping = searchParams.get('shipping');

    useEffect(() => {
        apiFetch('/categorias')
            .then(data => setCategories(data || []))
            .catch(err => console.error('Error cargando categorías para filtro:', err));
    }, []);

    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value !== null && value !== undefined && value !== '') {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const handleCategoryClick = (catId) => {
        if (currentCategoryId === String(catId)) {
            updateFilter('category', null);
        } else {
            updateFilter('category', catId);
        }
    };

    const handlePresetPrice = (min, max) => {
        const newParams = new URLSearchParams(searchParams);
        if (min !== null) newParams.set('min', min); else newParams.delete('min');
        if (max !== null) newParams.set('max', max); else newParams.delete('max');
        setMinPrice(min !== null ? String(min) : '');
        setMaxPrice(max !== null ? String(max) : '');
        setSearchParams(newParams);
    };

    const handleCustomPrice = (e) => {
        e.preventDefault();
        const newParams = new URLSearchParams(searchParams);
        if (minPrice) newParams.set('min', minPrice); else newParams.delete('min');
        if (maxPrice) newParams.set('max', maxPrice); else newParams.delete('max');
        setSearchParams(newParams);
    };

    const handleFullToggle = () => {
        const next = !fullShipping;
        setFullShipping(next);
        updateFilter('full', next ? 'true' : null);
    };

    const clearAllFilters = () => {
        const newParams = new URLSearchParams();
        const query = searchParams.get('search');
        if (query) newParams.set('search', query);
        setSearchParams(newParams);
        setMinPrice('');
        setMaxPrice('');
        setFullShipping(false);
    };

    const hasActiveFilters = currentCategoryId || currentMin || currentMax || currentPromotion || currentShipping || fullShipping;

    return (
        <aside className="sidebar-filters-container">
            {/* Conteo General Superior */}
            <div className="filter-header">
                <div className="filter-total-products">
                    <strong>Todas</strong>
                    <span>{totalCount.toLocaleString('es-CO')} productos</span>
                </div>
            </div>

            {hasActiveFilters && (
                <button className="clear-filters-btn" onClick={clearAllFilters}>
                    <X size={14} /> Limpiar todos los filtros
                </button>
            )}

            {/* FULL Banner Card con Switch Toggle */}
            <div className="full-filter-card">
                <div className="full-filter-content">
                    <div className="full-badge">
                        <Zap size={16} fill="#00a650" color="#00a650" />
                        <span className="full-text">FULL</span>
                        <span className="full-desc">te ahorra envíos</span>
                    </div>
                    <span className="full-subtext">Con tu carrito de compras</span>
                </div>
                <label className="switch-toggle" aria-label="Filtro de envíos Full">
                    <input
                        type="checkbox"
                        checked={fullShipping}
                        onChange={handleFullToggle}
                    />
                    <span className="slider-round" />
                </label>
            </div>

            {/* Tiempo de entrega */}
            <div className="filter-section">
                <h3 className="filter-title">Tiempo de entrega</h3>
                <ul className="filter-list">
                    <li
                        className={`filter-item ${currentShipping === 'today' ? 'active' : ''}`}
                        onClick={() => updateFilter('shipping', currentShipping === 'today' ? null : 'today')}
                    >
                        <span>Llega hoy</span>
                        <span className="filter-count">(2.656)</span>
                    </li>
                    <li
                        className={`filter-item ${currentShipping === '24h' ? 'active' : ''}`}
                        onClick={() => updateFilter('shipping', currentShipping === '24h' ? null : '24h')}
                    >
                        <span>Llega en menos de 24 hs</span>
                        <span className="filter-count">(8.170)</span>
                    </li>
                </ul>
            </div>

            {/* Tipo de promoción */}
            <div className="filter-section">
                <h3 className="filter-title">Tipo de promoción</h3>
                <ul className="filter-list">
                    <li
                        className={`filter-item ${currentPromotion === 'flash' ? 'active' : ''}`}
                        onClick={() => updateFilter('promo', currentPromotion === 'flash' ? null : 'flash')}
                    >
                        <span>Oferta relámpago</span>
                        <span className="filter-count">(1.802)</span>
                    </li>
                    <li
                        className={`filter-item ${currentPromotion === 'day' ? 'active' : ''}`}
                        onClick={() => updateFilter('promo', currentPromotion === 'day' ? null : 'day')}
                    >
                        <span>Oferta del día</span>
                        <span className="filter-count">(660)</span>
                    </li>
                </ul>
            </div>

            {/* Categorías Dinámicas */}
            <div className="filter-section">
                <h3 className="filter-title">Categorías</h3>
                <ul className="filter-list categories-scroll-list">
                    {categories.map((cat) => {
                        const isSelected = currentCategoryId === String(cat.id);
                        return (
                            <li
                                key={cat.id}
                                className={`filter-item ${isSelected ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(cat.id)}
                            >
                                <span className="cat-name">{cat.nombre}</span>
                                <span className="filter-count">({cat.cantidad_productos !== undefined ? cat.cantidad_productos : 0})</span>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Precio */}
            <div className="filter-section">
                <h3 className="filter-title">Precio</h3>
                <ul className="filter-list">
                    <li
                        className={`filter-item ${currentMax === '65000' && !currentMin ? 'active' : ''}`}
                        onClick={() => handlePresetPrice(null, 65000)}
                    >
                        <span>Hasta $65.000</span>
                        <span className="filter-count">(4.387)</span>
                    </li>
                    <li
                        className={`filter-item ${currentMin === '65000' && currentMax === '150000' ? 'active' : ''}`}
                        onClick={() => handlePresetPrice(65000, 150000)}
                    >
                        <span>$65.000 a $150.000</span>
                        <span className="filter-count">(4.161)</span>
                    </li>
                    <li
                        className={`filter-item ${currentMin === '150000' && !currentMax ? 'active' : ''}`}
                        onClick={() => handlePresetPrice(150000, null)}
                    >
                        <span>Más de $150.000</span>
                        <span className="filter-count">(5.230)</span>
                    </li>
                </ul>

                {/* Formulario Rango Personalizado */}
                <form onSubmit={handleCustomPrice} className="custom-price-form">
                    <div className="custom-price-inputs">
                        <input
                            type="number"
                            placeholder="Mínimo"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <span className="price-separator">-</span>
                        <input
                            type="number"
                            placeholder="Máximo"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="custom-price-btn" aria-label="Aplicar filtro de precio">
                        <ChevronRight size={16} />
                    </button>
                </form>
            </div>

            {/* Pago */}
            <div className="filter-section">
                <h3 className="filter-title">Pago</h3>
                <ul className="filter-list">
                    <li className="filter-item">
                        <span>En cuotas</span>
                        <span className="filter-count">(18.778)</span>
                    </li>
                    <li className="filter-item">
                        <span>Sin interés</span>
                        <span className="filter-count">(4.183)</span>
                    </li>
                </ul>
            </div>

            {/* Costo de envío */}
            <div className="filter-section">
                <h3 className="filter-title">Costo de envío</h3>
                <ul className="filter-list">
                    <li
                        className={`filter-item ${currentShipping === 'free' ? 'active' : ''}`}
                        onClick={() => updateFilter('shipping', currentShipping === 'free' ? null : 'free')}
                    >
                        <span className="green-highlight">Gratis</span>
                        <span className="filter-count">(9.924)</span>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default SidebarFilters;
