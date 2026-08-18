import React, { useState, useContext, useEffect, useRef } from 'react';
import { Search, ShoppingCart, MapPin, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [location, setLocation] = useState('Ingresa tu ubicación');
    const [categories, setCategories] = useState([]);
    const [showCategories, setShowCategories] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const suggestionsRef = useRef(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/categorias')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Error fetching categories:", err));
    }, []);

    // Autocomplete logic
    useEffect(() => {
        if (searchTerm.trim().length >= 2) {
            const delayDebounceFn = setTimeout(() => {
                fetch(`http://127.0.0.1:8000/sugerencias?q=${encodeURIComponent(searchTerm)}`)
                    .then(res => res.json())
                    .then(data => setSuggestions(data))
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
            {/* Orange Strip at Top */}
            <div className="nav-top-strip">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div
                        className="nav-location"
                        onClick={handleLocationClick}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                    >
                        <MapPin size={16} color="white" />
                        <span>Enviar a <strong>{location}</strong></span>
                    </div>
                </div>
            </div>

            <div className="container header-container">
                <div className="nav-top">
                    <Link to="/" className="nav-logo">
                        <img src="/logo.png" alt="Market" className="nav-logo-img" />
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
                            <button type="submit" className="nav-search-btn">
                                <Search size={22} color="white" />
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

                    <div className="nav-account">
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
                                    <Link to="/posventa" className="menu-item-link">Posventa</Link>
                                    <Link to="/reputacion" className="menu-item-link">Reputación</Link>
                                    <Link to="/publicidad" className="menu-item-link">Publicidad</Link>
                                    <Link to="/mi-pagina" className="menu-item-link">Mi página</Link>
                                    <Link to="/central-marketing" className="menu-item-link" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        Central de Marketing <span className="badge-blue">NUEVO</span>
                                    </Link>
                                    <Link to="/metricas" className="menu-item-link">Métricas</Link>
                                    <Link to="/facturacion" className="menu-item-link">Facturación</Link>

                                    <hr />

                                    <div className="menu-item-link menu-item-logout" onClick={() => { logout(); navigate('/'); }}>
                                        Salir
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link to="/registro">Crea tu cuenta</Link>
                                <Link to="/login">Ingresa</Link>
                                <Link to="/mis-compras">Mis compras</Link>
                            </>
                        )}
                        <Link to="/carrito" className="nav-cart" style={{ display: 'flex', alignItems: 'center' }}>
                            <ShoppingCart size={24} color="#333" />
                        </Link>
                    </div>
                </div>

                <div className="nav-bottom" style={{ marginTop: '10px' }}>
                    <ul className="nav-links">

                        <li
                            className="nav-item-dropdown"
                            onMouseEnter={() => setShowCategories(true)}
                            onMouseLeave={() => setShowCategories(false)}
                            onClick={toggleCategories}
                        >
                            <span className="nav-link-dropdown" style={{ fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <Menu size={18} style={{ marginRight: '4px' }} /> Categorías <span className="dropdown-arrow">▼</span>
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
                        <li><Link to="/ofertas" style={{ fontWeight: 'bold' }}>Ofertas</Link></li>
                        <li><Link to="/historial" style={{ fontWeight: 'bold' }}>Historial</Link></li>
                        <li><Link to="/items?category=2" style={{ fontWeight: 'bold' }}>Supermercado</Link></li>
                        <li><Link to="/items?category=15" style={{ fontWeight: 'bold' }}>Moda</Link></li>
                        {(user?.rol === 'VENDEDOR' || user?.rol === 'ADMINISTRADOR') ? (
                            <li><Link to="/resumen" style={{ fontWeight: 'bold', color: '#3483fa' }}>Ventas</Link></li>
                        ) : (
                            <li><Link to="/vender" style={{ fontWeight: 'bold' }}>Vender</Link></li>
                        )}
                        <li><Link to="/ayuda" style={{ fontWeight: 'bold' }}>Ayuda</Link></li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
