import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { formatPrice } from '../utils/currency';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import './Cart.css';

const Cart = () => {
    const { items, subtotal, removeFromCart, totalItems, loading } = useCart();
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    if (!token) {
        return (
            <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 20px' }}>
                    <ShoppingBag size={56} color="#ff5722" style={{ margin: '0 auto 16px' }} />
                    <h2 style={{ marginBottom: '10px' }}>Inicia sesión para ver tu carrito</h2>
                    <p style={{ color: '#666', marginBottom: '24px' }}>Descubre miles de ofertas y guarda tus productos favoritos.</p>
                    <Link to="/login" className="btn-primary" style={{ display: 'inline-block' }}>
                        Iniciar Sesión
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0 && !loading) {
        return (
            <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 20px' }}>
                    <ShoppingBag size={56} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
                    <h2 style={{ marginBottom: '10px' }}>Tu carrito está vacío</h2>
                    <p style={{ color: '#666', marginBottom: '24px' }}>¿No sabes qué comprar? ¡Miles de productos te esperan!</p>
                    <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        Descubrir productos <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container cart-container">
            <div className="cart-items card">
                <h2>Carrito ({totalItems})</h2>
                {items.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="cart-img">
                            <ImageWithFallback 
                                src={item.producto?.url_imagen} 
                                alt={item.producto?.nombre} 
                                style={{ width: '64px', height: '64px', objectFit: 'contain', borderRadius: '4px' }}
                            />
                        </div>
                        <div className="cart-details">
                            <h3>{item.producto?.nombre}</h3>
                            <button 
                                className="cart-action" 
                                onClick={() => removeFromCart(item.id)}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px', marginTop: '4px' }}
                            >
                                <Trash2 size={14} /> Eliminar
                            </button>
                        </div>
                        <div className="cart-quantity">
                            <span className="q-label">Unidades: <strong>{item.cantidad}</strong></span>
                        </div>
                        <div className="cart-price">
                            {formatPrice((item.producto?.precio || 0) * item.cantidad)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-summary card">
                <h3>Resumen de compra</h3>
                <div className="summary-row">
                    <span>Productos ({totalItems})</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="summary-row">
                    <span>Envío</span>
                    <span className="green-text" style={{ color: '#10b981', fontWeight: 'bold' }}>Gratis</span>
                </div>
                <div className="summary-total">
                    <span>Total</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
                <button className="btn-primary checkout-btn" onClick={() => navigate('/checkout')}>
                    Continuar compra
                </button>
            </div>
        </div>
    );
};

export default Cart;
