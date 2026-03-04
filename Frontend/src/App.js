import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Vendors from "./pages/Vendors";
import AddVendor from "./pages/AddVendor";
import PayoutList from "./pages/PayoutList";
import CreatePayout from "./pages/CreatePayout";
import PayoutDetail from "./pages/PayoutDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/vendors"
          element={
            <PrivateRoute>
              <Layout>
                <Vendors />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-vendor"
          element={
            <PrivateRoute>
              <Layout>
                <AddVendor />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/payouts"
          element={
            <PrivateRoute>
              <Layout>
                <PayoutList />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/create-payout"
          element={
            <PrivateRoute>
              <Layout>
                <CreatePayout />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/payout/:id"
          element={
            <PrivateRoute>
              <Layout>
                <PayoutDetail />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;