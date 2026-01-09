import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { usePricing } from "../../context/PricingContext";
//import "./adminpricing.css";

const AdminPricing = () => {
  const { pricingData, loading: contextLoading, fetchPricing: refreshData } = usePricing();
  const [items, setItems] = useState([]); 
  const [loading, setLoading] = useState(false);
  const API_URL = "http://127.0.0.1:8000/api/pricing";
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    category: "pushpull",
    sub_category: "",
    component_type: "",
    specific_type: "",
    travel: "",
    part_number: "",
    unit_price: "",
    description: "",
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    setItems(pricingData);
  }, [pricingData]);

  // Handle fetch is now handled by context, but we might want to refresh on mount or just use data.
  // Context handles initial fetch.
  // We can remove local fetchItems function or keep it if it calls refreshData from context.

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
      // We can use refreshData from context if we want to force refresh
     await refreshData();
  };

  const handleShowModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({
        category: "pushpull",
        sub_category: "3", // Default
        component_type: "conduit", // Default
        specific_type: "",
        travel: "",
        part_number: "",
        unit_price: "",
        description: "",
      });
    }
    setShowModal(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const url = editingItem ? `${API_URL}/${editingItem.id}` : API_URL;
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save item");
      }

      setSuccessMessage(
        editingItem ? "Item updated successfully!" : "Item added successfully!"
      );
      refreshData();
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/${itemToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete item");

      setSuccessMessage("Item deleted successfully!");
      refreshData();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <h2>Admin Pricing Management</h2>
        </Col>
        <Col className="text-end ">
          <Button 
            variant="primary" 
            onClick={() => handleShowModal()}
            style={{ width: '140px' }}
          >
            Add New Item
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Type</th>
                <th>Specific</th>
                <th>Travel</th>
                <th>Part Number</th>
                <th>Unit Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pricingData.map((item) => (
                <tr key={item.id}>
                  <td>{item.category}</td>
                  <td>{item.sub_category}</td>
                  <td>{item.component_type}</td>
                  <td>{item.specific_type}</td>
                  <td>{item.travel}</td>
                  <td>{item.part_number}</td>
                  <td>${item.unit_price}</td>
                  <td>{item.description}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(item)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingItem ? "Edit Item" : "Add New Item"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="pushpull">Push-Pull Cable</option>
                    <option value="hoses">Hoses</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Part Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="part_number"
                    value={formData.part_number}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sub Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="sub_category"
                    value={formData.sub_category}
                    onChange={handleChange}
                    placeholder="e.g. 3, 4, standard"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Component Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="component_type"
                    value={formData.component_type}
                    onChange={handleChange}
                    placeholder="e.g. conduit, core, hubs"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Specific Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="specific_type"
                    value={formData.specific_type}
                    onChange={handleChange}
                    placeholder="e.g. bulkhead"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Travel</Form.Label>
                  <Form.Control
                    type="number"
                    name="travel"
                    value={formData.travel}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Unit Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="unit_price"
                    value={formData.unit_price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this item?
          <br />
          <strong>
            {itemToDelete?.part_number} - {itemToDelete?.description}
          </strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPricing;
