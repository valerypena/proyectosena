import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import { Link } from 'react-router-dom';
import { Star, X } from 'lucide-react';
import './MisCompras.css';

const MisCompras = () => {
    const { token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (!token) { setLoading(false); return; }
        fetchOrders();
    }, [token]);

    const fetchOrders = () => {
        fetch('http://127.0.0.1:8000/compras/mis-ordenes', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const handleOpenReview = (product, orderId) => {
        setSelectedProduct(product);
        setSelectedOrderId(orderId);
        setShowReviewModal(true);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://127.0.0.1:8000/resenas/${selectedProduct.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    calificacion: rating,
                    comentario: comment,
                    compra_id: selectedOrderId
                })
            });
            if (res.ok) {
                alert('¡Gracias por tu opinión!');
                setShowReviewModal(false);
                setComment('');
                setRating(5);
            } else {
                const err = await res.json();
                alert(err.detail || 'Error al enviar reseña');
            }
        } catch (err) { console.error(err); }
    };

    if (!token) return <div className="container" style={{ padding: '40px', textAlign: 'center' }}><h2>Inicia sesión</h2><Link to="/login" className="btn-primary">Login</Link></div>;
    if (loading) return <div className="container">Cargando...</div>;

    return (
        <div className="container mis-compras-container">
            <h1 className="page-title">Mis Compras</h1>
            <div className="orders-list">
                {orders.map(order => (
                    <div key={order.id} className="card order-card">
                        <div className="order-header">
                            <span className="order-date">{new Date(order.creado_en).toLocaleDateString()}</span>
                            <span className={`order-status status-${order.estado?.toLowerCase()}`}>
                                {order.estado}
                            </span>
                        </div>
                        <div className="order-body">
                            <div className="order-items-list">
                                {order.items.map(item => (
                                    <div key={item.id} className="order-item-mini">
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <img src={item.producto.url_imagen} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                            <div>
                                                <p style={{ fontSize: '13px', margin: 0 }}>{item.producto.nombre}</p>
                                                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{item.cantidad} x {formatPrice(item.precio_al_comprar)}</p>
                                            </div>
                                        </div>
                                        {order.estado === 'ENTREGADO' && (
                                            <button className="btn-link" onClick={() => handleOpenReview(item.producto, order.id)}>Opinar</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="order-summary-side">
                                <div className="order-total">
                                    <span>Total:</span>
                                    <strong>{formatPrice(order.monto_total)}</strong>
                                </div>
                                <Link to={`/compras/${order.id}`} className="btn-secondary" style={{ textDecoration: 'none', textAlign: 'center', display: 'block', marginTop: '10px' }}>Detalles</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Reseña */}
            {showReviewModal && (
                <div className="overlay">
                    <div className="form-modal animated-fade-in" style={{ maxWidth: '400px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2>Opinar sobre el producto</h2>
                            <button onClick={() => setShowReviewModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                        </div>
                        <p style={{ fontSize: '14px', marginBottom: '20px' }}>¿Qué te pareció <strong>{selectedProduct.nombre}</strong>?</p>
                        <form onSubmit={handleSubmitReview}>
                            <div className="rating-select" style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '20px' }}>
                                {[1, 2, 3, 4, 5].map(v => (
                                    <Star
                                        key={v}
                                        size={32}
                                        fill={v <= rating ? "#3483fa" : "none"}
                                        stroke={v <= rating ? "#3483fa" : "#ccc"}
                                        onClick={() => setRating(v)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </div>
                            <textarea
                                placeholder="Escribe un comentario opcional..."
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                style={{ width: '100%', padding: '10px', height: '100px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '20px' }}
                            />
                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Enviar opinión</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MisCompras;
