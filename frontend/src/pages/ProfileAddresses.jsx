import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfileAddresses.css';
import { MapPin, Plus } from 'lucide-react';

const ProfileAddresses = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        calle: '',
        numero: '',
        piso_depto: '',
        ciudad: '',
        provincia: '',
        codigo_postal: '',
        referencias: '',
        telefono_contacto: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAddresses();
    }, [token]);

    const fetchAddresses = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/perfil/direcciones', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAddresses(data);
            }
        } catch (error) {
            console.error("Error loading addresses", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/perfil/direcciones', {
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
                    calle: '', numero: '', piso_depto: '', ciudad: '', provincia: '',
                    codigo_postal: '', referencias: '', telefono_contacto: ''
                });
                fetchAddresses();
            } else {
                alert('Error al guardar dirección');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar esta dirección?')) return;
        try {
            const res = await fetch(`http://127.0.0.1:8000/perfil/direcciones/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchAddresses();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="container" style={{ padding: '40px' }}>Cargando...</div>;

    return (
        <div className="container profile-addresses-container">
            <div className="profile-addresses-header">
                <h2>Mis Direcciones</h2>
                {!showForm && (
                    <button className="btn-add-new" onClick={() => setShowForm(true)}>
                        <Plus size={16} style={{ marginRight: '5px' }} /> Agregar dirección
                    </button>
                )}
            </div>

            {showForm ? (
                <div className="address-form-card">
                    <h3>Nueva dirección</h3>
                    <form onSubmit={handleSave}>
                        <div className="form-row">
                            <div className="form-col form-group">
                                <label>Código Postal</label>
                                <input type="text" value={formData.codigo_postal} onChange={e => setFormData({ ...formData, codigo_postal: e.target.value })} />
                            </div>
                            <div className="form-col form-group">
                                <label>Provincia</label>
                                <input type="text" required value={formData.provincia} onChange={e => setFormData({ ...formData, provincia: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Ciudad</label>
                            <input type="text" required value={formData.ciudad} onChange={e => setFormData({ ...formData, ciudad: e.target.value })} />
                        </div>
                        <div className="form-row">
                            <div className="form-col form-group">
                                <label>Calle</label>
                                <input type="text" required value={formData.calle} onChange={e => setFormData({ ...formData, calle: e.target.value })} />
                            </div>
                            <div className="form-col form-group">
                                <label>Número</label>
                                <input type="text" required value={formData.numero} onChange={e => setFormData({ ...formData, numero: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-col form-group">
                                <label>Piso / Depto (Opcional)</label>
                                <input type="text" value={formData.piso_depto} onChange={e => setFormData({ ...formData, piso_depto: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Referencias (Opcional)</label>
                            <input type="text" value={formData.referencias} onChange={e => setFormData({ ...formData, referencias: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Teléfono de contacto</label>
                            <input type="text" required value={formData.telefono_contacto} onChange={e => setFormData({ ...formData, telefono_contacto: e.target.value })} />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                            <button type="submit" className="btn-primary" disabled={submitting}>
                                {submitting ? 'Guardando...' : 'Guardar dirección'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    {addresses.length === 0 ? (
                        <div className="empty-state">
                            <MapPin size={48} color="#ddd" />
                            <p>No tienes direcciones guardadas.</p>
                        </div>
                    ) : (
                        <div className="addresses-grid">
                            {addresses.map(addr => (
                                <div className="address-card" key={addr.id}>
                                    <h3>{addr.calle} {addr.numero}</h3>
                                    <div className="address-details">
                                        <p>{addr.piso_depto && `Piso/Depto: ${addr.piso_depto}`}</p>
                                        <p>{addr.ciudad}, {addr.provincia}</p>
                                        <p>CP: {addr.codigo_postal}</p>
                                        <p>{addr.nombre_contacto} - {addr.telefono_contacto}</p>
                                    </div>
                                    <div className="address-actions">
                                        <button className="btn-delete" onClick={() => handleDelete(addr.id)}>Eliminar</button>
                                    </div>
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

export default ProfileAddresses;
