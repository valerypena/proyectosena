import React, { useState, useContext, useEffect, useRef } from 'react';
import { Search, ShoppingCart, MapPin, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { apiFetch } from '../utils/api';
import './Navbar.css';

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [location, setLocation] = useState('Ingresa tu ubicación');
    const [categories, setCategories] = useState([]);
    const [showCategories, setShowCategories] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const suggestionsRef = useRef(null);

    useEffect(() => {
        apiFetch('/categorias')
            .then(data => setCategories(data || []))
            .catch(err => console.error("Error fetching categories:", err));
    }, []);

    // Autocomplete logic
    useEffect(() => {
        if (searchTerm.trim().length >= 2) {
            const delayDebounceFn = setTimeout(() => {
                apiFetch(`/sugerencias?q=${encodeURIComponent(searchTerm)}`)
                    .then(data => setSuggestions(data || []))
                    .catch(err => console.error("Error fetching suggestions:", err));
            }, 300); // Debounce
            return () => clearTimeout(delayDebounceFn);
        } else {
            setSuggestions([]);
        }
    }, [searchTerm]);

    // Close suggestions clicks outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (searchTerm.trim()) {
            setShowSuggestions(false);
            navigate(`/items?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleSelectSuggestion = (suggestion) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
        navigate(`/items?search=${encodeURIComponent(suggestion)}`);
    };

    const handleLocationClick = () => {
        const newLocation = prompt("Ingresa tu código postal o ciudad:");
        if (newLocation) {
            setLocation(newLocation);
        }
    };

    const toggleCategories = (e) => {
        e.stopPropagation();
        setShowCategories(!showCategories);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
            if (!event.target.closest('.nav-item-dropdown')) {
                setShowCategories(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="nav-header">
            <div className="container header-container">
                {/* Fila Superior: Logo, Búsqueda Central y Banner meli+ */}
                <div className="nav-row-top">
                    <Link to="/" className="nav-logo">
                        <img src="/logo.svg" alt="SenaMarket" className="nav-logo-img" />
                    </Link>

                    <div className="nav-search-container" ref={suggestionsRef}>
                        <form className="nav-search" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Buscar productos, marcas y más..."
                                className="nav-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                            />
                            <button type="submit" className="nav-search-btn" aria-label="Buscar">
                                <Search size={20} color="#666" />
                            </button>
                        </form>

                        {showSuggestions && suggestions.length > 0 && (
                            <div className="search-suggestions-dropdown">
                                <ul>
                                    {suggestions.map((item, index) => (
                                        <li key={index} onClick={() => handleSelectSuggestion(item)}>
                                            <Search size={16} color="#999" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="nav-promo-banner">
                        <div className="meli-plus-tag">
                            <span className="meli-plus-brand">meli<strong>+</strong></span>
                            <span className="meli-plus-price">DESDE <strong>$9.900</strong> /mes</span>
                        </div>
                        <div className="meli-plus-sub">
                            <span>CASHBACK EN TUS COMPRAS</span>
                        </div>
                    </div>
                </div>

                {/* Fila Inferior: Ubicación, Menú Central de Categorías y Perfil/Carrito */}
                <div className="nav-row-bottom">
                    <div className="nav-location" onClick={handleLocationClick}>
                        <MapPin size={18} className="nav-loc-icon" />
                        <div className="nav-loc-text">
                            <span className="nav-loc-label">Enviar a {user ? user.nombre_completo.split(' ')[0] : 'Ubicación'}</span>
                            <span className="nav-loc-address">{location}</span>
                        </div>
                    </div>

                    <ul className="nav-links">
                        <li
                            className="nav-item-dropdown"
                            onMouseEnter={() => setShowCategories(true)}
                            onMouseLeave={() => setShowCategories(false)}
                            onClick={toggleCategories}
                        >
                            <span className="nav-link-dropdown">
                                Categorías <span className="dropdown-arrow">▼</span>
                            </span>
                            <div className="dropdown-menu" style={{ display: showCategories ? 'block' : 'none' }}>
                                <ul>
                                    {categories.length > 0 ? (
                                        categories.map(cat => (
                                            <li key={cat.id}>
                                                <Link to={`/items?category=${cat.id}`}>{cat.nombre}</Link>
                                            </li>
                                        ))
                                    ) : (
                                        <li style={{ padding: '10px', color: '#999', cursor: 'default' }}>Cargando categorías...</li>
                                    )}
                                </ul>
                            </div>
                        </li>
                        <li><Link to="/items">Ofertas</Link></li>
                        <li><Link to="/cupones">Cupones</Link></li>
                        <li>
                            <Link to="/items?category=6" className="nav-link-with-badge">
                                Supermercado <span className="nav-badge-blue">NUEVO</span>
                            </Link>
                        </li>
                        <li><Link to="/items?category=2">Moda</Link></li>
                        {(user?.rol === 'VENDEDOR' || user?.rol === 'ADMINISTRADOR') ? (
                            <li><Link to="/resumen">Vender</Link></li>
                        ) : (
                            <li><Link to="/vender">Vender</Link></li>
                        )}
                        <li><Link to="/ayuda">Ayuda / PQR</Link></li>
                    </ul>

                    <div className="nav-user-tools">
                        {user ? (
                            <div className="nav-profile-menu">
                                <div className="nav-profile-trigger">
                                    <div className="avatar-circle-sm">
                                        {user.nombre_completo.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{user.nombre_completo.split(' ')[0]}</span>
                                    <span className="arrow-icon">▼</span>
                                </div>

                                <div className="profile-dropdown-content">
                                    <div className="profile-menu-header">
                                        <div className="avatar-large-menu">
                                            {user.nombre_completo.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="header-info">
                                            <span className="header-name">{user.nombre_completo}</span>
                                            <Link to="/perfil" className="header-link">Mi perfil {'>'}</Link>
                                        </div>
                                    </div>

                                    <Link to="/mis-compras" className="menu-item-link">Compras</Link>
                                    <Link to="/historial" className="menu-item-link">Historial</Link>
                                    <Link to="/preguntas" className="menu-item-link">Preguntas</Link>
                                    <Link to="/opiniones" className="menu-item-link">Opiniones</Link>

                                    <hr />

                                    <div className="menu-meli-plus">
                                        <span>Suscríbete desde $ 9.900</span>
                                        <span className="arrow-right">{'>'}</span>
                                    </div>

                                    <Link to="/suscripciones" className="menu-item-link">Suscripciones</Link>
                                    <Link to="/mercado-play" className="menu-item-link" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        Mercado Play <span className="badge-green">GRATIS</span>
                                    </Link>

                                    <hr />

                                    <Link to="/vender" className="menu-item-link">Vender</Link>
                                    <Link to="/resumen" className="menu-item-link">Resumen</Link>
                                    <Link to="/publicaciones" className="menu-item-link">Publicaciones</Link>
                                    <Link to="/ventas" className="menu-item-link">Ventas</Link>

                                    <hr />

                                    <div className="menu-item-link menu-item-logout" onClick={() => { logout(); navigate('/'); }}>
                                        Salir
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="nav-auth-links">
                                <Link to="/registro">Crea tu cuenta</Link>
                                <Link to="/login">Ingresa</Link>
                            </div>
                        )}

                        <Link to="/mis-compras" className="nav-tool-link">Mis compras</Link>
                        <span className="nav-tool-link nav-favorites-trigger">Favoritos ▼</span>

                        <Link to="/cart" className="nav-cart-btn" aria-label="Carrito de compras">
                            <ShoppingCart size={20} color="#ffffff" />
                            {totalItems > 0 && (
                                <span className="cart-badge-count">
                                    {totalItems > 99 ? '99+' : totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
