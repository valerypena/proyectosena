import React, { useState } from 'react';

const DEFAULT_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'><rect width='100%25' height='100%25' fill='%23f1f5f9'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%2394a3b8'>Sin Imagen</text></svg>";

export const ImageWithFallback = ({ src, alt, className = '', fallbackSrc = DEFAULT_PLACEHOLDER, ...props }) => {
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt || 'Imagen de producto'}
            className={`${className} ${hasError ? 'image-fallback' : ''}`}
            onError={handleError}
            loading="lazy"
            {...props}
        />
    );
};

export default ImageWithFallback;
