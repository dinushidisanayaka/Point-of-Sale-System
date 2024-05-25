import React from 'react'
import { Link } from 'react-router-dom'
import "./css/Dashboard.css"


function Dashboard() {
  return (
    
    <div className='dashboard-container'>
      

    <button className='dashboard-btn'><Link to={"/items"} className='dashboard-link'>Items</Link></button>
    <button className='dashboard-btn'> <Link to={"/item-categories"} className='dashboard-link'>Item Categories</Link></button>
    <button className='dashboard-btn'> <Link to={"/stock-management"} className='dashboard-link'>Stock Management</Link></button>
    <button className='dashboard-btn'><Link to={"/point-of-sale"} className='dashboard-link'>Point of Sale</Link></button>

    </div>
    
  )
}

export default Dashboard