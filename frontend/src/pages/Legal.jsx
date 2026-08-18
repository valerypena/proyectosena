import React from 'react';
import './Legal.css';

export const Terms = () => {
    return (
        <div className="legal-container container">
            <div className="legal-card card">
                <h1>Términos y condiciones de uso</h1>
                <p className="last-updated">Última actualización: 30 de enero de 2026</p>

                <section>
                    <h2>1. Aceptación de los términos</h2>
                    <p>Al acceder y utilizar los servicios de Unimarket, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.</p>
                </section>

                <section>
                    <h2>2. Capacidad</h2>
                    <p>Los Servicios sólo están disponibles para personas que tengan capacidad legal para contratar. No podrán utilizar los servicios las personas que no tengan esa capacidad, los menores de edad o Usuarios de Unimarket que hayan sido suspendidos temporalmente o inhabilitados definitivamente.</p>
                </section>

                <section>
                    <h2>3. Inscripción</h2>
                    <p>Es obligatorio completar el formulario de inscripción en todos sus campos con datos válidos para poder utilizar los servicios que brinda Unimarket. El futuro Usuario deberá completarlo con su información personal de manera exacta, precisa y verdadera.</p>
                </section>

                <section>
                    <h2>4. Privacidad de la información</h2>
                    <p>Para utilizar los Servicios ofrecidos por Unimarket, los Usuarios deberán facilitar determinados datos de carácter personal. Su información personal se procesa y almacena en servidores o medios magnéticos que mantienen altos estándares de seguridad y protección tanto física como tecnológica.</p>
                </section>
            </div>
        </div>
    );
};

export const Privacy = () => {
    return (
        <div className="legal-container container">
            <div className="legal-card card">
                <h1>Declaración de Privacidad</h1>

                <section>
                    <h2>Nuestro compromiso</h2>
                    <p>En Unimarket, entendemos que tu privacidad es importante. Esta Declaración de Privacidad explica cómo recopilamos, utilizamos, compartimos y protegemos tu información personal.</p>
                </section>

                <section>
                    <h2>¿Qué información recolectamos?</h2>
                    <ul>
                        <li>Información que nos proporcionas directamente (nombre, email, dirección).</li>
                        <li>Información sobre tus transacciones y compras.</li>
                        <li>Información técnica sobre tu dispositivo y conexión.</li>
                    </ul>
                </section>

                <section>
                    <h2>Uso de la información</h2>
                    <p>Utilizamos tu información para:</p>
                    <ul>
                        <li>Procesar tus pedidos y pagos.</li>
                        <li>Mejorar nuestros servicios y personalizar tu experiencia.</li>
                        <li>Detectar y prevenir fraudes.</li>
                        <li>Enviarte notificaciones sobre el estado de tus compras.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export const Accessibility = () => {
    return (
        <div className="legal-container container">
            <div className="legal-card card">
                <h1>Accesibilidad</h1>

                <section>
                    <h2>Declaración de accesibilidad</h2>
                    <p>Unimarket se compromete a garantizar la accesibilidad digital para personas con discapacidad. Estamos mejorando continuamente la experiencia de usuario para todos y aplicando los estándares de accesibilidad pertinentes.</p>
                </section>

                <section>
                    <h2>Medidas de apoyo a la accesibilidad</h2>
                    <p>Unimarket toma las siguientes medidas para garantizar la accesibilidad de nuestro sitio web:</p>
                    <ul>
                        <li>Incluir la accesibilidad como parte de nuestra declaración de misión interna.</li>
                        <li>Integrar la accesibilidad en nuestras prácticas de adquisición.</li>
                        <li>Nombrar un responsable de accesibilidad y/o un defensor del pueblo.</li>
                        <li>Proporcionar formación continua sobre accesibilidad a nuestro personal.</li>
                    </ul>
                </section>

                <section>
                    <h2>Estado de conformidad</h2>
                    <p>Las Pautas de Accesibilidad al Contenido en la Web (WCAG) definen los requisitos para que los diseñadores y desarrolladores mejoren la accesibilidad para las personas con discapacidad. Unimarket se esfuerza por cumplir con el nivel AA de las WCAG 2.1.</p>
                </section>
            </div>
        </div>
    );
};
