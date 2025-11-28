import { useState } from 'react';
import Hero from '../components/Hero';
import ProductList from '../components/ProductList';
import { useAuth } from '../context/AuthContext';

function Home() {
  const [refreshProducts, setRefreshProducts] = useState(0);
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === 'admin'; // ← NUEVO

  const handleProductCreated = () => {
    setRefreshProducts(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <div className="max-w-6xl mx-auto py-8">
        <ProductList key={refreshProducts} />
      </div>
    </div>
  );
}

export default Home;