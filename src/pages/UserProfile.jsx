import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || '',
    direccion: {
      calle: user?.direccion?.calle || '',
      ciudad: user?.direccion?.ciudad || '',
      codigoPostal: user?.direccion?.codigoPostal || '',
      pais: user?.direccion?.pais || 'Argentina'
    },
    metodoPagoPreferido: user?.metodoPagoPreferido || 'tarjeta'
  });

  // Cargar historial de compras
  const fetchCompras = async () => {
    try {
      const response = await fetch('https://proyecto-integrador-v2.onrender.com/api/compras', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCompras(data.compras || []);
      }
    } catch (error) {
      console.error('Error cargando compras:', error);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar perfil
  const actualizarPerfil = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://proyecto-integrador-v2.onrender.com/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Perfil actualizado correctamente');
        setEditMode(false);
        // Recargar página para ver cambios
        window.location.reload();
      } else {
        throw new Error('Error al actualizar perfil');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchCompras();
    }
  }, [user, token]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Debes iniciar sesión</h1>
          <button 
            onClick={() => navigate('/login')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Mi Perfil</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* SECCIÓN DATOS PERSONALES */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Datos Personales</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
              >
                {editMode ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            {editMode ? (
              <form onSubmit={actualizarPerfil}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                      <input
                        type="text"
                        value={formData.apellido}
                        onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <input
                      type="text"
                      value={formData.direccion.calle}
                      onChange={(e) => setFormData({
                        ...formData, 
                        direccion: {...formData.direccion, calle: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 mb-2"
                      placeholder="Calle y número"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formData.direccion.ciudad}
                        onChange={(e) => setFormData({
                          ...formData, 
                          direccion: {...formData.direccion, ciudad: e.target.value}
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Ciudad"
                      />
                      <input
                        type="text"
                        value={formData.direccion.codigoPostal}
                        onChange={(e) => setFormData({
                          ...formData, 
                          direccion: {...formData.direccion, codigoPostal: e.target.value}
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="CP"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago Preferido</label>
                    <select
                      value={formData.metodoPagoPreferido}
                      onChange={(e) => setFormData({...formData, metodoPagoPreferido: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="tarjeta">Tarjeta</option>
                      <option value="transferencia">Transferencia</option>
                      <option value="efectivo">Efectivo</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-semibold">{user.nombre || 'No especificado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Apellido:</span>
                  <span className="font-semibold">{user.apellido || 'No especificado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Teléfono:</span>
                  <span className="font-semibold">{user.telefono || 'No especificado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dirección:</span>
                  <span className="font-semibold text-right">
                    {user.direccion?.calle ? 
                      `${user.direccion.calle}, ${user.direccion.ciudad}` : 
                      'No especificada'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Método de pago:</span>
                  <span className="font-semibold capitalize">
                    {user.metodoPagoPreferido || 'No especificado'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN HISTORIAL DE COMPRAS */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Historial de Compras</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Cargando compras...</p>
              </div>
            ) : compras.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-600">Aún no tienes compras</p>
                <button 
                  onClick={() => navigate('/')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold mt-4"
                >
                  Realizar mi primera compra
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {compras.map((compra) => (
                  <div key={compra._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">Pedido #{compra.numeroPedido}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(compra.fechaCompra).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        compra.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                        compra.estado === 'enviado' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {compra.estado}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-green-600">${compra.total?.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      {compra.productos?.length} producto(s)
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;