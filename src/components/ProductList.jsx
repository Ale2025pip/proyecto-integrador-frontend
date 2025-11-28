import { useState, useEffect } from 'react';
import { productService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductModal from './ProductModal';
function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, user, token } = useAuth();
  const { addToCart } = useCart();

  // CARGAR PRODUCTOS REALES DEL BACKEND
  useEffect(() => {
    loadRealProducts();
  }, []);

  const loadRealProducts = async () => {
    try {
      setLoading(true);
      setError(null);
    
    const data = await productService.getProducts();
    console.log('📦 Productos del backend:', data);
  
    if (data.productos && data.productos.length > 0) {
      setProducts(data.productos);
      console.log('✅ Productos cargados');
    } else {
      setProducts([]);
      console.log('⚠️ No hay productos en DB');
    }
  } catch (error) {
    console.error('❌ Error cargando productos:', error);
    setError('Error al cargar productos');
    setProducts([]);
  } finally {
    setLoading(false);
  }
 };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`✅ ${product.nombre} agregado al carrito!`);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  const handleEditProduct = async (product) => {
  try {
    console.log("✏️ EDITAR PRODUCTO:", product);
    
    // Por ahora, función básica con prompt
    const nuevoNombre = prompt("Nuevo nombre del producto:", product.nombre);
    if (nuevoNombre && nuevoNombre !== product.nombre) {
      // Aquí llamaríamos al backend cuando esté listo
      await productService.updateProduct(product._id, { nombre: nuevoNombre }, token);
      alert(`Producto actualizado a: ${nuevoNombre}\n(Función conectada al backend)`);
      
      // Recargar productos para ver cambios
      loadRealProducts();
    }
  } catch (error) {
    console.error('Error editando producto:', error);
    alert('Error al editar producto');
  }
 };

const handleDeleteProduct = async (product) => {
  try {
    console.log("🗑️ ELIMINAR PRODUCTO:", product);
    
    if (confirm(`¿Estás seguro de eliminar "${product.nombre}"?`)) {
      // Aquí llamaríamos al backend cuando esté listo  
      await productService.deleteProduct(product._id, token);
      alert(`✅ Producto "${product.nombre}" eliminado\n(Función conectada al backend)`);
      
      // Recargar productos para ver cambios
      loadRealProducts();
    }
  } catch (error) {
    console.error('Error eliminando producto:', error);
    alert('Error al eliminar producto');
  }
 };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* PRESENTACIÓN */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">🛍️ Bienvenido a Code Store</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Descubre la mejor tecnología al precio más competitivo. 
          {!isAuthenticated && " Regístrate para comprar y recibir ofertas exclusivas."}
        </p>
      </div>

      {/* CARTEL ADMIN */}
      {isAdmin && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-yellow-800 font-semibold">
            ⚙️ <strong>Modo Administrador Activado</strong> - Puedes gestionar el catálogo de productos
          </p>
        </div>
      )}

      {/* PRODUCTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product._id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
            <img 
               src={product.imagen || 'https://via.placeholder.com/400x300/f3f4f6/9ca6bb?text=📷+Imagen+no+disponible'} 
               alt={product.nombre}
               className="w-full h-64 object-cover rounded-t-xl"
            />
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800 flex-1 pr-2">{product.nombre}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                  {product.categoria}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.descripcion}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-green-600">${product.precio.toLocaleString()}</span>
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              </div>
              
              {/* BOTONES - SOLO UNOS U OTROS */}
              {!isAdmin ? (
                // BOTONES PARA USUARIOS NORMALES
                <div className="flex gap-3 mb-3">
                  <button 
                      onClick={() => handleViewDetails(product)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition duration-300"
                  >
                      👁️ Ver Detalles
                  </button>
                  <button 
                      onClick={() => isAuthenticated ? handleAddToCart(product) : (window.location.href = '/login')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition duration-300"
                  >
                      🛒 {isAuthenticated ? 'Agregar al Carrito' : 'Comprar'}
                  </button>
                </div>
              ) : (
                // BOTONES PARA ADMIN
                <div className="flex gap-2 pt-3">
                  <button 
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium"
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm font-medium"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MENSAJE PARA NO LOGUEADOS */}
      {!isAuthenticated && (
        <div className="text-center mt-12 p-8 bg-blue-50 rounded-2xl border border-blue-200">
          <p className="text-gray-700 text-lg mb-4">
            🔓 <strong>¿Quieres comprar?</strong> Regístrate gratis en 30 segundos
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300"
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => window.location.href = '/register'}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300"
            >
              Crear Cuenta
            </button>
          </div>
        </div>
      )}
      
    {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default ProductList
