import React, { useState, useEffect } from "react";
import Select from "react-select";

import Navigation from "./Navigation";
import "./css/ItemCategory.css";
import "./css/ItemsPage.css";
import { Row, Col } from "react-bootstrap";

function ItemPage() {
  // Sample initial item data

  // State to manage item data
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");

  // Add more categories as needed
  const [selectedCategory, setSelectedCategory] = useState([]); // Default to first category in list

  // Function to handle adding/editing items

  useEffect(() => {
    fetchUserData();
    fetchCatogoryData();
  }, []);
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

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/item", {
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

      setItems(data);
    } catch (error) {
      console.error("Error fetching user data: ", error);
      setItems(null);
    }
  };
  const addItem = async (item) => {
    try {
      console.log("item", item);
      const response = await fetch("http://localhost:8080/api/v1/item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      const data = await response.json();
      console.log("New item added:", data);
      fetchUserData(); // Refresh item list
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  //update item
  const updateItem = async (item) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/item/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        }
      );

      fetchUserData();
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };

  const handleAddEditItem = () => {
    if (editItem) {
      const updatedItems = items.map((item) => {
        if (item.id === editItem.id) {
          return {
            ...item,
            name: itemName,
            category: itemCategory,
            price: parseFloat(itemPrice),
            quantity: parseInt(itemQuantity),
          };
        }
        return item;
      });
      const newItem = {
        id: editItem.id,
        name: itemName,
        category: itemCategory,
        price: parseFloat(itemPrice),
        quantity: parseInt(itemQuantity),
      };
      setItems(updatedItems);
      console.log("updatedItems", newItem);

      updateItem(newItem);
    } else {
      const newItem = {
        name: itemName,
        category: itemCategory,
        price: parseFloat(itemPrice),
        quantity: parseInt(itemQuantity),
      };
      console.log("newItem", newItem);
      addItem(newItem);
    }

    resetForm();
  };

  // Function to handle editing an item
  const handleEdit = (item) => {
    setEditItem(item);
    setItemName(item.name);
    setItemCategory(item.category);
    setItemPrice(item.price.toString());
    setItemQuantity(item.quantity.toString());
  };

  // Function to handle deleting an item
  const handleDeleteItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  };

  // Function to reset form fields
  const resetForm = () => {
    setEditItem(null);
    setItemName("");
    setItemCategory("");
    setItemPrice("");
    setItemQuantity("");
  };

  return (
    <>
      <Navigation />
      <Row>
        <Col xs={8}>
          <br></br>
          <br></br>
          <div className="item-page-container">
            <h1 className="item-category-heading">Item Management</h1>
            <table className="item-category-table">
              <thead className="item-category-table-header">
                <tr className="item-category-table-header-row">
                  <th className="item-category-table-header-cell">
                    Product Name
                  </th>
                  <th className="item-category-table-header-cell">Category</th>
                  <th className="item-category-table-header-cell">Price</th>
                  <th className="item-category-table-header-cell">Quantity</th>
                  <th className="item-category-table-header-cell">Edit</th>
                  <th className="item-category-table-header-cell">Delete</th>
                </tr>
              </thead>
              {/* Display items in the table  if item not null*/}
              <tbody>
                {items &&
                  items.map((item) => (
                    <tr key={item.id}>
                      <td className="item-category-table-cell">{item.name}</td>
                      <td className="item-category-table-cell">
                        {getCategoryNameById(item.category)}
                      </td>
                      <td className="item-category-table-cell">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="item-category-table-cell">
                        {item.quantity}
                      </td>
                      <td className="item-category-table-cell">
                        <button onClick={() => handleEdit(item)}>Edit</button>
                      </td>
                      <td className="item-category-table-cell">
                        <button onClick={() => handleDeleteItem(item.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Col>
        <Col xs={4}>
          <br></br>
          <br></br>
          <div className="item-page-container">
            <h2 className="item-category-heading">
              {editItem ? "Edit Item" : "Add Item"}
            </h2>
            <ItemForm
              itemName={itemName}
              setItemName={setItemName}
              itemCategory={itemCategory}
              setItemCategory={setItemCategory}
              itemPrice={itemPrice}
              setItemPrice={setItemPrice}
              itemQuantity={itemQuantity}
              setItemQuantity={setItemQuantity}
              handleSubmit={handleAddEditItem}
              resetForm={resetForm}
              categories={selectedCategory}
            />
          </div>
          <br></br>
          <div className="item-page-container">
            <h2 className="item-category-heading">Add Category</h2>
            <CategoryPage
              fetchUserData={fetchUserData}
              fetchCatogoryData={fetchCatogoryData}
            />
          </div>
        </Col>
      </Row>
    </>
  );
}

function ItemForm({
  itemName,
  setItemName,
  itemCategory,
  setItemCategory,
  itemPrice,
  setItemPrice,
  itemQuantity,
  setItemQuantity,
  handleSubmit,
  resetForm,
  categories,
}) {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleReset = () => {
    resetForm();
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.catName,
  }));

  console.log("categoryOptions", categories);
  return (
    <form onSubmit={handleFormSubmit} className="item-category-form">
      <label htmlFor="itemName" className="item-category-label">
        Product Name:
      </label>
      <input
        type="text"
        id="itemName"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        required
        className="item-category-input"
      />
      <br />
      <label htmlFor="itemCategory" className="item-category-label">
        Category:
      </label>

      <Select
        id="itemCategory"
        value={categoryOptions.find((option) => option.value === itemCategory)}
        onChange={(selectedOption) => setItemCategory(selectedOption.value)}
        options={categoryOptions}
        className="item-category-input-select"
      />
      <br />
      <label htmlFor="itemPrice" className="item-category-label">
        Price:
      </label>
      <input
        type="number"
        id="itemPrice"
        value={itemPrice}
        onChange={(e) => setItemPrice(e.target.value)}
        step="0.01"
        required
        className="item-category-input"
      />
      <br />
      <label htmlFor="itemQuantity" className="item-category-label">
        Quantity:
      </label>
      <input
        type="number"
        id="itemQuantity"
        value={itemQuantity}
        onChange={(e) => setItemQuantity(e.target.value)}
        required
        className="item-category-input"
      />
      <br />
      <button type="submit" className="item-category-btn">
        {itemName ? "Edit" : "Add"} Item
      </button>
      <button type="button" onClick={handleReset} className="item-category-btn">
        Reset
      </button>
    </form>
  );
}

function CategoryPage({ fetchUserData, fetchCatogoryData }) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const addCategory = async (category) => {
    console.log("category", category);
    try {
      const response = await fetch("http://localhost:8080/api/v1/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });
      const data = await response.json();
      console.log("New category added:", data);
      fetchUserData();
      fetchCatogoryData();
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCategory = {
      catName: categoryName,
      cat_description: categoryDescription,
    };
    addCategory(newCategory);
    resetForm();
  };

  const resetForm = () => {
    setCategoryName("");
    setCategoryDescription("");
  };

  return (
    <div className="category-page-container">
      <h2 className="category-heading">Add Category</h2>
      <form onSubmit={handleSubmit} className="item-category-form">
        <label htmlFor="categoryName" className="item-category-label">
          Category Name:
        </label>
        <input
          type="text"
          id="categoryName"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
          className="item-category-input"
        />
        <br />
        <label htmlFor="categoryDescription" className="item-category-label">
          Description:
        </label>
        <textarea
          id="categoryDescription"
          value={categoryDescription}
          onChange={(e) => setCategoryDescription(e.target.value)}
          required
          className="item-category-input"
        />
        <br />
        <button type="submit" className="category-btn">
          Add Category
        </button>
        <button type="button" onClick={resetForm} className="category-btn">
          Reset
        </button>
      </form>
    </div>
  );
}

export default ItemPage;
