import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast debe ser utilizado dentro de un ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 3500) => {
        const id = Date.now() + Math.random().toString(36).substring(2, 9);
        const newToast = { id, message, type };

        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    const success = (msg, duration) => addToast(msg, 'success', duration);
    const error = (msg, duration) => addToast(msg, 'error', duration);
    const info = (msg, duration) => addToast(msg, 'info', duration);
    const warning = (msg, duration) => addToast(msg, 'warning', duration);

    return (
        <ToastContext.Provider value={{ addToast, success, error, info, warning, removeToast }}>
            {children}
            {/* Contenedor de Notificaciones Flotantes */}
            <div className="toast-container" aria-live="polite">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`toast-item toast-${toast.type}`}
                        role="alert"
                        onClick={() => removeToast(toast.id)}
                    >
                        <span className="toast-icon">
                            {toast.type === 'success' && '✓'}
                            {toast.type === 'error' && '✕'}
                            {toast.type === 'warning' && '⚠'}
                            {toast.type === 'info' && 'ℹ'}
                        </span>
                        <span className="toast-message">{toast.message}</span>
                        <button className="toast-close" onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}>
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
