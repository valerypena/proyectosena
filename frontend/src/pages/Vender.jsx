import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Vender.css';

const Vender = () => {
    const { user, token, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleActivateVendor = async () => {
        try {
            // 1. Cambiar rol a VENDEDOR
            const resUser = await fetch('http://127.0.0.1:8000/auth/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rol: 'VENDEDOR' })
            });

            if (resUser.ok) {
                const updatedUser = await resUser.json();
                setUser(updatedUser);

                // 2. Crear emprendimiento por defecto
                await fetch('http://127.0.0.1:8000/vendedor/emprendimientos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        nombre_marca: `Tienda de ${updatedUser.nombre_completo}`,
                        descripcion: 'Bienvenido a mi nueva tienda.'
                    })
                });

                alert('¡Ahora eres vendedor! Ya puedes publicar tus productos.');
                navigate('/resumen');
            }
        } catch (error) {
            console.error(error);
            alert('Error al activar cuenta de vendedor');
        }
    };

    return (
        <main className="vender-container">
            <section className="vender-hero">
                <div className="vender-content">
                    <h1>Vende en Unimarket</h1>
                    <p>Llega a millones de compradores y haz crecer tu negocio hoy mismo.</p>

                    {user ? (
                        <div className="vender-cta-box">
                            <p>¡Hola <strong>{user.nombre_completo}</strong>!</p>
                            {user.rol === 'VENDEDOR' || user.rol === 'ADMINISTRADOR' ? (
                                <Link to="/resumen" className="vender-btn-primary">Ir a mi Panel de Ventas</Link>
                            ) : (
                                <button className="vender-btn-primary" onClick={handleActivateVendor}>Activar cuenta de Vendedor</button>
                            )}
                        </div>
                    ) : (
                        <div className="vender-auth-box">
                            <Link to="/registro" className="vender-btn-primary">Crear cuenta</Link>
                            <Link to="/login" className="vender-btn-secondary">Ya tengo cuenta</Link>
                        </div>
                    )}
                </div>
            </section>

            <section className="vender-benefits container">
                <h2>¿Por qué vender con nosotros?</h2>
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <h3>🚀 Alcance Masivo</h3>
                        <p>Tus productos estarán visibles para miles de usuarios activos diariamente.</p>
                    </div>
                    <div className="benefit-card">
                        <h3>💳 Pagos Seguros</h3>
                        <p>Recibe tu dinero de forma segura a través de múltiples medios de pago.</p>
                    </div>
                    <div className="benefit-card">
                        <h3>📦 Envíos Fáciles</h3>
                        <p>Gestionamos la logística para que solo te preocupes por vender.</p>
                    </div>
                    <div className="benefit-card">
                        <h3>🤝 Soporte 24/7</h3>
                        <p>Un equipo dedicado para ayudarte en cada paso de tu camino emprendedor.</p>
                    </div>
                </div>
            </section>

            <section className="vender-steps container">
                <h2>Cómo empezar</h2>
                <ol className="steps-list">
                    <li>
                        <span className="step-num">1</span>
                        <div className="step-info">
                            <h4>Crea tu cuenta</h4>
                            <p>Regístrate gratis y configura tu perfil de vendedor.</p>
                        </div>
                    </li>
                    <li>
                        <span className="step-num">2</span>
                        <div className="step-info">
                            <h4>Publica tus productos</h4>
                            <p>Sube fotos, descripción y precio. ¡Es muy fácil!</p>
                        </div>
                    </li>
                    <li>
                        <span className="step-num">3</span>
                        <div className="step-info">
                            <h4>¡Empieza a vender!</h4>
                            <p>Gestiona tus ventas y responde preguntas desde tu panel.</p>
                        </div>
                    </li>
                </ol>
            </section>
        </main>
    );
};

export default Vender;
