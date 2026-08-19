import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/currency';
import { apiFetch } from '../utils/api';
import { ImageWithFallback } from '../components/ImageWithFallback';
import Breadcrumbs from '../components/Breadcrumbs';
import { Star, MessageCircle, Send } from 'lucide-react';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [question, setQuestion] = useState('');
    const [asking, setAsking] = useState(false);
    const { token, user } = useContext(AuthContext);
    const { addToCart } = useCart();
    const { success, error } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = () => {
        apiFetch(`/productos/${id}`)
            .then(data => setProduct(data))
            .catch(err => {
                console.error(err);
                error('Error al cargar detalles del producto');
            });
    };

    const performAddToCart = async (redirect = false) => {
        if (!token) { 
            navigate('/login'); 
            return; 
        }
        const added = await addToCart(product.id, 1);
        if (added && redirect) {
            navigate('/cart');
        }
    };

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        if (!token) { 
            navigate('/login'); 
            return; 
        }
        if (!question.trim()) return;

        try {
            setAsking(true);
            await apiFetch(`/preguntas/${id}`, {
                method: 'POST',
                body: JSON.stringify({ pregunta: question.trim() })
            });
            setQuestion('');
            fetchProduct();
            success('¡Pregunta enviada al vendedor!');
        } catch (err) { 
            error(err.message || 'Error al enviar pregunta');
        } finally {
            setAsking(false);
        }
    };

    if (!product) return <div className="loading">Cargando...</div>;

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill={i < Math.round(rating) ? "#3483fa" : "none"} stroke={i < Math.round(rating) ? "#3483fa" : "#ccc"} />
        ));
    };

    return (
        <div className="container product-detail-container">
            <Breadcrumbs category={product.nombre_categoria || (product.categoria ? product.categoria.nombre : "Producto")} />

            <div className="card detail-card">
                <div className="detail-image">
                    <ImageWithFallback src={product.url_imagen} alt={product.nombre} />
                </div>
                <div className="detail-info">
                    <span className="detail-condition">Nuevo | +100 vendidos</span>
                    <h1 className="detail-title">{product.nombre}</h1>

                    <div className="rating-summary">
                        {renderStars(product.promedio_calificacion || 0)}
                        <span className="rating-count">({product.resenas?.length || 0} opiniones)</span>
                    </div>

                    <div className="detail-price-box">
                        <span className="detail-price">{formatPrice(product.precio)}</span>
                    </div>

                    <div className="detail-shipping">
                        <span className="green-text">Envío gratis</span> a todo el país
                    </div>

                    <div className="detail-actions">
                        <button className="btn-primary buy-now-btn" onClick={() => performAddToCart(true)}>Comprar ahora</button>
                        <button className="btn-secondary add-cart-btn" onClick={() => performAddToCart(false)}>Agregar al carrito</button>
                    </div>
                </div>
            </div>

            <div className="card description-card">
                <h2>Descripción</h2>
                <p>{product.descripcion}</p>
            </div>

            {/* Opiniones */}
            <div className="card reviews-card">
                <h2>Opiniones sobre el producto</h2>
                <div className="reviews-list">
                    {product.resenas?.length > 0 ? (
                        product.resenas.map(r => (
                            <div key={r.id} className="review-item">
                                <div className="review-stars">{renderStars(r.calificacion)}</div>
                                <p className="review-comment">{r.comentario}</p>
                                <span className="review-user">Por {r.usuario.nombre_completo}</span>
                            </div>
                        ))
                    ) : (
                        <p className="empty-text">Aún no hay opiniones de este producto.</p>
                    )}
                </div>
            </div>

            {/* Preguntas */}
            <div className="card questions-card">
                <h2>Preguntas y respuestas</h2>

                <form className="ask-form" onSubmit={handleAskQuestion}>
                    <input
                        type="text"
                        placeholder="Escribe tu pregunta..."
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                    />
                    <button type="submit" className="btn-primary">Preguntar</button>
                </form>

                <div className="questions-list">
                    <h3>Últimas preguntas</h3>
                    {product.preguntas?.length > 0 ? (
                        product.preguntas.map(q => (
                            <div key={q.id} className="question-item">
                                <div className="q-row">
                                    <MessageCircle size={18} color="#666" />
                                    <p className="q-text">{q.pregunta}</p>
                                </div>
                                {q.respuesta && (
                                    <div className="a-row">
                                        <div className="a-line"></div>
                                        <p className="a-text">{q.respuesta} <span className="a-date">{new Date(q.respondido_en).toLocaleDateString()}</span></p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="empty-text">Nadie ha hecho preguntas todavía. ¡Sé el primero!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
