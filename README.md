CodeStore - Frontend Ecommerce

Aplicación Desplegada: https://code-store-psi.vercel.app/

Descripción
Aplicación web SPA (Single Page Application) desarrollada con React como trabajo práctico integrador. Permite realizar un CRUD completo sobre productos (entidad principal) y compras (entidad de soporte), con autenticación, roles de usuario y navegación sin recargas.

Funcionalidades Principales
Autenticación JWT - Login y registro de usuarios
Módulo ABMC Completo - Alta, Baja, Modificación, Consulta de productos
Navegación SPA - React Router para navegación sin recargas
Gestión de Estado - Hooks de React (useState, useEffect, useContext)
Roles de Usuario - Admin/Cliente con permisos diferenciados

Tecnologías Utilizadas
Framework: React 18 + Vite
Enrutamiento: React Router DOM
Estilos: TailwindCSS
Estado: React Context API, Hooks
HTTP: Fetch API
Deploy: Vercel

Estructura del Proyecto
src/
├── components/
│ ├── Admin/
│ │ └── CreateProduct.jsx
│ ├── Cart/
│ │ └── CartButton.jsx
│ ├── Product/
│ │ └── ProductModal.jsx
│ └── UI/
│ ├── Navbar.jsx
│ ├── Hero.jsx
│ └── AuthButtons.jsx
├── context/
│ ├── AuthContext.js
│ └── CartContext.js
├── pages/
│ ├── Home.jsx
│ ├── Login.jsx
│ ├── Register.jsx
│ ├── Checkout.jsx
│ └── ProductList.jsx
├── services/
│ └── api.js
├── hooks/
│ └── (Custom hooks)
└── App.jsx

Hooks de React Implementados
- useState - Gestión de estado local en componentes
- useEffect - Efectos secundarios y llamadas API
- useContext - Estado global (AuthContext, CartContext)
- useNavigate - Navegación programática (React Router)

Navegación SPA
- `/` - Página de inicio con productos
- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/checkout` - Finalizar compra
- Navegación sin recargas de página

Credenciales de Prueba
- Administrador: test@postman.com / 123456
- Usuario regular: [cualquier email al registrarse]

Entidades Implementadas

Entidad Principal: Productos
- ABMC completo con interfaz de administración
- Propiedades: nombre, descripción, precio, categoría, stock, imagen

Entidad de Soporte: Compras
- Integración con sistema de carrito y checkout
- Relación con productos y usuarios

Repositorios Relacionados
- [Backend API](https://github.com/Ale2025pip/proyecto-integrador/tree/main/backend)
- [API Desplegada](https://proyecto-integrador-v2.onrender.com/api)


 Configuración
Crea un archivo `.env` en la raíz del proyecto:

```env
URL de la API Backend
VITE_API_URL=https://proyecto-integrador-v2.onrender.com/api

Para desarrollo local usar:
VITE_API_URL=http://localhost:3000/api