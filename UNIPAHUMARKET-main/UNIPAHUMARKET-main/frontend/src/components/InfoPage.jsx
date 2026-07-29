import React from 'react';

const InfoPage = ({ title, content }) => {
    return (
        <div className="container" style={{ padding: '60px 20px', minHeight: '60vh' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#333' }}>{title}</h1>
            <div
                style={{ lineHeight: '1.6', color: '#555', fontSize: '16px' }}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
};

export default InfoPage;
