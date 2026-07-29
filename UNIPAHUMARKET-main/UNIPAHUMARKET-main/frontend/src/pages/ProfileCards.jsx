import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfileCards.css';
import { CreditCard, Plus, X } from 'lucide-react';

const ProfileCards = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        numero_completo: '',
        nombre_titular: '',
        marca: 'Visa', // Default
        fecha_vencimiento: '',
        cvv: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCards();
    }, [token]);

    const fetchCards = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/perfil/tarjetas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCards(data);
            }
        } catch (error) {
            console.error("Error loading cards", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/perfil/tarjetas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowForm(false);
                setFormData({
                    numero_completo: '', nombre_titular: '', marca: 'Visa', fecha_vencimiento: '', cvv: ''
                });
                fetchCards();
            } else {
                alert('Error al guardar tarjeta (Verifique que el número tenga al menos 13 dígitos)');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar esta tarjeta?')) return;
        try {
            const res = await fetch(`http://127.0.0.1:8000/perfil/tarjetas/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchCards();
        } catch (err) {
            console.error(err);
        }
    };

    // Helper para detectar marca (muy básico)
    const detectBrand = (num) => {
        if (num.startsWith('4')) return 'Visa';
        if (num.startsWith('5')) return 'Mastercard';
        return 'Otra';
    };

    if (loading) return <div className="container" style={{ padding: '40px' }}>Cargando...</div>;

    return (
        <div className="container profile-cards-container">
            <div className="profile-cards-header">
                <h2>Mis Tarjetas</h2>
                {!showForm && (
                    <button className="btn-add-new" onClick={() => setShowForm(true)}>
                        <Plus size={16} style={{ marginRight: '5px' }} /> Nueva tarjeta
                    </button>
                )}
            </div>

            {showForm ? (
                <div className="card-form-container">
                    <h3>Agregar tarjeta</h3>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>Datos seguros. Simulación para demo.</p>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Número de Tarjeta</label>
                            <input type="text" maxLength="19" required value={formData.numero_completo}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setFormData({ ...formData, numero_completo: val, marca: detectBrand(val) });
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Nombre del Titular</label>
                            <input type="text" required value={formData.nombre_titular} onChange={e => setFormData({ ...formData, nombre_titular: e.target.value })} />
                        </div>
                        <div className="form-row">
                            <div className="form-col form-group">
                                <label>Vencimiento (MM/YY)</label>
                                <input type="text" placeholder="MM/YY" maxLength="5" required value={formData.fecha_vencimiento} onChange={e => setFormData({ ...formData, fecha_vencimiento: e.target.value })} />
                            </div>
                            <div className="form-col form-group">
                                <label>CVV</label>
                                <input type="password" maxLength="4" required value={formData.cvv} onChange={e => setFormData({ ...formData, cvv: e.target.value })} />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                            <button type="submit" className="btn-primary" disabled={submitting}>
                                {submitting ? 'Guardando...' : 'Guardar tarjeta'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    {cards.length === 0 ? (
                        <div className="empty-state">
                            <CreditCard size={48} color="#ddd" />
                            <p>No tienes tarjetas guardadas.</p>
                        </div>
                    ) : (
                        <div className="cards-grid">
                            {cards.map(card => (
                                <div className="credit-card-display" key={card.id}>
                                    <button className="btn-delete-card" onClick={() => handleDelete(card.id)}><X size={14} /></button>
                                    <div className="card-brand">{card.marca}</div>
                                    <div className="card-number">**** **** **** {card.numero_ultimos_4}</div>
                                    <div className="card-holder">{card.nombre_titular}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            <div style={{ marginTop: '40px' }}>
                <button className="btn-secondary" onClick={() => navigate('/perfil')}>Volver al perfil</button>
            </div>
        </div>
    );
};

export default ProfileCards;
