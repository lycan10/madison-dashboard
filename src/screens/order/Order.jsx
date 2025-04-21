import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import './order.css'; 
import { HugeiconsIcon } from '@hugeicons/react';
import Pagination from 'react-bootstrap/Pagination';
import {
    Add01Icon,
  } from "@hugeicons/core-free-icons";
import ProgressFilter from '../../components/progressfilter/ProgressFilter';

const orderDataList = [
  { id: 1, partName: 'Axle Bolt', quantity: 5, vendor: 'Dexter Parts', status: 'New Order' },
  { id: 2, partName: 'Brake Pads', quantity: 12, vendor: 'Trailer Pro', status: 'Processing' },
  { id: 3, partName: 'LED Tail Lights', quantity: 8, vendor: 'Optronics', status: 'Shipped' },
  { id: 4, partName: 'Suspension Kit', quantity: 3, vendor: 'Redneck Trailer', status: 'Delivered' },
  { id: 5, partName: 'Hub Assembly', quantity: 6, vendor: 'Buyers Products', status: 'Order Complete' },
  { id: 6, partName: 'Trailer Jack', quantity: 4, vendor: 'Southwest Wheel', status: 'New Order' },
  { id: 7, partName: 'Trailer Coupler', quantity: 2, vendor: 'Pacific Rim', status: 'Processing' },
  { id: 8, partName: 'Safety Chains', quantity: 10, vendor: 'Trailer Source', status: 'Shipped' },
  { id: 9, partName: 'Reflectors', quantity: 15, vendor: 'ReflectTech', status: 'Delivered' },
  { id: 10, partName: 'Hitch Ball', quantity: 7, vendor: 'CURT Manufacturing', status: 'Order Complete' },
];




const Order = () => {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);


  const [orderData, setOrderData] = useState({
    partName: '',
    quantity: 1,
    vendor: '',
    status: 'New Order',
  });
  const [orders, setOrders] = useState(orderDataList);

  const [selectedStatus, setSelectedStatus] = useState("All");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const getStatusStyles = (status) => {
    switch (status) {
      case "New Order":
        return { color: "#FFA500", bgColor: "#FFF5E6" };
      case "Processing":
        return { color: "#007BFF", bgColor: "#E6F0FF" };
      case "Shipped":
        return { color: "#17A2B8", bgColor: "#E0F7FA" };
      case "Delivered":
        return { color: "#28a745", bgColor: "#E8F6EA" };
      case "Order Complete":
        return { color: "#20c997", bgColor: "#E6FFFA" };
      default:
        return { color: "#6c757d", bgColor: "#f8f9fa" };
    }
  };

  const countByStatus = (status) =>
    orders.filter((item) => item.status.toLowerCase() === status.toLowerCase()).length;
  
  const handleFilterClick = (status) => {
    setSelectedStatus(status);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const increaseQuantity = () => {
    setOrderData((prevData) => ({ ...prevData, quantity: prevData.quantity + 1 }));
  };

  const decreaseQuantity = () => {
    if (orderData.quantity > 1) {
      setOrderData((prevData) => ({ ...prevData, quantity: prevData.quantity - 1 }));
    }
  };

  const handleSubmit = () => {
    const newOrder = { id: orders.length + 1, ...orderData };
    setOrders([...orders, newOrder]);
    setOrderData({ partName: '', quantity: 1, vendor: '', status: 'New Order' });
    handleClose();
  };

  const filteredOrders =
  selectedStatus === "All"
    ? orders
    : orders.filter(order => order.status === selectedStatus);

    const statuses = ["All", "New Order", "Processing", "Shipped", "Delivered", "Order Complete"];

  return (
   
    <div className="order-page">
      <div className="rightsidebar-navbar">
        <h3>Total Trailer</h3>
        <div className="rightsidebar-button" onClick={handleShow}>
          <HugeiconsIcon icon={Add01Icon} size={16} color='#ffffff' strokeWidth={3} />
          <p>New Order</p>
        </div>
      </div>

      <div className="order-page-title">
        <h3>Order List</h3>
      </div>

      <div className="custom-line no-margin"></div>



<div className="rightsidebar-filter-progress">
  {statuses.map((status) => (
    <div
      key={status}
      onClick={() => setSelectedStatus(status)}
      style={{ cursor: 'pointer' }}
    >
      <ProgressFilter
        title={status}
        count={status === "All" ? orders.length : orders.filter(order => order.status === status).length}
        bgColor={selectedStatus === status ? '#333' : '#f1f1f1'}
        color={selectedStatus === status ? '#fff' : '#000'}
      />
    </div>
  ))}
</div>


<div className="order-table-container">
      <table className="order-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Part Name</th>
            <th>Quantity</th>
            <th>Vendor</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {filteredOrders.map((order) => {
    const { color, bgColor } = getStatusStyles(order.status);
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
              width: "fit-content",
            }}
          >
            {order.status}
          </div>
        </td>
        <td>
          <div className="action-buttons" style={{ display: "flex", gap: "8px" }}>
            <button
              className="edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                setOrderData(order);
                handleShow2();
              }}
            >
              Edit
            </button>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                setOrders(prev => prev.filter(o => o.id !== order.id));
              }}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    );
  })}
</tbody>

      </table>
      <div className="custom-grid-pagination table">
          <Pagination>
                  <Pagination.First />
                  <Pagination.Prev />
                  <Pagination.Item>{1}</Pagination.Item>
                  <Pagination.Ellipsis />
                  <Pagination.Item>{10}</Pagination.Item>
                  <Pagination.Item>{11}</Pagination.Item>
                  <Pagination.Item active>{12}</Pagination.Item>
                  <Pagination.Item>{13}</Pagination.Item>
                  <Pagination.Item disabled>{14}</Pagination.Item>
                  <Pagination.Ellipsis />
                  <Pagination.Item>{20}</Pagination.Item>
                  <Pagination.Next />
                  <Pagination.Last />
                </Pagination>
                </div>
      </div>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title > <h3>Add New Order</h3> </Modal.Title>
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
  <label>Quantity</label>
  <div className="quantity-container">
    <button type="button" className="quantity-btn" onClick={decreaseQuantity}>-</button>
    <input
      type="number"
      name="quantity"
      className="input-field quantity-input"
      value={orderData.quantity}
      onChange={(e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) {
          setOrderData((prev) => ({ ...prev, quantity: value }));
        }
      }}
    />
    <button type="button" className="quantity-btn" onClick={increaseQuantity}>+</button>
  </div>
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

      <Modal show={show2} onHide={handleClose2} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title > <h3>Edit Order</h3> </Modal.Title>
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
  <label>Quantity</label>
  <div className="quantity-container">
    <button type="button" className="quantity-btn" onClick={decreaseQuantity}>-</button>
    <input
      type="number"
      name="quantity"
      className="input-field quantity-input"
      value={orderData.quantity}
      onChange={(e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) {
          setOrderData((prev) => ({ ...prev, quantity: value }));
        }
      }}
    />
    <button type="button" className="quantity-btn" onClick={increaseQuantity}>+</button>
  </div>
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
          <button className="btn-secondary" onClick={handleClose2}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>Save</button>
        </Modal.Footer>
      </Modal>
    </div>

  );
};

export default Order;