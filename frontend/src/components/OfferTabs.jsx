import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Percent, Zap, DollarSign, Smartphone, Laptop, Tag, ChevronRight } from 'lucide-react';
import './OfferTabs.css';

export const OfferTabs = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get('tab') || 'all';

    const tabs = [
        { id: 'all', label: 'Todas las ofertas', icon: Percent },
        { id: 'flash', label: 'Ofertas relámpago', icon: Zap },
        { id: 'unbeatable', label: 'Precios Imbatibles', icon: DollarSign },
        { id: 'phones', label: 'Celulares', icon: Smartphone },
        { id: 'laptops', label: 'Notebooks', icon: Laptop },
        { id: 'clearance', label: 'Liquidación', icon: Tag },
    ];

    const handleSelectTab = (tabId) => {
        const newParams = new URLSearchParams(searchParams);
        if (tabId === 'all') {
            newParams.delete('tab');
            newParams.delete('promo');
        } else if (tabId === 'flash') {
            newParams.set('tab', 'flash');
            newParams.set('promo', 'flash');
        } else {
            newParams.set('tab', tabId);
            newParams.delete('promo');
        }
        setSearchParams(newParams);
    };

    return (
        <div className="offer-tabs-bar">
            <div className="offer-tabs-container">
                <div className="offer-tabs-title-group">
                    <h1 className="offer-main-title">Ofertas</h1>
                    <p className="offer-main-subtitle">¡Encuentra precios increíbles cada día!</p>
                </div>

                <div className="offer-tabs-list">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = currentTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                className={`offer-tab-item ${isActive ? 'active' : ''}`}
                                onClick={() => handleSelectTab(tab.id)}
                            >
                                <div className="offer-tab-icon-wrapper">
                                    <Icon size={22} className="offer-tab-icon" />
                                </div>
                                <span className="offer-tab-label">{tab.label}</span>
                                {isActive && <div className="offer-tab-active-bar" />}
                            </button>
                        );
                    })}
                </div>

                <button className="offer-tabs-arrow" aria-label="Más categorías de ofertas">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default OfferTabs;
