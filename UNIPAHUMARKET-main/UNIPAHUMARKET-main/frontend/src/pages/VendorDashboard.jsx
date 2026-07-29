import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import { Plus, Edit, Trash2, Package, DollarSign, TrendingUp, X, MessageSquare, ShoppingBag } from 'lucide-react';
import './VendorDashboard.css';

const VendorDashboard = () => {
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('products'); // 'products', 'sales', 'questions'

    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '', descripcion: '', precio: '', cantidad_stock: '', url_imagen: '', categoria_id: ''
    });

    const [empId, setEmpId] = useState(null);

    useEffect(() => {
        if (!token) return;

        fetch('http://127.0.0.1:8000/vendedor/mis-emprendimientos', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    setEmpId(data[0].id);
                    fetchData(data[0].id);
                } else {
                    setLoading(false);
                }
            });

        fetch('http://127.0.0.1:8000/categorias')
            .then(res => res.json())
            .then(data => setCategories(data));

    }, [token]);

    const fetchData = async (id) => {
        setLoading(true);
        try {
            // Productos del Vendedor (Endpoint específico para mi emprendimiento)
            const resProd = await fetch(`http://127.0.0.1:8000/productos?limit=1000&emprendimiento_id=${id}`);
            const myProd = await resProd.json();
            setProducts(myProd);

            // Ventas
            const resSales = await fetch(`http://127.0.0.1:8000/compras/vendedor/mis-ventas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const salesData = await resSales.json();
            setSales(salesData);

            // Preguntas Pendientes
            const resQ = await fetch(`http://127.0.0.1:8000/preguntas/vendedor/pendientes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const qData = await resQ.json();
            setQuestions(qData);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const url = editingProduct
            ? `http://127.0.0.1:8000/vendedor/productos/${editingProduct.id}`
            : `http://127.0.0.1:8000/vendedor/productos?emprendimiento_id=${empId}`;

        const method = editingProduct ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowModal(false);
                setEditingProduct(null);
                setFormData({ nombre: '', descripcion: '', precio: '', cantidad_stock: '', url_imagen: '', categoria_id: '' });
                fetchData(empId);
            }
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este producto?')) return;
        try {
            const res = await fetch(`http://127.0.0.1:8000/vendedor/productos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchData(empId);
        } catch (err) { console.error(err); }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/compras/vendedor/ordenes/${orderId}/estado?nuevo_estado=${newStatus}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchData(empId);
        } catch (err) { console.error(err); }
    };

    const handleAnswerQuestion = async (qId, answer) => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/preguntas/responder/${qId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ respuesta: answer })
            });
            if (res.ok) fetchData(empId);
        } catch (err) { console.error(err); }
    };

    const openEdit = (p) => {
        setEditingProduct(p);
        setFormData({
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            cantidad_stock: p.cantidad_stock,
            url_imagen: p.url_imagen || '',
            categoria_id: p.categoria_id || ''
        });
        setShowModal(true);
    };

    const handleCreateBrand = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/vendedor/emprendimientos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre_marca: `Tienda de ${user?.nombre_completo || 'Mi Marca'}`,
                    descripcion: 'Bienvenido a mi nueva tienda.'
                })
            });
            if (res.ok) {
                const data = await res.json();
                setEmpId(data.id);
                fetchData(data.id);
            }
        } catch (err) {
            console.error(err);
            alert('Error al crear la marca');
        }
    };

    const totalRevenue = sales.reduce((acc, sale) => acc + Number(sale.monto_total), 0);

    if (!empId && !loading) return (
        <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
            <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
                <Package size={48} color="#3483fa" style={{ marginBottom: '20px' }} />
                <h2>¡Hola {user?.nombre_completo}!</h2>
                <p style={{ margin: '15px 0 25px', color: '#666' }}>
                    Parece que tu cuenta de vendedor está activa, pero aún no has configurado tu marca o tienda oficial.
                </p>
                <button className="btn-primary" onClick={handleCreateBrand} style={{ width: '100%' }}>
                    Activar mi marca ahora
                </button>
                <p style={{ marginTop: '20px', fontSize: '12px' }}>
                    O ve a la <Link to="/vender">página de información</Link>
                </p>
            </div>
        </div>
    );

    return (
        <div className="container vendor-dashboard-container">
            <div className="vendor-header">
                <div>
                    <h2>Panel de Vendedor</h2>
                    <p className="sub-text">Gestiona tus productos y ventas desde un solo lugar.</p>
                </div>
                {activeTab === 'products' && (
                    <button className="btn-primary" onClick={() => { setEditingProduct(null); setShowModal(true); }}>
                        <Plus size={18} style={{ marginRight: '8px' }} /> Publicar producto
                    </button>
                )}
            </div>

            <div className="stats-grid">
                <div className="stat-card" onClick={() => setActiveTab('products')} style={{ cursor: 'pointer', border: activeTab === 'products' ? '2px solid #3483fa' : 'none' }}>
                    <div className="stat-value">{products.length}</div>
                    <div className="stat-label">Productos activos</div>
                </div>
                <div className="stat-card" onClick={() => setActiveTab('sales')} style={{ cursor: 'pointer', border: activeTab === 'sales' ? '2px solid #3483fa' : 'none' }}>
                    <div className="stat-value">{sales.length}</div>
                    <div className="stat-label">Ventas totales</div>
                </div>
                <div className="stat-card" onClick={() => setActiveTab('questions')} style={{ cursor: 'pointer', position: 'relative', border: activeTab === 'questions' ? '2px solid #3483fa' : 'none' }}>
                    <div className="stat-value">{questions.length}</div>
                    <div className="stat-label">Preguntas pendientes</div>
                    {questions.length > 0 && <span className="badge-notification">{questions.length}</span>}
                </div>
                <div className="stat-card">
                    <div className="stat-value">{formatPrice(totalRevenue)}</div>
                    <div className="stat-label">Ganancia total</div>
                </div>
            </div>

            <div className="vendor-main-content">
                {activeTab === 'products' && (
                    <>
                        <h3>Mis Productos</h3>
                        <table className="vendor-products-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id}>
                                        <td>
                                            <div className="prod-cell">
                                                <img src={p.url_imagen || "https://via.placeholder.com/50"} alt="" className="prod-thumb" />
                                                <span className="prod-name">{p.nombre}</span>
                                            </div>
                                        </td>
                                        <td>{formatPrice(p.precio)}</td>
                                        <td>
                                            <span className={`stock-badge ${p.cantidad_stock < 5 ? 'stock-low' : 'stock-ok'}`}>
                                                {p.cantidad_stock} unid.
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions-cell">
                                                <button className="btn-edit" onClick={() => openEdit(p)}><Edit size={18} /></button>
                                                <button className="btn-delete" onClick={() => handleDelete(p.id)}><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {activeTab === 'sales' && (
                    <>
                        <h3>Ventas Recibidas</h3>
                        <table className="vendor-products-table">
                            <thead>
                                <tr>
                                    <th>Orden #</th>
                                    <th>Fecha</th>
                                    <th>Monto</th>
                                    <th>Estado</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map(s => (
                                    <tr key={s.id}>
                                        <td><span style={{ fontWeight: 'bold' }}>#{s.id}</span></td>
                                        <td>{new Date(s.creado_en).toLocaleDateString()}</td>
                                        <td>{formatPrice(s.monto_total)}</td>
                                        <td>
                                            <span className={`status-badge status-${s.estado.toLowerCase()}`}>
                                                {s.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                value={s.estado}
                                                onChange={(e) => handleUpdateStatus(s.id, e.target.value)}
                                                className="status-selector"
                                            >
                                                <option value="PENDIENTE">PENDIENTE</option>
                                                <option value="PAGADO">PAGADO</option>
                                                <option value="ENVIADO">ENVIADO</option>
                                                <option value="ENTREGADO">ENTREGADO</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                {sales.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No has recibido ventas aún.</td></tr>}
                            </tbody>
                        </table>
                    </>
                )}

                {activeTab === 'questions' && (
                    <>
                        <h3>Preguntas por Responder</h3>
                        <div className="questions-list-vendor">
                            {questions.map(q => (
                                <div key={q.id} className="question-card-vendor card">
                                    <div className="q-header">
                                        <strong>{q.usuario.nombre_completo}</strong> sobre <i>{products.find(p => p.id === q.producto_id)?.nombre}</i>
                                    </div>
                                    <p className="q-text">{q.pregunta}</p>
                                    <div className="q-reply-form">
                                        <input
                                            type="text"
                                            placeholder="Escribe tu respuesta..."
                                            id={`reply-${q.id}`}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') handleAnswerQuestion(q.id, e.target.value);
                                            }}
                                        />
                                        <button className="btn-primary" onClick={() => {
                                            const val = document.getElementById(`reply-${q.id}`).value;
                                            handleAnswerQuestion(q.id, val);
                                        }}>Responder</button>
                                    </div>
                                </div>
                            ))}
                            {questions.length === 0 && <div className="card" style={{ padding: '40px', textAlign: 'center' }}>¡Al día! No tienes preguntas pendientes.</div>}
                        </div>
                    </>
                )}
            </div>

            {/* Modal de Producto */}
            {showModal && (
                <div className="overlay">
                    <div className="form-modal animated-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                        </div>
                        <form onSubmit={handleSave}>
                            {/* ... (Form content is same as before) ... */}
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Nombre del producto</label>
                                <input type="text" required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Descripción</label>
                                <textarea required value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', height: '100px' }} />
                            </div>
                            <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label>Precio</label>
                                    <input type="number" required value={formData.precio} onChange={e => setFormData({ ...formData, precio: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>Stock</label>
                                    <input type="number" required value={formData.cantidad_stock} onChange={e => setFormData({ ...formData, cantidad_stock: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Categoría</label>
                                <select required value={formData.categoria_id} onChange={e => setFormData({ ...formData, categoria_id: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                                    <option value="">Selecciona una categoría</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: '25px' }}>
                                <label>URL de Imagen</label>
                                <input type="text" value={formData.url_imagen} onChange={e => setFormData({ ...formData, url_imagen: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} placeholder="http://..." />
                            </div>
                            <div className="form-actions" style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn-primary" style={{ padding: '10px 30px' }}>
                                    {editingProduct ? 'Guardar cambios' : 'Publicar producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorDashboard;
