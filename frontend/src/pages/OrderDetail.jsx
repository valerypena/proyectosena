import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import { ArrowLeft, Package, MapPin, CreditCard, Calendar } from 'lucide-react';
import './OrderDetail.css';

const OrderDetail = () => {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        fetch(`http://127.0.0.1:8000/compras/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("No se pudo cargar la orden");
                return res.json();
            })
            .then(data => setOrder(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id, token]);

    if (loading) return <div className="container" style={{ padding: '40px' }}>Cargando detalle de compra...</div>;
    if (!order) return <div className="container" style={{ padding: '40px' }}>Orden no encontrada.</div>;

    return (
        <div className="container order-detail-container">
            <button className="btn-link" onClick={() => navigate('/mis-compras')} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ArrowLeft size={16} /> Volver a mis compras
            </button>

            <div className="order-detail-header">
                <h2>Detalle de la compra #{order.id}</h2>
                <span className={`status-badge status-${order.estado.toLowerCase()}`}>
                    {order.estado}
                </span>
            </div>

            <div className="order-detail-grid">
                <div className="detail-left">
                    <div className="detail-section">
                        <h3><Package size={18} style={{ marginRight: '10px' }} /> Productos</h3>
                        {order.items.map(item => (
                            <div key={item.id} className="order-item-detail">
                                <div className="item-img">
                                    <img src={item.producto?.url_imagen || "https://via.placeholder.com/150"} alt={item.producto?.nombre} />
                                </div>
                                <div className="item-info">
                                    <div className="item-name">{item.producto?.nombre}</div>
                                    <div className="item-meta">
                                        {item.cantidad} x {formatPrice(item.precio_al_comprar)}
                                    </div>
                                </div>
                                <div className="item-total" style={{ fontWeight: '600' }}>
                                    {formatPrice(item.precio_al_comprar * item.cantidad)}
                                </div>
                            </div>
                        ))}
                        <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '18px', fontWeight: '700', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                            Total: {formatPrice(order.monto_total)}
                        </div>
                    </div>
                </div>

                <div className="detail-right">
                    <div className="detail-section">
                        <h3><MapPin size={18} style={{ marginRight: '10px' }} /> Envío</h3>
                        {order.direccion ? (
                            <div className="info-content">
                                <div className="info-row">
                                    <span className="info-label">Calle y número</span>
                                    <span className="info-value">{order.direccion.calle} {order.direccion.numero}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Ciudad</span>
                                    <span className="info-value">{order.direccion.ciudad}, {order.direccion.provincia}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Teléfono</span>
                                    <span className="info-value">{order.direccion.telefono_contacto}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="sub-text">Información de envío no disponible</p>
                        )}
                    </div>

                    <div className="detail-section">
                        <h3><CreditCard size={18} style={{ marginRight: '10px' }} /> Pago</h3>
                        <div className="info-row">
                            <span className="info-label">Método de pago</span>
                            <span className="info-value" style={{ textTransform: 'uppercase' }}>{order.metodo_pago || 'Desconocido'}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Fecha</span>
                            <span className="info-value">{new Date(order.creado_en).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
