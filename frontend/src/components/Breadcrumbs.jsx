import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs = ({ category }) => {
    const navigate = useNavigate();

    return (
        <div className="breadcrumbs-container">
            <button className="back-link" onClick={() => navigate(-1)}>Volver</button>
            <span className="separator">|</span>
            <div className="breadcrumb-links">
                <Link to="/">Inicio</Link>
                <span className="arrow">{'>'}</span>
                {category && (
                    <>
                        <Link to={`/categorias?nombre=${category}`}>{category}</Link>
                        <span className="arrow">{'>'}</span>
                    </>
                )}
            </div>
        </div>
    );
};

export default Breadcrumbs;
