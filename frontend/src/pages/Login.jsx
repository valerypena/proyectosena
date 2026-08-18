import React, { useState, useContext } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, X } from 'lucide-react';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const response = await fetch('http://127.0.0.1:8000/auth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            if (!response.ok) throw new Error('Credenciales incorrectas');

            const data = await response.json();
            login(data.access_token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    const processSocialLogin = async (token, provider) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/auth/social-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, provider })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error en autenticación social');
            }

            const data = await response.json();
            login(data.access_token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: tokenResponse => processSocialLogin(tokenResponse.access_token, 'google'),
        onError: () => setError('Error al conectar con Google'),
    });

    const handleFacebookLogin = () => {
        if (!window.FB) {
            setError('Error: Facebook SDK no está listo. Verifica tu conexión o bloqueadores de anuncios.');
            return;
        }
        window.FB.login(function (response) {
            if (response.authResponse) {
                processSocialLogin(response.authResponse.accessToken, 'facebook');
            } else {
                // User cancelled login or did not fully authorize
            }
        }, { scope: 'public_profile,email' });
    };

    return (
        <div className="auth-container">
            {/* Dark overlay background is handled by CSS, this is the main card */}
            <div className="auth-box">
                <Link to="/" className="auth-close"><X size={20} /></Link>

                {/* Logo Section */}
                <div className="auth-header-logo">
                    <img src="/logo.png" alt="Market Logo" className="auth-logo-img" />
                </div>

                <h1 className="auth-title">Bienvenido de nuevo</h1>
                <p className="auth-subtitle">Ingresa a tu cuenta de Market</p>

                {error && <p className="error-msg" style={{ color: 'red', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <Mail className="input-icon" size={18} />
                        <input
                            type="email"
                            placeholder="admin"
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
                            placeholder="***"
                            className="auth-input"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="auth-options">
                        <label className="remember-me">
                            <input type="checkbox" /> Recordarme
                        </label>
                        <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
                    </div>

                    <button type="submit" className="auth-submit-btn">Iniciar sesión</button>

                    <div className="auth-divider">
                        <span>O continúa con</span>
                    </div>

                    <div className="social-buttons">
                        <button type="button" className="social-btn" onClick={() => googleLogin()}>
                            <span style={{ color: '#DB4437', fontWeight: 'bold' }}>G</span> Google
                        </button>
                        <button type="button" className="social-btn" onClick={handleFacebookLogin}>
                            <span style={{ color: '#4267B2', fontWeight: 'bold' }}>f</span> Facebook
                        </button>
                    </div>

                    <p className="auth-footer-text">
                        ¿No tienes una cuenta? <Link to="/registro">Regístrate gratis</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
