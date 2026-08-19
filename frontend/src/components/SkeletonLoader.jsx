import React from 'react';

export const ProductSkeleton = ({ count = 4 }) => {
    return (
        <div className="skeleton-grid">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="skeleton-card">
                    <div className="skeleton-image shimmer" />
                    <div className="skeleton-content">
                        <div className="skeleton-line shimmer title" />
                        <div className="skeleton-line shimmer subtitle" />
                        <div className="skeleton-line shimmer price" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export const BannerSkeleton = () => {
    return (
        <div className="skeleton-banner shimmer" />
    );
};
