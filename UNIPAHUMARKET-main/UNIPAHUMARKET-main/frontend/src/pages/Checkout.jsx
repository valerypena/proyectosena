import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import { CreditCard, MapPin, ShieldCheck, Plus, CheckCircle } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Delivery, 2: Payment, 3: Review

    // Data state
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [cards, setCards] = useState([]);

    // Selection state
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(''); // 'card', 'nequi', 'pse'
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [newCardDetails, setNewCardDetails] = useState({ number: '', name: '', expiry: '', cvc: '', doc: '' });
    const [isNewCard, setIsNewCard] = useState(false);

    useEffect(() => {
        if (!token) return;

        // Fetch Cart
        fetch('http://127.0.0.1:8000/compras/carrito', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                setCartItems(data);
                setTotal(data.reduce((acc, item) => acc + (item.cantidad * item.producto.precio), 0));
            });

        // Fetch Addresses
        fetch('http://127.0.0.1:8000/perfil/direcciones', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                setAddresses(data);
                if (data.length > 0) setSelectedAddressId(data[0].id);
            });

        // Fetch Cards
        fetch('http://127.0.0.1:8000/perfil/tarjetas', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setCards(data));

    }, [token]);

    const handleFinalize = async () => {
        if (!selectedAddressId || !paymentMethod) {
            alert('Por favor selecciona dirección y método de pago');
            return;
        }

        try {
            const res = await fetch('http://127.0.0.1:8000/compras/checkout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    direccion_id: selectedAddressId,
                    metodo_pago: paymentMethod,
                    tarjeta_id: selectedCardId
                })
            });
            if (res.ok) {
                alert('¡Compra realizada con éxito!');
                navigate('/mis-compras');
            } else {
                const err = await res.json();
                alert(`Error: ${err.detail || 'Error al procesar el pago'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        }
    };

    const getSelectedAddress = () => addresses.find(a => a.id === selectedAddressId);
    const getSelectedCard = () => cards.find(c => c.id === selectedCardId);

    const renderDeliveryStep = () => (
        <div className="checkout-step-content">
            <h2 className="step-title">Elige dónde recibir tu compra</h2>

            <div className="options-list">
                {addresses.map(addr => (
                    <div
                        key={addr.id}
                        className={`option-card ${selectedAddressId === addr.id ? 'selected' : ''}`}
                        onClick={() => setSelectedAddressId(addr.id)}
                    >
                        <div className="option-radio">
                            <input type="radio" checked={selectedAddressId === addr.id} readOnly />
                        </div>
                        <div className="option-details">
                            <div className="option-header">
                                <span className="option-name">{addr.calle} {addr.numero}</span>
                                <span className="green-text">Llega gratis mañana</span>
                            </div>
                            <p className="sub-text">{addr.ciudad}, {addr.provincia} - {addr.nombre_contacto}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button className="btn-link" onClick={() => navigate('/perfil/direcciones')}>
                <Plus size={16} /> Agregar nueva dirección
            </button>

            <div className="step-actions">
                <button className="btn-primary" disabled={!selectedAddressId} onClick={() => setStep(2)}>
                    Continuar
                </button>
            </div>
        </div>
    );

    const renderPaymentStep = () => (
        <div className="checkout-step-content">
            <h2 className="step-title">¿Cómo quieres pagar?</h2>

            {/* Saved Cards */}
            {cards.length > 0 && (
                <div className="saved-cards-section">
                    <h3>Mis tarjetas</h3>
                    {cards.map(card => (
                        <div
                            key={card.id}
                            className={`option-card ${paymentMethod === 'card' && selectedCardId === card.id ? 'selected' : ''}`}
                            onClick={() => {
                                setPaymentMethod('card');
                                setSelectedCardId(card.id);
                                setIsNewCard(false);
                            }}
                        >
                            <div className="option-radio">
                                <input type="radio" checked={paymentMethod === 'card' && selectedCardId === card.id} readOnly />
                            </div>
                            <div className="option-details">
                                <span className="option-name">{card.marca} **** {card.numero_ultimos_4}</span>
                                <p className="sub-text">{card.nombre_titular}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <h3>Otros medios</h3>

            {/* New Card Option */}
            <div
                className={`option-card ${paymentMethod === 'card' && isNewCard ? 'selected' : ''}`}
                onClick={() => {
                    setPaymentMethod('card');
                    setSelectedCardId(null);
                    setIsNewCard(true);
                }}
            >
                <div className="option-radio">
                    <input type="radio" checked={paymentMethod === 'card' && isNewCard} readOnly />
                </div>
                <div className="option-details">
                    <span className="option-name">Nueva tarjeta de crédito o débito</span>
                </div>
            </div>

            {/* Nequi / PSE */}
            {['nequi', 'pse'].map(type => (
                <div
                    key={type}
                    className={`option-card ${paymentMethod === type ? 'selected' : ''}`}
                    onClick={() => { setPaymentMethod(type); setSelectedCardId(null); setIsNewCard(false); }}
                >
                    <div className="option-radio">
                        <input type="radio" checked={paymentMethod === type} readOnly />
                    </div>
                    <div className="option-details">
                        <span className="option-name" style={{ textTransform: 'uppercase' }}>{type}</span>
                    </div>
                </div>
            ))}

            {/* New Card Form */}
            {paymentMethod === 'card' && isNewCard && (
                <div className="card-form animated-fade-in">
                    <input type="text" placeholder="Número de tarjeta" value={newCardDetails.number} onChange={e => setNewCardDetails({ ...newCardDetails, number: e.target.value })} />
                    <input type="text" placeholder="Nombre del titular" value={newCardDetails.name} onChange={e => setNewCardDetails({ ...newCardDetails, name: e.target.value })} />
                    <div className="form-row">
                        <input type="text" placeholder="MM/YY" value={newCardDetails.expiry} onChange={e => setNewCardDetails({ ...newCardDetails, expiry: e.target.value })} />
                        <input type="text" placeholder="CVV" value={newCardDetails.cvc} onChange={e => setNewCardDetails({ ...newCardDetails, cvc: e.target.value })} />
                    </div>
                </div>
            )}

            <div className="step-actions">
                <button
                    className="btn-primary"
                    disabled={!paymentMethod}
                    onClick={() => setStep(3)}
                >
                    Continuar
                </button>
            </div>
        </div>
    );

    const renderReviewStep = () => {
        const addr = getSelectedAddress();
        return (
            <div className="checkout-step-content">
                <h2 className="step-title">Confirma tu compra</h2>

                <div className="review-block">
                    <div className="review-item">
                        <div className="review-icon"><MapPin size={20} /></div>
                        <div className="review-text">
                            <strong>Envío</strong>
                            <p>{addr ? `${addr.calle} ${addr.numero}, ${addr.ciudad}` : 'Dirección no seleccionada'}</p>
                            <p style={{ color: '#00a650' }}>Llega mañana - Gratis</p>
                        </div>
                        <button className="btn-link" onClick={() => setStep(1)}>Editar</button>
                    </div>

                    <div className="review-item">
                        <div className="review-icon"><CreditCard size={20} /></div>
                        <div className="review-text">
                            <strong>Pago</strong>
                            <p>
                                {paymentMethod === 'card' && !isNewCard && getSelectedCard() ?
                                    `${getSelectedCard().marca} **** ${getSelectedCard().numero_ultimos_4}` :
                                    paymentMethod.toUpperCase()
                                }
                            </p>
                        </div>
                        <button className="btn-link" onClick={() => setStep(2)}>Editar</button>
                    </div>
                </div>

                <div className="step-actions">
                    <button className="btn-primary big-btn" onClick={handleFinalize}>Confirmar compra</button>
                </div>
            </div>
        );
    };

    if (!token) return <div className="container">Cargando...</div>;

    return (
        <div className="container checkout-container">
            <div className="checkout-main">
                {step === 1 && renderDeliveryStep()}
                {step === 2 && renderPaymentStep()}
                {step === 3 && renderReviewStep()}
            </div>

            <div className="checkout-sidebar">
                <div className="card summary-card">
                    <h3>Resumen de compra</h3>
                    <div className="summary-row">
                        <span>Productos ({cartItems.reduce((a, b) => a + b.cantidad, 0)})</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Envío</span>
                        <span className="green-text">Gratis</span>
                    </div>
                    <hr />
                    <div className="summary-total">
                        <span>Pagás</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    <div className="safe-buy-badge">
                        <ShieldCheck size={16} color="#00a650" />
                        <span>Compra Protegida</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
