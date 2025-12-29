import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import Login from "./screens/login/Login";
import Dashboard from "./screens/dashboard/Dashboard";
import { TimeCardProvider } from "./context/TimeCardContext";
import {CableProvider} from "./context/CableContext";
import {HoseProvider} from "./context/HoseContext";
import {AlternatorProvider} from "./context/AlternatorContext";
import { NotificationProvider } from './context/NotificationContext';
import { MyProjectProvider } from './context/MyProjectContext';
import { MessageProvider } from './context/MessageContext'; 
import { MembersProvider } from "./context/MembersContext"; 
import { EmailProvider } from "./context/EmailContext";
import { OverviewProvider } from './context/OverviewContext';
import { SidebarProvider } from "./context/SideBarContext";

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
      <OrderProvider>
        <TimeCardProvider>
          <CableProvider>
            <HoseProvider>
              <AlternatorProvider>
                <NotificationProvider>
                  <MyProjectProvider>
                    <MessageProvider>
                      <MembersProvider>
                        <EmailProvider>
                          <OverviewProvider>
                            <SidebarProvider>
                              <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route
                                  path="/"
                                  element={<ProtectedRoute element={Dashboard} />}
                                />
                                <Route
                                  path="/overview"
                                  element={<ProtectedRoute element={Dashboard} />}
                                />
                                <Route
                                  path="/cables"
                                  element={<ProtectedRoute element={Dashboard} />}
                                />
                                <Route
                                  path="/hose"
                                  element={<ProtectedRoute element={Dashboard} />}
                                />
                                <Route
                                  path="/starters-alternators"
                                  element={<ProtectedRoute element={Dashboard} />}
                                />
                                <Route
                                  path="/orders"
                                  element={<ProtectedRoute element={Dashboard} />}
                                />
                                 <Route
                                  path="/price"
                                  element={<ProtectedRoute element={Dashboard} />}
                                />
                                <Route
                                  path="/notifications"
                                  element={<ProtectedRoute element={Dashboard} />}
                                />
                                <Route
                                  path="/emails"
                                  element={<ProtectedRoute element={Dashboard} />}
                                />
                                <Route
                                  path="/my-tasks"
                                  element={<ProtectedRoute element={Dashboard} />}
                                />
                                <Route
                                  path="/messages"
                                  element={<ProtectedRoute element={Dashboard} />}
                                />
                                <Route
                                  path="/members"
                                  element={<ProtectedRoute element={Dashboard} />}
                                />
                                <Route
                                  path="/timecard"
                                  element={<ProtectedRoute element={Dashboard} />}
                                />
                                <Route
                                  path="/change-password"
                                  element={<ProtectedRoute element={Dashboard} />}
                                />                                
                                <Route path="*" element={<Navigate to="/overview" replace />} />
                              </Routes>
                            </SidebarProvider>
                          </OverviewProvider>
                        </EmailProvider>
                      </MembersProvider>
                    </MessageProvider>
                  </MyProjectProvider>
                </NotificationProvider>
              </AlternatorProvider>
            </HoseProvider>
          </CableProvider>
        </TimeCardProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
