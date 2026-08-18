import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Mail, Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-top container">
                <div className="footer-col">
                    <div className="footer-logo">
                        <img src="/logo.png" alt="Market" className="footer-logo-img" />
                    </div>
                    <p className="footer-desc">
                        La plataforma de marketplace líder para la comunidad. Encuentra todo lo que necesitas con la mejor calidad y precios.
                    </p>
                    <div className="footer-socials">
                        <Facebook size={20} />
                        <Instagram size={20} />
                        <Twitter size={20} />
                        <Youtube size={20} />
                    </div>
                </div>

                <div className="footer-col">
                    <h3>Enlaces rápidos</h3>
                    <ul>
                        <li><Link to="/acerca-de">Acerca de nosotros</Link></li>
                        <li><Link to="/como-funciona">Cómo funciona</Link></li>
                        <li><Link to="/vender">Vender en market.com</Link></li>
                        <li><Link to="/afiliados">Programa de afiliados</Link></li>
                        <li><Link to="/ofertas">Ofertas especiales</Link></li>
                        <li><Link to="/ayuda">Centro de ayuda</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h3>Atención al cliente</h3>
                    <div className="contact-item">
                        <Phone size={16} style={{ marginRight: '8px' }} />
                        <span>+57 1 234 5678</span>
                    </div>
                    <div className="contact-item">
                        <Mail size={16} style={{ marginRight: '8px' }} />
                        <span>soporte@soporte.co</span>
                    </div>
                    <div className="contact-item">
                        <MapPin size={16} style={{ marginRight: '8px' }} />
                        <span>Bogotá, Colombia</span>
                    </div>

                    <h4 style={{ marginTop: '16px', fontSize: '14px', color: '#fff' }}>Horarios de atención</h4>
                    <p style={{ fontSize: '13px', color: '#ccc', margin: '4px 0' }}>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                    <p style={{ fontSize: '13px', color: '#ccc' }}>Sábados: 9:00 AM - 2:00 PM</p>
                </div>

                <div className="footer-col">
                    <h3>Mantente informado</h3>
                    <p style={{ fontSize: '13px', marginBottom: '10px' }}>Suscríbete para recibir novedades.</p>
                    <div className="footer-subscribe">
                        <input type="email" placeholder="Tu email" />
                        <button>→</button>
                    </div>
                </div>
            </div>

            <div className="footer-middle">
                <div className="container footer-feats">
                    <div className="feat-item">
                        <span className="feat-title">Envío gratis</span>
                        <span className="feat-desc">En compras mayores a $100.000</span>
                    </div>
                    <div className="feat-item">
                        <span className="feat-title">Compra segura</span>
                        <span className="feat-desc">Protección al comprador</span>
                    </div>
                    <div className="feat-item">
                        <span className="feat-title">Múltiples pagos</span>
                        <span className="feat-desc">Tarjetas, efectivo y más</span>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">

                    <div className="footer-links-bottom">
                        <Link to="/terminos">Términos y condiciones</Link>
                        <Link to="/privacidad" style={{ marginLeft: '15px' }}>Privacidad</Link>
                        <Link to="/accesibilidad" style={{ marginLeft: '15px' }}>Accesibilidad</Link>
                        <Link to="/ayuda" style={{ marginLeft: '15px' }}>Ayuda</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
