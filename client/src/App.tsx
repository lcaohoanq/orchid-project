import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/auth.context";
import { CartProvider } from "./contexts/cart.context";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import Cart from "./pages/Cart";
import DetailOrchid from "./pages/DetailOrchid/DetailOrchid";
import HomeScreen from "./pages/Home/Home";
import EditOrchid from "./pages/Management/EditOrchid/EditOrchid";
import ListOfEmployees from "./pages/Management/EmployeeList/ListOfEmployees";
import ListOfOrchids from "./pages/Management/OrchidList/ListOfOrchids";

import Orders from "./pages/Management/Order";
import OrderDetail from "./pages/Management/OrderDetail";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <NavBar />
            <Toaster position="top-center" />
            <Routes>
              <Route path="/" element={<HomeScreen />} />

              {/* Public Orders Routes */}
              <Route path="/orders">
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path=":orderId"
                  element={
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Management Routes (Admin only) */}
              <Route path="/manage">
                <Route path="employees" element={<ListOfEmployees />} />
                <Route path="orchids">
                  <Route index element={<ListOfOrchids />} />
                  <Route path="edit/:id" element={<EditOrchid />} />
                </Route>
                <Route path="orders">
                  <Route index element={<Orders />} />
                  <Route path=":orderId" element={<OrderDetail />} />
                </Route>
              </Route>

              <Route path="/detail/:id" element={<DetailOrchid />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User Profile and Orders */}
              <Route
                path="/my-profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
