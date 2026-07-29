import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfilePersonalData.css';

const ProfilePersonalData = () => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        nombre_completo: '',
        documento: '',
        ocupacion: ''
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                nombre_completo: user.nombre_completo || '',
                documento: user.documento || '',
                ocupacion: user.ocupacion || ''
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ text: '', type: '' });

        try {
            const res = await fetch('http://127.0.0.1:8000/auth/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setMsg({ text: 'Datos actualizados correctamente', type: 'success' });
                // Reload to refresh context
                setTimeout(() => window.location.reload(), 1000);
            } else {
                setMsg({ text: 'Error al actualizar', type: 'error' });
            }
        } catch (err) {
            console.error(err);
            setMsg({ text: 'Error de conexión', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="container" style={{ padding: '40px' }}>Cargando...</div>;

    return (
        <div className="container profile-personal-data-container">
            <div className="profile-personal-card">
                <div className="profile-personal-header">
                    <h2>Información Personal</h2>
                    <p>Gestiona tu información personal, documento de identidad y ocupación.</p>
                </div>

                {msg.text && (
                    <div className={`profile-message ${msg.type}`}>
                        {msg.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="profile-form-group">
                        <label className="profile-form-label">Nombre completo</label>
                        <input
                            type="text"
                            className="profile-form-input"
                            value={formData.nombre_completo}
                            onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                        />
                    </div>

                    <div className="profile-form-group">
                        <label className="profile-form-label">Documento de identidad</label>
                        <input
                            type="text"
                            className="profile-form-input"
                            placeholder="Ej: 12345678"
                            value={formData.documento}
                            onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                        />
                    </div>

                    <div className="profile-form-group">
                        <label className="profile-form-label">Ocupación</label>
                        <input
                            type="text"
                            className="profile-form-input"
                            placeholder="Ej: Estudiante, Ingeniero..."
                            value={formData.ocupacion}
                            onChange={(e) => setFormData({ ...formData, ocupacion: e.target.value })}
                        />
                    </div>

                    <div className="profile-form-actions">
                        <button type="button" className="btn-cancel" onClick={() => navigate('/perfil')}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePersonalData;
