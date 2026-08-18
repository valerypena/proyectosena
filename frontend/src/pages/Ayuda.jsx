import React, { useState } from 'react';
import './Ayuda.css';

const Ayuda = () => {
    const [faqOpen, setFaqOpen] = useState(null);

    const toggleFaq = (index) => {
        setFaqOpen(faqOpen === index ? null : index);
    };

    const faqs = [
        { q: "¿Cómo compro en Unimarket?", a: "Para comprar, simplemente busca el producto que deseas, agrégalo al carrito y sigue el proceso de pago seguro." },
        { q: "¿Cuáles son los medios de pago?", a: "Aceptamos tarjetas de crédito, débito y transferencias bancarias a través de nuestra plataforma segura." },
        { q: "¿Es seguro comprar aquí?", a: "Sí, protegemos tus datos y tu dinero hasta que recibes tu compra satisfactoriamente." },
        { q: "¿Cómo vendo mis productos?", a: "Regístrate como usuario, y luego activa tu perfil de vendedor en la sección 'Vender' para comenzar a publicar." },
        { q: "¿Puedo devolver un producto?", a: "Sí, tienes hasta 30 días para devolver productos si no cumplen con lo prometido, dependiendo de la política del vendedor." }
    ];

    return (
        <main className="ayuda-container">
            <header className="ayuda-header">
                <div className="container">
                    <h1>Centro de Ayuda</h1>
                    <div className="ayuda-search">
                        <input type="text" placeholder="Busca una solución..." />
                        <button>Buscar</button>
                    </div>
                </div>
            </header>

            <section className="ayuda-topics container">
                <h2>Temas frecuentes</h2>
                <div className="topics-grid">
                    <div className="topic-card">
                        <h3>📦 Compras</h3>
                        <p>Seguimiento, devoluciones y cancelaciones.</p>
                    </div>
                    <div className="topic-card">
                        <h3>🏷️ Ventas</h3>
                        <p>Cómo vender, tarifas y facturación.</p>
                    </div>
                    <div className="topic-card">
                        <h3>👤 Cuenta</h3>
                        <p>Seguridad, datos personales y claves.</p>
                    </div>
                </div>
            </section>

            <section className="ayuda-faq container">
                <h2>Preguntas Frecuentes</h2>
                <div className="faq-list">
                    {faqs.map((item, index) => (
                        <div className={`faq-item ${faqOpen === index ? 'open' : ''}`} key={index} onClick={() => toggleFaq(index)}>
                            <div className="faq-question">
                                <span>{item.q}</span>
                                <span className="faq-icon">{faqOpen === index ? '-' : '+'}</span>
                            </div>
                            {faqOpen === index && <div className="faq-answer">{item.a}</div>}
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Ayuda;
