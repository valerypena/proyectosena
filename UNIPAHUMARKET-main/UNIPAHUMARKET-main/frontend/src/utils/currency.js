export const formatPrice = (value) => {
    if (value === undefined || value === null) return '$ 0';
    return '$ ' + parseInt(value).toLocaleString('es-CO');
};
