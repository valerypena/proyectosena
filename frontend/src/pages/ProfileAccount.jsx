import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfileAccount.css';

const ProfileAccount = () => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [editingEmail, setEditingEmail] = useState(false);
    const [email, setEmail] = useState(user?.email || '');

    const [editingPass, setEditingPass] = useState(false);
    const [passwords, setPasswords] = useState({ new: '', confirm: '' });

    const [msg, setMsg] = useState({ text: '', type: '' });

    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://127.0.0.1:8000/auth/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ email })
            });
            if (res.ok) {
                setMsg({ text: 'Email actualizado (requiere re-login)', type: 'success' });
                setEditingEmail(false);
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setMsg({ text: 'Error al actualizar email', type: 'error' });
            }
        } catch (err) { console.error(err); }
    };

    const handleUpdatePass = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setMsg({ text: 'Las contraseñas no coinciden', type: 'error' });
            return;
        }
        try {
            const res = await fetch('http://127.0.0.1:8000/auth/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ contrasena: passwords.new })
            });
            if (res.ok) {
                setMsg({ text: 'Contraseña actualizada', type: 'success' });
                setEditingPass(false);
                setPasswords({ new: '', confirm: '' });
            } else {
                setMsg({ text: 'Error al actualizar contraseña', type: 'error' });
            }
        } catch (err) { console.error(err); }
    };

    if (!user) return <div>Cargando...</div>;

    return (
        <div className="container profile-account-container">
            <h2 style={{ marginBottom: '20px' }}>Datos de tu cuenta</h2>

            {msg.text && (
                <div style={{
                    padding: '10px', marginBottom: '20px', borderRadius: '4px',
                    background: msg.type === 'success' ? '#e8f7ed' : '#fce8e8',
                    color: msg.type === 'success' ? '#00a650' : '#d12424'
                }}>
                    {msg.text}
                </div>
            )}

            {/* Email Section */}
            <div className="account-section">
                <h3>Email</h3>
                {!editingEmail ? (
                    <div>
                        <p className="account-value">{user.email}</p>
                        <button className="btn-change" onClick={() => setEditingEmail(true)}>Modificar</button>
                    </div>
                ) : (
                    <form onSubmit={handleUpdateEmail}>
                        <div className="form-group">
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                style={{ padding: '8px', width: '100%', marginBottom: '10px' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="btn-primary">Guardar</button>
                            <button type="button" className="btn-secondary" onClick={() => setEditingEmail(false)}>Cancelar</button>
                        </div>
                    </form>
                )}
            </div>

            {/* Password Section */}
            <div className="account-section">
                <h3>Contraseña</h3>
                {!editingPass ? (
                    <div>
                        <p className="account-value">********</p>
                        <button className="btn-change" onClick={() => setEditingPass(true)}>Modificar</button>
                    </div>
                ) : (
                    <form onSubmit={handleUpdatePass}>
                        <div className="form-group" style={{ marginBottom: '10px' }}>
                            <label style={{ fontSize: '13px' }}>Nueva contraseña</label>
                            <input type="password" required value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                style={{ padding: '8px', width: '100%' }} />
                        </div>
                        <div className="form-group" style={{ marginBottom: '10px' }}>
                            <label style={{ fontSize: '13px' }}>Confirmar contraseña</label>
                            <input type="password" required value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                style={{ padding: '8px', width: '100%' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="btn-primary">Guardar</button>
                            <button type="button" className="btn-secondary" onClick={() => setEditingPass(false)}>Cancelar</button>
                        </div>
                    </form>
                )}
            </div>

            <button className="btn-secondary" onClick={() => navigate('/perfil')}>Volver al perfil</button>
        </div>
    );
};

export default ProfileAccount;
