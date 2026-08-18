import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import SearchResults from './pages/SearchResults';
import Vender from './pages/Vender';
import Ayuda from './pages/Ayuda';
import Categories from './pages/Categories';
import MisCompras from './pages/MisCompras';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import ProfilePersonalData from './pages/ProfilePersonalData';
import ProfileAddresses from './pages/ProfileAddresses';
import ProfileCards from './pages/ProfileCards';
import ProfileAccount from './pages/ProfileAccount';
import OrderDetail from './pages/OrderDetail';
import VendorDashboard from './pages/VendorDashboard';
import GenericSection from './components/GenericSection';

import InfoPage from './components/InfoPage';
import { Terms, Privacy, Accessibility } from './pages/Legal';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Content for static pages
const aboutContent = `
    <p>Market es la plataforma líder de comercio electrónico diseñada para conectar emprendimientos locales y compradores. Nuestra misión es fomentar el comercio digital y facilitar el intercambio de bienes y servicios.</p>
    <br/>
    <h3>Nuestra Visión</h3>
    <p>Ser el ecosistema digital preferido para impulsar la economía colaborativa y el talento emprendedor.</p>
`;

const howItWorksContent = `
    <h3>Para Compradores</h3>
    <ol>
        <li>Explora las categorías o usa el buscador para encontrar lo que necesitas.</li>
        <li>Revisa los detalles del producto y la calificación del vendedor.</li>
        <li>Contacta al vendedor o realiza la compra directamente a través de la plataforma.</li>
    </ol>
    <br/>
    <h3>Para Vendedores</h3>
    <ol>
        <li>Regístrate y activa tu cuenta de vendedor.</li>
        <li>Publica tus productos con fotos claras y descripciones detalladas.</li>
        <li>Gestiona tus ventas y responde preguntas desde tu panel de control.</li>
    </ol>
`;

const affiliatesContent = `
    <p>¡Gana dinero recomendando nuestro Market!</p>
    <p>Nuestro programa de afiliados te permite obtener beneficios por cada nuevo usuario que se registre y realice su primera compra a través de tu enlace de referido.</p>
    <p>Contacta a soporte@soporte.co para más información.</p>
`;

const termsContent = `
    <h3>Términos y Condiciones de Uso</h3>
    <p>Bienvenido a nuestra plataforma. Al usar este sitio, aceptas los siguientes términos...</p>
    <p>1. <strong>Uso de la cuenta:</strong> Eres responsable de mantener la confidencialidad de tu cuenta.</p>
    <p>2. <strong>Contenido prohibido:</strong> No se permite la venta de artículos ilegales, peligrosos o que violen derechos de propiedad intelectual.</p>
    <p>3. <strong>Privacidad:</strong> Tus datos están protegidos según nuestra política de privacidad.</p>
`;

