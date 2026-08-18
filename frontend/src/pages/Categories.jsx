import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Categories.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/categorias')
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="container" style={{ padding: '50px' }}>Cargando categorías...</div>;

    return (
        <main className="categories-page-container">
            <div className="container">
                <h1 className="categories-title">Categorías</h1>

                <div className="categories-grid">
                    {categories.map(cat => (
                        <Link to={`/items?category=${cat.id}`} key={cat.id} className="category-card">
                            <div className="category-icon-placeholder">
                                {cat.nombre.charAt(0)}
                            </div>
                            <h3 className="category-name">{cat.nombre}</h3>
                            <span className="category-arrow">Ver productos &rsaquo;</span>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Categories;
