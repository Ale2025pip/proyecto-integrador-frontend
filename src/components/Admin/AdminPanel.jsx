import { useState } from 'react';
import CreateProduct from './CreateProduct';

function AdminPanel() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700"
        >
          ➕ Crear Producto
        </button>
        <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700">
          📦 Gestionar Productos
        </button>
        <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700">
            📊 Ver Pedidos
        </button>
      </div>

      {showCreateModal && (
        <CreateProduct onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

export default AdminPanel;
