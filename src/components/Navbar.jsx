import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // 🆕 IMPORT NUEVO
import AuthButtons from "./AuthButtons"
import CartButton from "./CartButton";
import DashboardButton from "./DashboardButton";
import Icon from "./Icon";
import NavbarBase from "./NavbarBase";
import CreateProduct from './Admin/CreateProduct';

function Navbar() {
  const {isAuthenticated, user, logout} = useAuth();
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  
  return (
    <nav className="bg-green-600 to-emerald-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo y Navegación */}
          <div className="flex items-center gap-6">
            <Icon />
            <NavbarBase />
          </div>

          {/*Botones de usuario */}
          <div className="flex items-center gap-4">
            {/* 🆕 LINK A MI PERFIL (solo para usuarios logueados) */}
            {isAuthenticated && user?.role === 'user' && (
              <Link 
                to="/mi-perfil"
                className="text-white hover:text-gray-200 px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition duration-200"
              >
                👤 Mi Perfil
              </Link>
            )}
            
            {/* BOTÓN CREAR PRODUCTO PARA ADMIN */}
            {user?.role === 'admin' && (
              <button 
                onClick={() => setShowCreateProduct(true)}
                className="bg-white hover:bg-gray-100 text-green-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition duration-200"
              >
                ➕ Crear Producto
              </button>
            )}
            
            <CartButton cartItems={0} isLogin={isAuthenticated} />
            <DashboardButton isAdmin={user?.role === 'admin'} />
            <AuthButtons isLogin={isAuthenticated} logOut={logout} />
          </div>
          
        </div>
      </div>

      {/* MODAL CREAR PRODUCTO */}
      {showCreateProduct && (
        <CreateProduct onClose={() => setShowCreateProduct(false)} />
      )}
    </nav>
  );
}

export default Navbar;
