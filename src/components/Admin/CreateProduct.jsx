import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function CreateProduct({ onClose, onProductCreated }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    stock: '',
    imagen: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('https://proyecto-integrador-v2.onrender.com/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          precio: parseFloat(formData.precio),
          stock: parseInt(formData.stock)
        })
      });

      if (response.ok) {
        alert('✅ Producto creado exitosamente!');
        onProductCreated?.();
        onClose();
      } else {
        throw new Error('Error al crear producto');
      }
    } catch (error) {
      alert('❌ Error creando producto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Crear Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Nombre del producto" 
            required 
            value={formData.nombre} 
            onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea 
            placeholder="Descripción" 
            required 
            value={formData.descripcion} 
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})} 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="3"
          />
          <input 
            type="number" 
            placeholder="Precio" 
            required 
            value={formData.precio} 
            onChange={(e) => setFormData({...formData, precio: e.target.value})} 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input 
            type="text" 
            placeholder="Categoría" 
            required 
            value={formData.categoria} 
            onChange={(e) => setFormData({...formData, categoria: e.target.value})} 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input 
            type="number" 
            placeholder="Stock" 
            required 
            value={formData.stock} 
            onChange={(e) => setFormData({...formData, stock: e.target.value})} 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input 
            type="url" 
            placeholder="URL de la imagen" 
            required 
            value={formData.imagen} 
            onChange={(e) => setFormData({...formData, imagen: e.target.value})} 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          
          <div className="flex gap-2 justify-end pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-green-700"
            >
              {loading ? 'Creando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;
