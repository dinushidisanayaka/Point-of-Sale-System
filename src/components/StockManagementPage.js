import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import "./css/StockManagement.css";

function StockManagement() {
  const [stock, setStock] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStock, setFilteredStock] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");
  const [showmsg, setShowMsg] = useState("");

  useEffect(() => {
    fetchStock();
  }, []);

  useEffect(() => {
    const filtered = stock.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStock(filtered);
  }, [searchTerm, stock]);

  const fetchStock = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/item");
      if (response.ok) {
        const data = await response.json();
        setStock(data);
        setFilteredStock(data);
      } else {
        console.error("Failed to fetch stock data");
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setNewQuantity(item.quantity);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedItem(null);
    setNewQuantity("");
    setShowMsg("");
  };

  const handleUpdate = async () => {
    if (newQuantity < 0) {
      setShowMsg("Quantity cannot be negative.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/item/stock/${selectedItem.id}?stock=${newQuantity}`,
        {
          method: "PUT",
        }
      );
      console.log(response);

      if (response.ok) {
        fetchStock();
        handleClose();
      } else {
        setShowMsg("Failed to update item.");
      }
    } catch (error) {
      setShowMsg("Error updating item: " + error.message);
    }
  };

  return (
    <>
      <Navigation />
      <div className="stock-management-container">
        <h1 className="stock-management-heading">Stock Management</h1>
        <div className="search-bar">
          <input
            className="stock-management-search"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <table className="stock-management-table">
          <thead className="stock-management-thead">
            <tr className="stock-management-tr">
              <th className="stock-management-th">Product Name</th>
              <th className="stock-management-th">Quantity</th>
              <th className="stock-management-th">Actions</th>
            </tr>
          </thead>
          <tbody className="stock-management-tbody">
            {filteredStock.map((item) => (
              <tr key={item.id} className="stock-management-tr">
                <td className="stock-management-td">{item.name}</td>
                <td className="stock-management-td">{item.quantity}</td>
                <td className="stock-management-td">
                  <button
                    className="stock-management-button"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showmsg && <Alert variant="danger">{showmsg}</Alert>}
          <Form>
            <Form.Group controlId="formItemQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                min="0"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default StockManagement;
