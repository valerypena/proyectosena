import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, X } from 'lucide-react';
import './Auth.css';

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('COMPRADOR');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/auth/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre_completo: nombre,
                    email,
                    contrasena: password,
                    rol
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Error en el registro');
            }

            // Could auto-login here, but for now redirect to login
            alert('Cuenta creada exitosamente. ¡Ahora ingresa!');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <Link to="/" className="auth-close"><X size={20} /></Link>

                <div className="auth-header-logo">
                    <img src="/logo.png" alt="Market Logo" className="auth-logo-img" />
                </div>

                <h1 className="auth-title">Crea tu cuenta</h1>
                <p className="auth-subtitle">Únete a nuestra comunidad</p>

                {error && <p className="error-msg" style={{ color: 'red', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <User className="input-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Nombre completo"
                            className="auth-input"
                            required
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    <div className="input-wrapper">
                        <Mail className="input-icon" size={18} />
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            className="auth-input"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-wrapper">
                        <Lock className="input-icon" size={18} />
                        <input
                            type="password"
                            placeholder="Crear contraseña"
                            className="auth-input"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label style={{ fontSize: '13px', color: '#666', marginBottom: '4px', display: 'block' }}>¿Qué deseas hacer?</label>
                        <select
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                            className="auth-input"
                            style={{ paddingLeft: '12px' }} // Reset padding since no icon
                        >
                            <option value="COMPRADOR">Comprar productos</option>
                            <option value="VENDEDOR">Vender productos</option>
                        </select>
                    </div>

                    <button type="submit" className="auth-submit-btn">Registrarme gratis</button>

                    <p className="auth-footer-text">
                        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
