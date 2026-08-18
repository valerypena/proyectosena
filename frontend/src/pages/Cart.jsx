import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import './Cart.css';

const Cart = () => {
    const { token } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (token) {
            fetchItems();
        }
    }, [token]);

    const fetchItems = () => {
        fetch('http://127.0.0.1:8000/compras/carrito', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setItems(data);
                // Calcular total simple
                // Nota: El endpoint actual retorna items, pero no detalles completos del producto (nombre, precio, img)
                // Tuvimos que editar backend/schemas.py para incluir `producto: ProductoOut`
                // Asumimos que el backend ya lo devuelve así
                const t = data.reduce((acc, item) => acc + (item.cantidad * item.producto.precio), 0);
                setTotal(t);
            })
            .catch(console.error);
    };

    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (!token) return <div className="container"><h2>Inicia sesión para ver tu carrito</h2></div>;

    if (items.length === 0) return <div className="container" style={{ padding: '20px' }}><h2>Tu carrito está vacío</h2></div>;

    return (
        <div className="container cart-container">
            <div className="cart-items card">
                <h2>Carrito ({items.reduce((acc, i) => acc + i.cantidad, 0)})</h2>
                {items.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="cart-img">
                            {/* Proteger si item.producto es null por alguna razon */}
                            {item.producto && <img src={item.producto.url_imagen || "https://via.placeholder.com/60"} alt={item.producto.nombre} />}
                        </div>
                        <div className="cart-details">
                            <h3>{item.producto?.nombre}</h3>
                            <span className="cart-action">Eliminar</span>
                        </div>
                        <div className="cart-quantity">
                            <span className="q-label">Unidades: {item.cantidad}</span>
                        </div>
                        <div className="cart-price">
                            {formatPrice(item.producto?.precio * item.cantidad)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-summary card">
                <h3>Resumen de compra</h3>
                <div className="summary-row">
                    <span>Productos</span>
                    <span>{formatPrice(total)}</span>
                </div>
                <div className="summary-row">
                    <span>Envío</span>
                    <span className="green-text">Gratis</span>
                </div>
                <div className="summary-total">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                </div>
                <button className="btn-primary checkout-btn" onClick={handleCheckout}>Continuar compra</button>
            </div>
        </div>
    );
};

export default Cart;
