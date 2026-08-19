import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import './BannerSlider.css';

const BannerSlider = () => {
    const [slides, setSlides] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Gradients for banners to make them look distinct
    const gradients = [
        'linear-gradient(90deg, #333 0%, #000 100%)',
        'linear-gradient(90deg, #e91e63 0%, #9c27b0 100%)', // Pink/Purple
        'linear-gradient(90deg, #2196f3 0%, #3f51b5 100%)', // Blue
        'linear-gradient(90deg, #4caf50 0%, #009688 100%)', // Green
        'linear-gradient(90deg, #ff9800 0%, #ff5722 100%)', // Orange
        'linear-gradient(90deg, #607d8b 0%, #37474f 100%)'  // Grey/Blue
    ];

    useEffect(() => {
        // Fetch categories to generate dynamic offer banners
        apiFetch('/categorias')
            .then(data => {
                if (data && data.length > 0) {
                    // Start with a generic "Main Offer" slide
                    const newSlides = [
                        {
                            id: 'main',
                            title: 'OFERTAS DEL DÍA',
                            subtitle: 'Hasta 40% OFF en seleccionados',
                            link: '/ofertas',
                            gradient: gradients[0]
                        }
                    ];

                    // Select 5 random categories
                    const shuffled = [...data].sort(() => 0.5 - Math.random());
                    const selected = shuffled.slice(0, 5);

                    selected.forEach((cat, index) => {
                        newSlides.push({
                            id: cat.id,
                            title: `Ofertas en ${cat.nombre}`,
                            subtitle: 'Ver productos',
                            link: `/items?category=${cat.id}`,
                            gradient: gradients[(index + 1) % gradients.length]
                        });
                    });

                    setSlides(newSlides);
                }
            })
            .catch(err => console.error("Error fetching categories for banner:", err));
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [slides]);

    if (slides.length === 0) return <div className="banner-placeholder">Cargando ofertas...</div>;

    return (
        <section className="banner-slider">
            <div className="slider-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className="slide"
                        style={{ background: slide.gradient }}
                    >
                        <div className="slide-content">
                            <h2>{slide.title}</h2>
                            <p>{slide.subtitle}</p>
                            <Link to={slide.link} className="slide-btn">Ver más</Link>
                        </div>
                    </div>
                ))}
            </div>

            <div className="slider-controls">
                <button
                    className="control-btn prev"
                    onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
                >
                    &#10094;
                </button>
                <button
                    className="control-btn next"
                    onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
                >
                    &#10095;
                </button>
            </div>

            <div className="slider-dots">
                {slides.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${currentSlide === index ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    ></span>
                ))}
            </div>
        </section>
    );
};

export default BannerSlider;
