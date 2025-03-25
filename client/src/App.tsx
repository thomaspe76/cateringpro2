import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/auth/Login';
import { Dashboard } from './components/dashboard/Dashboard';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { CustomerList } from './components/customers/CustomerList';
import { OrderList } from './components/orders/OrderList';
import { OfferList } from './components/offers/OfferList';
import { ProductList } from './components/products/ProductList';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="customers" replace />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="offers" element={<OfferList />} />
          <Route path="products" element={<ProductList />} />
        </Route>

        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
