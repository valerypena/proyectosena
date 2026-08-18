import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';
import {
    User, Mail, Shield, Users, CreditCard,
    MapPin, Lock, MessageSquare, Edit2, CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user) return <div className="container">Cargando...</div>;

    const cards = [
        {
            icon: <User size={24} />,
            title: "Información personal",
            desc: "Información de tu documento de identidad y ocupación.",
            link: "/perfil/datos-personales"
        },
        {
            icon: <User size={24} />, // Icono simplificado
            title: "Datos de tu cuenta",
            desc: "Datos que representan a la cuenta en Mercado Libre y Mercado Pago.",
            link: "/perfil/datos-cuenta"
        },
        {
            icon: <Lock size={24} />,
            title: "Seguridad",
            desc: "Tienes configurada la seguridad de tu cuenta.",
            check: true,
            link: "/perfil/seguridad"
        },
        {
            icon: <Users size={24} />,
            title: "Colaboradores",
            desc: "Personas que operan con tu cuenta.",
            link: "/perfil/colaboradores"
        },

        {
            icon: <CreditCard size={24} />,
            title: "Tarjetas",
            desc: "Tarjetas guardadas en tu cuenta.",
            link: "/perfil/tarjetas"
        },
        {
            icon: <MapPin size={24} />,
            title: "Direcciones",
            desc: "Direcciones guardadas en tu cuenta.",
            link: "/perfil/direcciones"
        },
        {
            icon: <Shield size={24} />,
            title: "Privacidad",
            desc: "Preferencias y control sobre el uso de tus datos.",
            link: "/perfil/privacidad"
        },
        {
            icon: <MessageSquare size={24} />,
            title: "Comunicaciones",
            desc: "Elige qué tipo de información quieres recibir.",
            link: "/perfil/comunicaciones"
        }
    ];

    return (
        <div className="container profile-hub-container">
            {/* Header Profile */}
            <div className="profile-hub-header">
                <div className="profile-hub-avatar-container">
                    <div className="profile-hub-avatar">
                        {user.nombre_completo.charAt(0).toUpperCase()}
                    </div>
                    <button className="edit-avatar-btn">
                        <Edit2 size={14} color="white" />
                        <span>Editar</span>
                    </button>
                </div>
                <div className="profile-hub-info">
                    <h1>{user.nombre_completo}</h1>
                    <p>{user.email}</p>
                </div>
            </div>

            {/* Grid Cards */}
            <div className="profile-cards-grid">
                {cards.map((card, index) => (
                    <div className="card profile-hub-card" key={index} onClick={() => navigate(card.link)}>
                        <div className="card-top">
                            <div className="card-icon-circle">{card.icon}</div>
                            {card.check && <CheckCircle size={18} color="#00a650" className="check-icon" />}
                        </div>
                        <h3>{card.title}</h3>
                        <p>{card.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
