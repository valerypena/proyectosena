import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/api';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser utilizado dentro de un CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { success, error } = useToast();

    // Cargar carrito desde el backend
    const fetchCart = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setItems([]);
            return;
        }

        try {
            setLoading(true);
            const data = await apiFetch('/compras/carrito');
            setItems(data || []);
        } catch (err) {
            console.error('Error cargando carrito:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();

        // Escuchar eventos de sesión
        const handleAuthChange = () => fetchCart();
        window.addEventListener('auth-logout', handleAuthChange);
        window.addEventListener('storage', handleAuthChange);

        return () => {
            window.removeEventListener('auth-logout', handleAuthChange);
            window.removeEventListener('storage', handleAuthChange);
        };
    }, [fetchCart]);

    // Agregar producto al carrito
    const addToCart = async (productoId, cantidad = 1) => {
        const token = localStorage.getItem('token');
        if (!token) {
            error('Debes iniciar sesión para agregar productos al carrito');
            return false;
        }

        try {
            await apiFetch('/compras/carrito', {
                method: 'POST',
                body: JSON.stringify({ producto_id: productoId, cantidad }),
            });
            await fetchCart();
            success('¡Producto agregado al carrito!');
            return true;
        } catch (err) {
            error(err.message || 'No se pudo agregar el producto');
            return false;
        }
    };

    // Eliminar producto del carrito
    const removeFromCart = async (itemId) => {
        try {
            await apiFetch(`/compras/carrito/${itemId}`, { method: 'DELETE' });
            setItems((prev) => prev.filter((item) => item.id !== itemId));
            success('Producto eliminado del carrito');
        } catch (err) {
            error(err.message || 'Error al eliminar producto');
        }
    };

    // Vaciar carrito
    const clearCart = async () => {
        try {
            await apiFetch('/compras/carrito', { method: 'DELETE' });
            setItems([]);
        } catch (err) {
            console.error('Error al vaciar carrito:', err);
        }
    };

    const totalItems = items.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    const subtotal = items.reduce((acc, item) => {
        const precio = item.producto?.precio || 0;
        return acc + (precio * (item.cantidad || 0));
    }, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                loading,
                totalItems,
                subtotal,
                addToCart,
                removeFromCart,
                clearCart,
                refreshCart: fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
