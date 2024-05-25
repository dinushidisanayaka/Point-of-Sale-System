import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";

import Cookies from "js-cookie";

import "./css/ItemsPage.css";
import "./css/style.css";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

function PointOfSale() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemCount, setItemCount] = useState(1);
  const [error, setError] = useState("");

  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState([]); // Default to first category in list

  function getCategoryNameById(id) {
    const category = selectedCategory.find((cat) => cat.id === id);
    return category ? category.catName : "Category not found";
  }
  const fetchCatogoryData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/category", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let data = await response.json();
      //check the data null
      if (data === null) {
        data = [];
      }
      console.log("data", data);
      setSelectedCategory(data);
    } catch (error) {
      console.error("Error fetching user data: ", error);
      setSelectedCategory([]);
    }
  };

  const loadCartFromCookie = () => {
    const cart = Cookies.get("cart_cookies");
    return cart
      ? JSON.parse(cart).map((item) => ({
          ...item,
          itemId: item.id,
          quantity: parseInt(item.quantity, 10),
        }))
      : [];
  };

  const [cart, setCart] = useState(loadCartFromCookie());

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/item", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await response.json();
      data = data.map((item) => {
        const cartItem = cart.find((cartItem) => cartItem.id === item.id);
        if (cartItem) {
          return { ...item, quantity: item.quantity - cartItem.quantity };
        }
        return item;
      });

      setItems(data);
    } catch (error) {
      console.error("Error fetching user data: ", error);
      setItems([]); // Set items to an empty array on error
    }
  };

  const placeOrder = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cart),
      });
      if (response.ok) {
        const orderDetails = await response.json();
        console.log("Order placed successfully:", orderDetails);
        setCart([]);
        saveCartToCookie([]);

        // Show dialog box with order completion details
        setShowOrderDialog(true);
        setOrderDetails(orderDetails);
      } else {
        console.error("Error placing order");
      }
    } catch (error) {
      console.error("Error placing order: ", error);
    }
    console.log(cart);
  };

  const saveCartToCookie = (cart) => {
    Cookies.set("cart_cookies", JSON.stringify(cart), { expires: 7 }); // Save cookie for 7 days
  };

  useEffect(() => {
    fetchUserData();
    fetchCatogoryData();
  }, []);

  const handleShow = (item) => {
    setSelectedItem(item);
    setShow(true);
    setItemCount(1); // Reset item count when opening modal
    setError(""); // Reset error message
  };

  const handleClose = () => {
    setShow(false);
    setItemCount(1);
    setError("");
  };

  // Function to add items to the cart and update the items table

  const handleAddToCart = () => {
    if (itemCount > selectedItem.quantity) {
      setError(
        `Item count cannot exceed available quantity of ${selectedItem.quantity}.`
      );
    } else {
      // Update the items list to reflect the new quantity available
      const updatedItems = items.map((item) =>
        item.id === selectedItem.id
          ? { ...item, quantity: item.quantity - itemCount }
          : item
      );
      setItems(updatedItems);

      // Check if the item is already in the cart
      const existingItemIndex = cart.findIndex(
        (item) => item.itemId === selectedItem.id
      );
      let updatedCart;
      if (existingItemIndex !== -1) {
        // Update quantity of existing item in the cart
        updatedCart = cart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + itemCount }
            : item
        );
      } else {
        // Add new item to the cart
        updatedCart = [
          ...cart,
          {
            itemId: selectedItem.id,
            quantity: itemCount,
            price: selectedItem.price * itemCount,
          },
        ];
      }

      setCart(updatedCart);
      saveCartToCookie(updatedCart); // Save updated cart to cookie

      console.log(`Adding ${itemCount} of ${selectedItem.name} to cart`);
      handleClose();
    }
  };

  return (
    <>
      <Navigation />
      {/* div with two col*/}

      <Row>
        <Col xs={9} m>
          <div className="items-page-container">
            <h1 className="items-h1">POS</h1>
            <table className="items-table">
              <thead className="items-thead">
                <tr className="items-tr">
                  <th className="items-th">Product Name</th>
                  <th className="items-th">SKU/Barcode</th>
                  <th className="items-th">Price</th>
                  <th className="items-th">Quantity Available</th>
                  <th className="items-th">Category/Department</th>
                  <th className="items-th">Option</th>
                </tr>
              </thead>
              <tbody>
                {items && items.length > 0 ? (
                  items.map((item) => (
                    <tr className="items-tr" key={item.id}>
                      <td className="items-td">{item.name}</td>
                      <td className="items-td">{item.id}</td>
                      <td className="items-td">{item.price}.00</td>
                      <td className="items-td">{item.quantity}</td>
                      <td className="items-td">
                        {getCategoryNameById(item.category)}
                      </td>
                      <td className="items-td">
                        <button
                          disabled={item.quantity === 0}
                          className="items-button"
                          onClick={() => handleShow(item)}
                        >
                          Add to Cart
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="items-tr">
                    <td className="items-td" colSpan="6">
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Col>
        <Col xs={3} m>
          <div className="items-page-container">
            <h1 className="items-h1">Cart</h1>
            <table className="items-table">
              <thead className="items-thead">
                <tr className="items-tr">
                  <th className="items-th">Product Name</th>
                  <th className="items-th">Quantity</th>
                  <th className="items-th">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart && cart.length > 0 ? (
                  <>
                    {cart.map((item) => {
                      const itemDetails = items.find(
                        (i) => i.id === item.itemId
                      );
                      return (
                        <tr className="items-tr" key={item.itemId}>
                          <td className="items-td">{itemDetails.name}</td>
                          <td className="items-td">{item.quantity}</td>
                          <td className="items-td">
                            {itemDetails.price * item.quantity}.00
                          </td>
                        </tr>
                      );
                    })}

                    <tr className="items-tr">
                      <td
                        className="items-td"
                        colSpan="2"
                        style={{ textAlign: "right" }}
                      >
                        Total:
                      </td>
                      <td className="items-td">
                        {cart.reduce((price, item) => {
                          const itemDetails = items.find(
                            (i) => i.id === item.itemId
                          );
                          return price + itemDetails.price * item.quantity;
                        }, 0)}
                        .00
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr className="items-tr">
                    <td className="items-td" colSpan="3">
                      Cart is empty.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <button className="items-button" onClick={() => placeOrder()}>
              Complete the Order
            </button>
          </div>
        </Col>
      </Row>

      {/* dialog box for add to cart */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Set Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <>
              <h5>{selectedItem.name}</h5>
              <Form>
                <Form.Group>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    value={itemCount}
                    onChange={(e) => setItemCount(Number(e.target.value))}
                    min="1"
                  />
                </Form.Group>
                {error && <Alert variant="danger">{error}</Alert>}
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Modal.Footer>
      </Modal>

      {/* dialog box for order completion */}
      <Modal show={showOrderDialog} onHide={() => setShowOrderDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Order Completion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderDetails && (
            <>
              <h5>Order ID: {orderDetails.id}</h5>
              <p>Order placed successfully!</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderDialog(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PointOfSale;
