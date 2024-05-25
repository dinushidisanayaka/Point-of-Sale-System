import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import PointOfSale from "./components/PointOfSalePage";
// import ItemCategoriesPage from "./components/ItemCategoriesPage";
import StockManagementPage from "./components/StockManagementPage";
import OrderHistory from "./components/OrderHistory";
import ErrorComponent from "./components/ErrorComponent";
import Navigation from "./components/Navigation";
import ItemPage from "./components/ItemCategoriesPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PointOfSale />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/items" element={<ItemPage />} /> ItemCategoriesPage
          {/* <Route path="/item-categories" element={<ItemCategoriesPage />} /> */}
          <Route path="/stock-management" element={<StockManagementPage />} />
          <Route path="/point-of-sale" element={<PointOfSale />} />
          <Route path="/orderhistory" element={<OrderHistory />} />
          <Route path="/navigation" element={<Navigation />} />
          <Route path="*" element={<ErrorComponent />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
