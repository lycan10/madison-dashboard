import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import './order.css'; 
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Add01Icon,
    Settings01Icon,
    TruckFast01Icon,
    Send01Icon,
    CheckCircle01Icon,
    CheckVerified02Icon,
    ClockCircleIcon
  } from "@hugeicons/core-free-icons";

const Order = () => {
  const [show, setShow] = useState(false);
  const [orderData, setOrderData] = useState({
    partName: '',
    quantity: 1,
    vendor: '',
    status: 'New Order',
  });

  const [orders, setOrders] = useState([
    { id: 1, partName: 'Axle Bolt', quantity: 5, vendor: 'Dexter Parts', status: 'New Order' },
    { id: 2, partName: 'Brake Pads', quantity: 12, vendor: 'Trailer Pro', status: 'In Transit' },
    { id: 3, partName: 'LED Tail Lights', quantity: 8, vendor: 'Optronics', status: 'Order Complete' },
  ]);

  const getStatusStyles = (status) => {
    switch (status) {
      case "New Order":
        return { color: "#FFA500", bgColor: "#FFF5E6", };
  
      case "Processing":
        return { color: "#007BFF", bgColor: "#E6F0FF",  };
  
      case "Shipped":
        return { color: "#17A2B8", bgColor: "#E0F7FA", };
  
      case "Delivered":
        return { color: "#28a745", bgColor: "#E8F6EA", };
  
      case "Order Complete":
        return { color: "#20c997", bgColor: "#E6FFFA",  };
  
      default:
        return { color: "#6c757d", bgColor: "#f8f9fa", };
    }
  };
  
  

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const increaseQuantity = () => {
    setOrderData((prevData) => ({
      ...prevData,
      quantity: prevData.quantity + 1,
    }));
  };

  const decreaseQuantity = () => {
    if (orderData.quantity > 1) {
      setOrderData((prevData) => ({
        ...prevData,
        quantity: prevData.quantity - 1,
      }));
    }
  };

  const handleSubmit = () => {
    const newOrder = {
      id: orders.length + 1,
      ...orderData,
    };
    setOrders([...orders, newOrder]);
    setOrderData({ partName: '', quantity: 1, vendor: '' });
    handleClose();
  };

  return (
    <div className="order-page">
            <div className="rightsidebar-navbar">
                    <h3>Total Trailer</h3>
                    <div className="rightsidebar-button" onClick={handleShow}>
                    <HugeiconsIcon icon={Add01Icon} size={16} color='#ffffff' strokeWidth={3}/>
                    <p>New Order</p>
                </div>
                </div>
     
<div className="order-page-title">
<h3>Order List</h3>
</div>
     
      <table className="order-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Part Name</th>
            <th>Quantity</th>
            <th>Vendor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
  {orders.map((order) => {
    const { color, bgColor, icon: StatusIcon } = getStatusStyles(order.status);

    return (
      <tr key={order.id}>
        <td>{order.id}</td>
        <td>{order.partName}</td>
        <td>{order.quantity}</td>
        <td>{order.vendor}</td>
        <td>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color,
              backgroundColor: bgColor,
              padding: "4px 8px",
              borderRadius: "4px",
              fontWeight: 500,
              width: "fit-content"
            }}
          >
            {/* <HugeiconsIcon icon={StatusIcon} size={16} strokeWidth={2.5} /> */}
            {order.status}
          </div>
        </td>
      </tr>
    );
  })}
</tbody>

      </table>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Order</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form className="custom-form">
            <div className="form-group">
              <label>Part Name</label>
              <input
                type="text"
                name="partName"
                className="input-field"
                value={orderData.partName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <div className="quantity-container">
                <button type="button" className="quantity-btn" onClick={decreaseQuantity}>-</button>
                <input
                  type="text"
                  name="quantity"
                  className="input-field quantity-input"
                  value={orderData.quantity}
                  readOnly
                />
                <button type="button" className="quantity-btn" onClick={increaseQuantity}>+</button>
              </div>
            </div>

            <div className="form-group">
              <label>Vendor</label>
              <input
                type="text"
                name="vendor"
                className="input-field"
                value={orderData.vendor}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
  <label>Status</label>
  <select
    name="status"
    className="input-field"
    value={orderData.status}
    onChange={handleChange}
  >
    <option>New Order</option>
    <option>Processing</option>
    <option>Shipped</option>
    <option>Delivered</option>
    <option>Order Complete</option>
  </select>
</div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <button className="btn-secondary" onClick={handleClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>Save</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Order;
