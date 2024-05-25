import React, { useState } from "react";

import Navigation from "./Navigation";

import "./css/PointOfSales.css";

function OrderHistory() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Function to add item to cart
  const addItemToCart = (item) => {
    const updatedCartItems = [...cartItems, item];
    setCartItems(updatedCartItems);
    setTotalAmount(totalAmount + item.price);
  };

  // Function to remove item from cart
  const removeItemFromCart = (index) => {
    const updatedCartItems = [...cartItems];
    const removedItem = updatedCartItems.splice(index, 1)[0];
    setCartItems(updatedCartItems);
    setTotalAmount(totalAmount - removedItem.price);
  };

  // Function to handle checkout
  const handleCheckout = () => {
    // Implement backend integration for transaction handling
    console.log("Checkout:", cartItems);
    // Reset cart after checkout
    setCartItems([]);
    setTotalAmount(0);
  };

  return (
    <>
      <Navigation />
      <div className="point-of-sale-container">
        <h1 className="point-of-sale-heading">Point of Sale</h1>
        <div className="point-of-sale-cart">
          <h2 className="point-of-sale-cart-heading2">Shopping Cart</h2>
          <ul className="point-of-sale-cart-list">
            {cartItems.map((item, index) => (
              <li key={index} className="point-of-sale-cart-item">
                {item.name} - ${item.price.toFixed(2)}
                <button
                  onClick={() => removeItemFromCart(index)}
                  className="point-of-sale-cart-button"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p className="point-of-sale-cart-total">
            Total: ${totalAmount.toFixed(2)}
          </p>
          <button
            onClick={handleCheckout}
            className="point-of-sale-cart-button"
            disabled={cartItems.length === 0}
          >
            Checkout
          </button>
        </div>

        {/* Product list for adding items to the cart */}
        <div className="point-of-sale-products">
          <h2 className="point-of-sale-products-heading2">
            Available Products
          </h2>
          <ul className="point-of-sale-products-list">
            {/* Sample product data */}
            <li className="point-of-sale-products-item">
              Product A - $10.00{" "}
              <button
                onClick={() =>
                  addItemToCart({ name: "Product A", price: 10.0 })
                }
                className="point-of-sale-products-button"
              >
                Add to Cart
              </button>
            </li>
            <li className="point-of-sale-products-item">
              Product B - $20.00{" "}
              <button
                onClick={() =>
                  addItemToCart({ name: "Product B", price: 20.0 })
                }
                className="point-of-sale-products-button"
              >
                Add to Cart
              </button>
            </li>
            {/* Add more product items here */}
          </ul>
        </div>
      </div>
    </>
  );
}

export default OrderHistory;
