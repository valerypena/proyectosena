import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Power, 
  Activity, 
  Database, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Cpu, 
  Radio, 
  Zap,
  GitCompare,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

export default function MicroservicesDashboard() {
  const [services, setServices] = useState([
    {
      id: 'product',
      name: 'Product Catalog Service (CRUD)',
      port: 3003,
      enabled: true,
      status: 'UP',
      latency: 14,
      description: 'Gestión CRUD de catálogo de productos, categorías, emprendimientos y reseñas.',
      routes: ['/api/productos', '/api/categorias', '/api/emprendimientos'],
    },
    {
      id: 'order',
      name: 'Order & Purchase Service',
      port: 3004,
      enabled: true,
      status: 'UP',
      latency: 18,
      description: 'Procesamiento transaccional de órdenes de compra y eventos RabbitMQ.',
      routes: ['/api/compras', '/api/orders'],
    },
    {
      id: 'cart',
      name: 'Shopping Cart Service',
      port: 3005,
      enabled: true,
      status: 'UP',
      latency: 8,
      description: 'Gestión en tiempo real de carritos de compras sincronizado con Redis.',
      routes: ['/api/carrito'],
    },
    {
      id: 'auth',
      name: 'Auth Service',
      port: 3001,
      enabled: true,
      status: 'UP',
      latency: 11,
      description: 'Emisión y verificación de tokens JWT, inicio de sesión y registro.',
      routes: ['/api/auth'],
    },
    {
      id: 'user',
      name: 'User & Profile Service',
      port: 3002,
      enabled: true,
      status: 'UP',
      latency: 15,
      description: 'Gestión de perfiles de usuario, direcciones de envío y tarjetas.',
      routes: ['/api/users', '/api/user-details'],
    },
    {
      id: 'notification',
      name: 'Notification Service',
      port: 3006,
      enabled: true,
      status: 'UP',
      latency: 22,
      description: 'Consumidor de eventos RabbitMQ para emails y notificaciones.',
      routes: ['/api/notificaciones'],
    },
    {
      id: 'health',
      name: 'Health & Monitor Service',
      port: 3007,
      enabled: true,
      status: 'UP',
      latency: 5,
      description: 'Agregador de diagnósticos y métricas en tiempo real de bases de datos.',
      routes: ['/health'],
    },
    {
      id: 'sync',
      name: 'Data Sync & Self-Healing Mirroring',
      port: 3008,
      enabled: true,
      status: 'UP',
      latency: 19,
      description: 'Reconciliación espejo bidireccional y Failover automático de base de datos.',
      routes: ['/api/sync'],
    },
    {
      id: 'fastapi_backend',
      name: 'FastAPI Backend Core (Python)',
      port: 8000,
      enabled: true,
      status: 'UP',
      latency: 9,
      description: 'API REST Principal en Python FastAPI con SQLAlchemy y Pydantic.',
      routes: ['/productos', '/auth/login', '/compras'],
    },
  ]);

  const [dbStatus, setDbStatus] = useState({
    mysql: { status: 'UP', latency: '12ms', details: 'MySQL 8.0 (Principal)' },
    redis: { status: 'UP', latency: '2ms', details: 'Redis Cache (In-Memory)' },
    mongo: { status: 'UP', latency: '15ms', details: 'MongoDB (Respaldo / Réplica)' },
    rabbitmq: { status: 'UP', latency: '5ms', details: 'RabbitMQ Event Broker' },
  });

  const [haMode, setHaMode] = useState('PRIMARY_ACTIVE'); // PRIMARY_ACTIVE, OFFLINE_BACKUP_ACTIVE, RECONCILING_DELTAS
  const [pendingDeltas, setPendingDeltas] = useState(0);
  const [syncedProducts, setSyncedProducts] = useState(700);

  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [filter, setFilter] = useState('ALL');

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      // 1. Gateway Status
      const resGw = await fetch('http://localhost:8000/api/gateway/services');
      if (resGw.ok) {
        const dataGw = await resGw.json();
        if (dataGw && dataGw.services) {
          setServices((prev) =>
            prev.map((s) => {
              const matched = dataGw.services.find((gwS) => gwS.id === s.id);
              return matched ? { ...s, enabled: matched.enabled } : s;
            })
          );
        }
      }

      // 2. Sync HA Status
      const resSync = await fetch('http://localhost:3008/api/sync/status');
      if (resSync.ok) {
        const dataSync = await resSync.json();
        if (dataSync && dataSync.haState) {
          setHaMode(dataSync.haState.mode);
          setPendingDeltas(dataSync.haState.pendingOfflineDeltas || 0);
          setSyncedProducts(dataSync.haState.totalSyncedProducts || 700);
        }
      }
    } catch (err) {
      // Mantenimiento de valores locales si no se alcanza la red local
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    fetchStatuses();
    const interval = setInterval(fetchStatuses, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleService = async (serviceId) => {
    const target = services.find((s) => s.id === serviceId);
    if (!target) return;
    const newEnabledState = !target.enabled;

    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, enabled: newEnabledState } : s))
    );

    try {
      await fetch('http://localhost:8000/api/gateway/services/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, enabled: newEnabledState }),
      });
    } catch (err) {}
  };

  const handleSimulateFailover = (simulateOffline) => {
    if (simulateOffline) {
      setDbStatus((prev) => ({
        ...prev,
        mysql: { ...prev.mysql, status: 'DOWN', details: 'MySQL 8.0 (CAÍDO / MANTENIMIENTO)' },
      }));
      setHaMode('OFFLINE_BACKUP_ACTIVE');
      setPendingDeltas((prev) => prev + 3);
    } else {
      setDbStatus((prev) => ({
        ...prev,
        mysql: { ...prev.mysql, status: 'UP', details: 'MySQL 8.0 (Principal)' },
      }));
      setHaMode('RECONCILING_DELTAS');
      setTimeout(() => {
        setHaMode('PRIMARY_ACTIVE');
        setPendingDeltas(0);
      }, 2500);
    }
  };

  const handleTriggerReconciliation = async () => {
    setLoading(true);
    try {
      await fetch('http://localhost:3008/api/sync/reconcile', { method: 'POST' });
    } catch {}
    handleSimulateFailover(false);
  };

  const activeCount = services.filter((s) => s.enabled).length;
  const totalCount = services.length;

  const filteredServices = services.filter((s) => {
    if (filter === 'ACTIVE') return s.enabled;
    if (filter === 'INACTIVE') return !s.enabled;
    return true;
  });

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div>
          <div style={styles.badgeRow}>
            <span style={styles.liveBadge}>
              <Radio style={{ width: 14, height: 14, animation: 'pulse 2s infinite' }} /> MONITOR EN VIVO
            </span>
            <span style={styles.systemStatusBadge}>
              {haMode === 'PRIMARY_ACTIVE' ? (
                <>
                  <CheckCircle style={{ width: 14, height: 14, color: '#10B981' }} /> ESPEJO ALTA DISPONIBILIDAD (100%)
                </>
              ) : haMode === 'OFFLINE_BACKUP_ACTIVE' ? (
                <>
                  <AlertTriangle style={{ width: 14, height: 14, color: '#EF4444' }} /> MODO RESPALDO NOSQL ACTIVO
                </>
              ) : (
                <>
                  <RotateCcw style={{ width: 14, height: 14, color: '#F59E0B' }} /> RECONCILIANDO DELTAS...
                </>
              )}
            </span>
          </div>
          <h1 style={styles.title}>🎛️ Panel de Control & Auto-Sincronización Espejo</h1>
          <p style={styles.subtitle}>
            Gobierno de Microservicios CRUD, conmutación automática ante caídas (Failover) y réplica espejo bidireccional Self-Healing.
          </p>
        </div>

        <button style={styles.refreshBtn} onClick={fetchStatuses} disabled={loading}>
          <RefreshCw style={{ width: 16, height: 16, animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          {loading ? 'Actualizando...' : 'Refrescar Estado'}
        </button>
      </div>

      {/* FAILOVER & SELF-HEALING CONTROL BANNER */}
      <div style={{
        ...styles.haBanner,
        borderColor: haMode === 'PRIMARY_ACTIVE' ? 'rgba(16, 185, 129, 0.4)' : haMode === 'OFFLINE_BACKUP_ACTIVE' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(245, 158, 11, 0.5)',
      }}>
        <div style={styles.haBannerLeft}>
          <GitCompare style={{ width: 28, height: 28, color: haMode === 'PRIMARY_ACTIVE' ? '#10B981' : '#F59E0B' }} />
          <div>
            <h3 style={styles.haTitle}>Mecanismo de Réplica Espejo & Self-Healing</h3>
            <p style={styles.haDesc}>
              {haMode === 'PRIMARY_ACTIVE' && 'MySQL Principal y MongoDB Respaldo están 100% igualadas y en sincronización espejo continua.'}
              {haMode === 'OFFLINE_BACKUP_ACTIVE' && '⚠️ MySQL está fuera de línea. La base NoSQL (MongoDB) absorbió la carga sin detener la plataforma.'}
              {haMode === 'RECONCILING_DELTAS' && '🔄 Proceso de reconciliación en curso. Transfiriendo registros creados durante la caída hacia MySQL...'}
            </p>
          </div>
        </div>

        <div style={styles.haActions}>
          {dbStatus.mysql.status === 'UP' ? (
            <button style={styles.failoverOffBtn} onClick={() => handleSimulateFailover(true)}>
              <Power style={{ width: 14, height: 14 }} /> Simular Caída de MySQL
            </button>
          ) : (
            <button style={styles.failoverOnBtn} onClick={handleTriggerReconciliation}>
              <RotateCcw style={{ width: 14, height: 14 }} /> Encender MySQL & Reconciliar Espejo
            </button>
          )}
        </div>
      </div>

      {/* METRICS & DATABASE CARDS */}
      <div style={styles.dbGrid}>
        <div style={{
          ...styles.dbCard,
          borderLeft: dbStatus.mysql.status === 'UP' ? '4px solid #10B981' : '4px solid #EF4444',
        }}>
          <div style={styles.dbHeader}>
            <Database style={{ color: '#3B82F6', width: 20, height: 20 }} />
            <span style={styles.dbTitle}>MySQL 8.0 (Principal)</span>
          </div>
          <div style={styles.dbVal}>{dbStatus.mysql.details}</div>
          <div style={styles.dbStatusRow}>
            <span style={{
              ...styles.statusTag,
              background: dbStatus.mysql.status === 'UP' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: dbStatus.mysql.status === 'UP' ? '#10B981' : '#EF4444',
            }}>
              ● {dbStatus.mysql.status}
            </span>
            <span style={styles.latencyText}>{dbStatus.mysql.latency}</span>
          </div>
        </div>

        <div style={styles.dbCard}>
          <div style={styles.dbHeader}>
            <Server style={{ color: '#10B981', width: 20, height: 20 }} />
            <span style={styles.dbTitle}>MongoDB (Respaldo Espejo)</span>
          </div>
          <div style={styles.dbVal}>{dbStatus.mongo.details}</div>
          <div style={styles.dbStatusRow}>
            <span style={{ ...styles.statusTag, background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              ● UP ({syncedProducts} items)
            </span>
            <span style={styles.latencyText}>{dbStatus.mongo.latency}</span>
          </div>
        </div>

        <div style={styles.dbCard}>
          <div style={styles.dbHeader}>
            <Zap style={{ color: '#EF4444', width: 20, height: 20 }} />
            <span style={styles.dbTitle}>Redis Cache</span>
          </div>
          <div style={styles.dbVal}>{dbStatus.redis.details}</div>
          <div style={styles.dbStatusRow}>
            <span style={{ ...styles.statusTag, background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              ● {dbStatus.redis.status}
            </span>
            <span style={styles.latencyText}>{dbStatus.redis.latency}</span>
          </div>
        </div>

        <div style={styles.dbCard}>
          <div style={styles.dbHeader}>
            <Activity style={{ color: '#F59E0B', width: 20, height: 20 }} />
            <span style={styles.dbTitle}>RabbitMQ Broker</span>
          </div>
          <div style={styles.dbVal}>{dbStatus.rabbitmq.details}</div>
          <div style={styles.dbStatusRow}>
            <span style={{ ...styles.statusTag, background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              ● {dbStatus.rabbitmq.status}
            </span>
            <span style={styles.latencyText}>{dbStatus.rabbitmq.latency}</span>
          </div>
        </div>
      </div>

      {/* FILTER TABS & STATS */}
      <div style={styles.filterRow}>
        <div style={styles.statsSummary}>
          <span>Microservicios Activos: <strong>{activeCount} / {totalCount}</strong></span>
          <span style={{ marginLeft: '16px', color: pendingDeltas > 0 ? '#F59E0B' : '#10B981' }}>
            Deltas Offline Pendientes: <strong>{pendingDeltas}</strong>
          </span>
        </div>
        <div style={styles.tabButtons}>
          <button 
            style={{ ...styles.tabBtn, ...(filter === 'ALL' ? styles.tabBtnActive : {}) }}
            onClick={() => setFilter('ALL')}
          >
            Todos ({totalCount})
          </button>
          <button 
            style={{ ...styles.tabBtn, ...(filter === 'ACTIVE' ? styles.tabBtnActive : {}) }}
            onClick={() => setFilter('ACTIVE')}
          >
            Activos ({activeCount})
          </button>
          <button 
            style={{ ...styles.tabBtn, ...(filter === 'INACTIVE' ? styles.tabBtnActive : {}) }}
            onClick={() => setFilter('INACTIVE')}
          >
            Desactivados ({totalCount - activeCount})
          </button>
        </div>
      </div>

      {/* MICROSERVICES CARDS GRID */}
      <div style={styles.grid}>
        {filteredServices.map((svc) => (
          <div key={svc.id} style={{
            ...styles.card,
            borderLeft: svc.enabled ? '4px solid #10B981' : '4px solid #EF4444',
            opacity: svc.enabled ? 1 : 0.75,
          }}>
            <div style={styles.cardHeader}>
              <div>
                <div style={styles.cardTitleRow}>
                  <Cpu style={{ width: 18, height: 18, color: svc.enabled ? '#10B981' : '#6B7280' }} />
                  <h3 style={styles.cardTitle}>{svc.name}</h3>
                </div>
                <span style={styles.portBadge}>Puerto {svc.port}</span>
              </div>

              {/* TOGGLE SWITCH */}
              <button
                style={{
                  ...styles.toggleSwitch,
                  background: svc.enabled ? '#10B981' : '#374151',
                }}
                onClick={() => handleToggleService(svc.id)}
                title={svc.enabled ? 'Desactivar Microservicio' : 'Activar Microservicio'}
              >
                <span style={{
                  ...styles.toggleCircle,
                  transform: svc.enabled ? 'translateX(22px)' : 'translateX(2px)',
                }}>
                  <Power style={{ width: 12, height: 12, color: svc.enabled ? '#10B981' : '#9CA3AF' }} />
                </span>
              </button>
            </div>

            <p style={styles.cardDesc}>{svc.description}</p>

            <div style={styles.routeContainer}>
              <span style={styles.routeLabel}>Rutas mapeadas:</span>
              <div style={styles.routePills}>
                {svc.routes.map((r, i) => (
                  <span key={i} style={styles.routePill}>{r}</span>
                ))}
              </div>
            </div>

            <div style={styles.cardFooter}>
              <div style={styles.footerStatus}>
                {svc.enabled ? (
                  <span style={styles.statusOnline}>
                    <CheckCircle style={{ width: 14, height: 14 }} /> OPERACIONAL (ON)
                  </span>
                ) : (
                  <span style={styles.statusOffline}>
                    <XCircle style={{ width: 14, height: 14 }} /> DESACTIVADO (OFF)
                  </span>
                )}
              </div>
              <span style={styles.latencyBadge}>⚡ {svc.latency}ms</span>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.footerInfo}>
        <span>Última actualización: {lastUpdated.toLocaleTimeString()}</span>
        <span>UNIMARKET High Availability & Self-Healing Control Hub v2.5</span>
      </div>
    </div>
  );
}

// ESTILOS INLINE
const styles = {
  container: {
    padding: '24px',
    maxWidth: '1280px',
    margin: '0 auto',
    color: '#F9FAFB',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    background: 'rgba(17, 24, 39, 0.75)',
    backdropFilter: 'blur(12px)',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  },
  badgeRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '8px',
  },
  liveBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    color: '#10B981',
    background: 'rgba(16, 185, 129, 0.15)',
    padding: '4px 10px',
    borderRadius: '20px',
    border: '1px solid rgba(16, 185, 129, 0.3)',
  },
  systemStatusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#D1D5DB',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '4px 10px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#FFFFFF',
    margin: '4px 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#9CA3AF',
    margin: 0,
    maxWidth: '720px',
    lineHeight: '1.5',
  },
  refreshBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
  },
  haBanner: {
    background: 'rgba(31, 41, 55, 0.75)',
    backdropFilter: 'blur(10px)',
    borderRadius: '14px',
    padding: '20px 24px',
    marginBottom: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  haBannerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  haTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#FFFFFF',
    margin: '0 0 4px 0',
  },
  haDesc: {
    fontSize: '13px',
    color: '#D1D5DB',
    margin: 0,
  },
  haActions: {
    display: 'flex',
    gap: '12px',
  },
  failoverOffBtn: {
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#EF4444',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  failoverOnBtn: {
    background: '#10B981',
    color: '#FFFFFF',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  },
  dbGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  dbCard: {
    background: 'rgba(31, 41, 55, 0.6)',
    backdropFilter: 'blur(8px)',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  dbHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  dbTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#E5E7EB',
  },
  dbVal: {
    fontSize: '13px',
    color: '#9CA3AF',
    marginBottom: '10px',
  },
  dbStatusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTag: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  latencyText: {
    fontSize: '11px',
    color: '#6B7280',
    fontWeight: '600',
  },
  filterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  statsSummary: {
    fontSize: '14px',
    color: '#D1D5DB',
  },
  tabButtons: {
    display: 'flex',
    gap: '8px',
  },
  tabBtn: {
    background: 'rgba(31, 41, 55, 0.6)',
    color: '#9CA3AF',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  tabBtnActive: {
    background: '#3B82F6',
    color: '#FFFFFF',
    borderColor: '#3B82F6',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  card: {
    background: 'rgba(17, 24, 39, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '14px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  cardTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#FFFFFF',
    margin: 0,
  },
  portBadge: {
    display: 'inline-block',
    fontSize: '11px',
    color: '#60A5FA',
    background: 'rgba(96, 165, 250, 0.12)',
    padding: '2px 8px',
    borderRadius: '4px',
    marginTop: '4px',
    fontWeight: '600',
  },
  toggleSwitch: {
    width: '46px',
    height: '24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    padding: 0,
  },
  toggleCircle: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '2px',
    left: '0px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  cardDesc: {
    fontSize: '13px',
    color: '#9CA3AF',
    lineHeight: '1.4',
    margin: '0 0 16px 0',
  },
  routeContainer: {
    marginBottom: '16px',
  },
  routeLabel: {
    fontSize: '11px',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '700',
    display: 'block',
    marginBottom: '6px',
  },
  routePills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  routePill: {
    fontSize: '11px',
    background: 'rgba(255, 255, 255, 0.06)',
    color: '#E5E7EB',
    padding: '3px 8px',
    borderRadius: '4px',
    fontFamily: 'monospace',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '12px',
    marginTop: 'auto',
  },
  footerStatus: {
    fontSize: '12px',
    fontWeight: '700',
  },
  statusOnline: {
    color: '#10B981',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statusOffline: {
    color: '#EF4444',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  latencyBadge: {
    fontSize: '11px',
    color: '#F59E0B',
    fontWeight: '600',
    background: 'rgba(245, 158, 11, 0.1)',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  footerInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#6B7280',
    padding: '12px 4px',
  },
};
