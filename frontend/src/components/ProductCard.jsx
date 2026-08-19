import React from 'react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './ImageWithFallback';
import { formatPrice } from '../utils/currency';
import { Star, CheckCircle, Zap } from 'lucide-react';
import './ProductCard.css';

export const ProductCard = ({ product }) => {
    if (!product) return null;

    // Calcular datos de oferta realistas y consistentes basados en el ID
    const discount = ((product.id * 7) % 45) + 15; // 15% a 59% OFF
    const hasDiscount = product.id % 2 === 0 || product.id % 3 === 0;
    const originalPrice = hasDiscount ? product.precio * (1 + discount / 100) : null;
    const rating = (4.2 + ((product.id % 8) / 10)).toFixed(1);
    const salesCount = (product.id * 23 + 80);
    const installments = product.precio > 100000 ? 6 : 3;
    const installmentValue = product.precio / installments;

    const isBestSeller = product.id % 3 === 0;
    const isDealOfTheDay = product.id % 5 === 0 && !isBestSeller;

    return (
        <Link to={`/items/${product.id}`} className="ml-product-card">
            {/* Badge Superior */}
            <div className="ml-badge-container">
                {isBestSeller && (
                    <span className="ml-top-badge ml-badge-bestseller">MÁS VENDIDO</span>
                )}
                {isDealOfTheDay && (
                    <span className="ml-top-badge ml-badge-dealoftheday">OFERTA DEL DÍA</span>
                )}
            </div>

            {/* Contenedor de Imagen */}
            <div className="ml-image-wrapper">
                <ImageWithFallback
                    src={product.url_imagen}
                    alt={product.nombre}
                    className="ml-product-image"
                />
            </div>

            {/* Información del Producto */}
            <div className="ml-card-info">
                {/* Título */}
                <h3 className="ml-product-title" title={product.nombre}>
                    {product.nombre}
                </h3>

                {/* Rating y Ventas */}
                <div className="ml-rating-row">
                    <span className="ml-star-icon">★</span>
                    <span className="ml-rating-number">{rating}</span>
                    <span className="ml-sales-count">| +{salesCount} vendidos</span>
                </div>

                {/* Marca Verificada */}
                <div className="ml-brand-row">
                    <span className="ml-brand-name">Tienda Oficial</span>
                    <CheckCircle size={12} className="ml-verified-icon" />
                </div>

                {/* Precios */}
                <div className="ml-price-block">
                    {hasDiscount && originalPrice && (
                        <span className="ml-original-price">{formatPrice(originalPrice)}</span>
                    )}
                    <div className="ml-main-price-row">
                        <span className="ml-current-price">{formatPrice(product.precio)}</span>
                        {hasDiscount && (
                            <span className="ml-discount-badge">{discount}% OFF</span>
                        )}
                    </div>
                </div>

                {/* Cuotas sin interés */}
                <p className="ml-installments-text">
                    {installments} cuotas de <strong>{formatPrice(installmentValue)}</strong> con 0% interés
                </p>

                {/* Cupón opcional */}
                {product.id % 2 === 0 && (
                    <div className="ml-coupon-badge">
                        <span>15% OFF DAVIbank</span>
                    </div>
                )}

                {/* Envío Full */}
                <div className="ml-shipping-row">
                    <span className="ml-shipping-text">Llega gratis mañana</span>
                    <span className="ml-full-icon-badge">
                        <Zap size={12} fill="#00a650" color="#00a650" /> FULL
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
