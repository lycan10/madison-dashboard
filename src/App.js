import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import { OrderProvider } from "./context/OrderContext";
import Login from "./screens/login/Login";
import Dashboard from "./screens/dashboard/Dashboard";
import OrderPage from "./screens/order/Order";
import ChangeUsersPassword from "./screens/ChangeUsersPassword/changeUsersPassword";
import { InventoryProvider } from "./context/InventoryContext";
import { HitchProvider } from "./context/HitchContext";
import { TimeCardProvider } from "./context/TimeCardContext";
import Cables from "./screens/cables/Cables";
import Hose from "./screens/hose/Hose";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <p>Loading...</p>;
  }
  return user ? <Component {...rest} /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <InventoryProvider>
          <HitchProvider>
            <OrderProvider>
              <TimeCardProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={<ProtectedRoute element={Dashboard} />}
                />
                <Route
                  path="/orders"
                  element={<ProtectedRoute element={OrderPage} />}
                />
                <Route
                  path="/hose"
                  element={<ProtectedRoute element={Hose} />}
                />
                <Route
                  path="/cables"
                  element={<ProtectedRoute element={Cables} />}
                />
                <Route
                  path="/change-password"
                  element={<ProtectedRoute element={ChangeUsersPassword} />}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              </TimeCardProvider>
            </OrderProvider>
          </HitchProvider>
        </InventoryProvider>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
