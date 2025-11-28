import {Route, Routes} from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import { AuthProvider, useAuth } from './context/AuthContext'; // 🆕 useAuth agregado
import { CartProvider } from './context/CartContext';
import Checkout from './pages/Checkout';
import MisPedidos from './pages/MisPedidos';
import AdminPanel from './components/Admin/AdminPanel';
import UserProfile from './pages/UserProfile';

function AppContent() {
  const { isAuthenticated, user, logout } = useAuth(); // 🆕 Usar AuthContext
  const cartItem = 4;

  return (
    <>
      <Navbar 
        isLogin={isAuthenticated}  // 🆕 Usar isAuthenticated del contexto
        isAdmin={user?.role === 'admin'}  // 🆕 Usar user del contexto
        logOut={logout}  // 🆕 Usar logout del contexto
        cartItem={cartItem}
      />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/*" element={<h1>404</h1>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/mis-pedidos" element={<MisPedidos/>}/>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/mi-perfil" element={<UserProfile />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent /> {/* 🆕 Componente interno que usa useAuth */}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