const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) return <div>Cargando...</div>;
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/items" element={<SearchResults />} />
          <Route path="/items/:id" element={<ProductDetail />} />

          <Route path="/ofertas" element={<SearchResults />} />
          <Route path="/historial" element={<Navigate to="/mis-compras" replace />} />
          <Route path="/vender" element={<Vender />} />
          <Route path="/ayuda" element={<Ayuda />} />

          {/* Static Pages Routes */}
          <Route path="/acerca-de" element={<InfoPage title="Acerca de Nosotros" content={aboutContent} />} />
          <Route path="/como-funciona" element={<InfoPage title="Cómo Funciona" content={howItWorksContent} />} />
          <Route path="/afiliados" element={<InfoPage title="Programa de Afiliados" content={affiliatesContent} />} />
          <Route path="/afiliados" element={<InfoPage title="Programa de Afiliados" content={affiliatesContent} />} />
          <Route path="/terminos" element={<Terms />} />
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="/accesibilidad" element={<Accessibility />} />

          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          <Route path="/checkout" element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } />

          <Route path="/carrito" element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          } />

          <Route path="/mis-compras" element={
            <PrivateRoute>
              <MisCompras />
            </PrivateRoute>
          } />
          <Route path="/compras/:id" element={
            <PrivateRoute>
              <OrderDetail />
            </PrivateRoute>
          } />

          <Route path="/perfil" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />

          <Route path="/perfil/datos-personales" element={
            <PrivateRoute>
              <ProfilePersonalData />
            </PrivateRoute>
          } />

          <Route path="/perfil/datos-cuenta" element={
            <PrivateRoute>
              <ProfileAccount />
            </PrivateRoute>
          } />
          <Route path="/perfil/seguridad" element={
            <PrivateRoute>
              <GenericSection title="Seguridad" emptyMsg="Configuraciones de seguridad (2FA, contraseña)." />
            </PrivateRoute>
          } />
          <Route path="/perfil/colaboradores" element={
            <PrivateRoute>
              <GenericSection title="Colaboradores" emptyMsg="No tienes colaboradores asignados." />
            </PrivateRoute>
          } />
          <Route path="/perfil/tarjetas" element={
            <PrivateRoute>
              <ProfileCards />
            </PrivateRoute>
          } />
          <Route path="/perfil/direcciones" element={
            <PrivateRoute>
              <ProfileAddresses />
            </PrivateRoute>
          } />
          <Route path="/perfil/privacidad" element={
            <PrivateRoute>
              <GenericSection title="Privacidad" emptyMsg="Controla quién ve tus datos." />
            </PrivateRoute>
          } />
          <Route path="/perfil/comunicaciones" element={
            <PrivateRoute>
              <GenericSection title="Comunicaciones" emptyMsg="Gestiona tus notificaciones." />
            </PrivateRoute>
          } />

          {/* Secciones de Usuario Genericas */}
          <Route path="/historial" element={
            <PrivateRoute>
              <GenericSection title="Tu Historial" emptyMsg="No has visto productos recientemente." actionLabel="Ver productos" actionLink="/" />
            </PrivateRoute>
          } />
          <Route path="/preguntas" element={<Ayuda />} />
          <Route path="/opiniones" element={
            <PrivateRoute>
              <GenericSection title="Opiniones" emptyMsg="No has opinado sobre tus compras aún." />
            </PrivateRoute>
          } />
          <Route path="/suscripciones" element={
            <PrivateRoute>
              <GenericSection title="Suscripciones" emptyMsg="No tienes suscripciones activas." />
            </PrivateRoute>
          } />
          <Route path="/mercado-play" element={<GenericSection title="Mercado Play" emptyMsg="Disfruta de películas y series gratis." actionLabel="Ir a ver" />} />

          {/* Secciones de Vendedor Genericas */}
          <Route path="/vender" element={<Vender />} />
          <Route path="/resumen" element={<PrivateRoute><VendorDashboard /></PrivateRoute>} />
          <Route path="/publicaciones" element={<PrivateRoute><GenericSection title="Publicaciones" emptyMsg="No tienes publicaciones activas." /></PrivateRoute>} />
          <Route path="/ventas" element={<PrivateRoute><GenericSection title="Ventas" emptyMsg="Aún no tienes ventas." /></PrivateRoute>} />
          <Route path="/posventa" element={<PrivateRoute><GenericSection title="Posventa" emptyMsg="No hay reclamos ni mensajes pendientes." /></PrivateRoute>} />
          <Route path="/reputacion" element={<PrivateRoute><GenericSection title="Reputación" emptyMsg="Aún no tienes suficientes ventas para calcular tu reputación." /></PrivateRoute>} />
          <Route path="/publicidad" element={<PrivateRoute><GenericSection title="Publicidad" emptyMsg="No tienes campañas activas." /></PrivateRoute>} />
          <Route path="/mi-pagina" element={<PrivateRoute><GenericSection title="Mi Página" emptyMsg="Configura tu página de vendedor." /></PrivateRoute>} />
          <Route path="/central-marketing" element={<PrivateRoute><GenericSection title="Central de Marketing" emptyMsg="Herramientas para potenciar tus ventas." /></PrivateRoute>} />
          <Route path="/metricas" element={<PrivateRoute><GenericSection title="Métricas" emptyMsg="No hay datos suficientes para mostrar métricas." /></PrivateRoute>} />
          <Route path="/facturacion" element={<PrivateRoute><GenericSection title="Facturación" emptyMsg="No tienes facturas pendientes." /></PrivateRoute>} />

          {/* Rutas no encontradas */}
          <Route path="*" element={<div className="container" style={{ padding: '50px', textAlign: 'center' }}><h2>404 - Página no encontrada</h2></div>} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
