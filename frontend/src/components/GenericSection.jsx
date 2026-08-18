import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GenericSection.css';

const GenericSection = ({ title, icon, emptyMsg, actionLabel, actionLink }) => {
    const navigate = useNavigate();

    return (
        <div className="container generic-section-container">
            <div className="card generic-card">
                <div className="generic-icon-area">
                    {icon || <span style={{ fontSize: '48px' }}>🔍</span>}
                </div>
                <h2>{title}</h2>
                <p className="generic-msg">{emptyMsg || `No hay información disponible en ${title} por el momento.`}</p>

                {actionLabel && (
                    <button className="btn-primary" onClick={() => navigate(actionLink || '/')}>
                        {actionLabel}
                    </button>
                )}
            </div>
        </div>
    );
};

export default GenericSection;
