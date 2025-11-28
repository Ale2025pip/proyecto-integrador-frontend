import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  
 // CARGAR DATOS DEL USUARIO SI EXISTEN
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    direccion: user?.direccion?.calle || '',
    ciudad: user?.direccion?.ciudad || '',
    codigoPostal: user?.direccion?.codigoPostal || '',
    telefono: user?.telefono || '',
    metodoPago: user?.metodoPagoPreferido || 'tarjeta',
    actualizarPerfil: !user?.nombre // Si no tiene nombre, activar por defecto
  });

  // DETECTAR SI EL USUARIO TIENE PERFIL COMPLETO
  const tienePerfilCompleto = user?.nombre && user?.apellido && user?.telefono && user?.direccion?.calle;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // PREPARAR DATOS PARA EL BACKEND
      const pedidoData = {
        productos: cartItems.map(item => ({
          producto: item._id,
          cantidad: item.quantity
        })),
        direccionEnvio: {
          calle: formData.direccion,
          ciudad: formData.ciudad,
          codigoPostal: formData.codigoPostal,
          pais: 'Argentina'
        },
        metodoPago: formData.metodoPago,
        actualizarPerfil: formData.actualizarPerfil,
        // Solo enviar si vamos a actualizar perfil
        ...(formData.actualizarPerfil && {
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono
        })
      };

      console.log('Enviando pedido:', pedidoData);

      // 🚀 URL CORREGIDA - TU BACKEND EN RENDER
      const response = await fetch('https://proyecto-integrador-v2.onrender.com/api/compras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pedidoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la compra');
      }

      const result = await response.json();
      
      // ÉXITO - Limpiar carrito y navegar
      clearCart();
      alert(`🎉 ¡Pedido realizado con éxito! Número: ${result.numeroPedido}`);
      navigate('/mis-compras');
      
    } catch (error) {
      console.error('Error en checkout:', error);
      alert('Error al realizar el pedido: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Carrito vacío</h1>
          <p className="text-gray-600 mb-8">Agrega productos al carrito antes de finalizar compra</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Finalizar Compra</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* FORMULARIO COMPLETO */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Información de Envío y Pago</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* NOMBRE Y APELLIDO */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.apellido}
                      onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* DIRECCIÓN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección completa *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Calle, número, piso, departamento"
                  />
                </div>

                {/* CIUDAD Y CÓDIGO POSTAL */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ciudad}
                      onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                 </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.codigoPostal}
                      onChange={(e) => setFormData({...formData, codigoPostal: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* TELÉFONO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono de contacto *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* MÉTODO DE PAGO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de Pago *
                  </label>
                  <select
                    value={formData.metodoPago}
                    onChange={(e) => setFormData({...formData, metodoPago: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                    <option value="transferencia">Transferencia Bancaria</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                </div>

                {/* GUARDAR EN PERFIL */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="actualizarPerfil"
                    checked={formData.actualizarPerfil}
                    onChange={(e) => setFormData({...formData, actualizarPerfil: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="actualizarPerfil" className="text-sm text-gray-700">
                    Guardar esta información para futuras compras
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold text-lg mt-6 transition duration-300"
              >
                {loading ? 'Procesando...' : 'Confirmar Pedido'}
              </button>
            </form>
          </div>

          {/* RESUMEN DEL PEDIDO */}
          <div className="bg-white rounded-xl shadow-sm border p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del Pedido</h2>
            
            <div className="space-y-3 mb-4">
              {cartItems.map(item => (
                <div key={item._id} className="flex justify-between items-center border-b pb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.imagen} 
                      alt={item.nombre}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item.nombre}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">${(item.precio * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span className="font-semibold text-green-600">Gratis</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-green-600">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
