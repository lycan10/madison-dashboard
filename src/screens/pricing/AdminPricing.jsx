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
  Card
} from "react-bootstrap";
import { usePricing } from "../../context/PricingContext";

const GlobalConfigForm = ({ config, onUpdate }) => {
    const { updateConfig } = usePricing();
    const [formData, setFormData] = useState({
        tariff_percent: config.tariff_percent,
        labor_cost: config.labor_cost,
        overhead_percent: config.overhead_percent,
        misc_cost: config.misc_cost,
        margin_percent: config.margin_percent,
    });
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            await updateConfig(formData);
            setMessage({ type: 'success', text: 'Configuration updated successfully!' });
            onUpdate();
        } catch (err) {
            setMessage({ type: 'danger', text: 'Failed to update config: ' + err.message });
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {message && <Alert variant={message.type}>{message.text}</Alert>}
            <Row>
                <Col md={2}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tariff %</Form.Label>
                        <Form.Control type="number" step="0.01" name="tariff_percent" value={formData.tariff_percent} onChange={handleChange} />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group className="mb-3">
                        <Form.Label>Labor Cost $</Form.Label>
                        <Form.Control type="number" step="0.01" name="labor_cost" value={formData.labor_cost} onChange={handleChange} />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group className="mb-3">
                        <Form.Label>Overhead %</Form.Label>
                        <Form.Control type="number" step="0.01" name="overhead_percent" value={formData.overhead_percent} onChange={handleChange} />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group className="mb-3">
                        <Form.Label>Misc Cost $</Form.Label>
                        <Form.Control type="number" step="0.01" name="misc_cost" value={formData.misc_cost} onChange={handleChange} />
                    </Form.Group>
                </Col>
                 <Col md={2}>
                    <Form.Group className="mb-3">
                        <Form.Label>Margin %</Form.Label>
                        <Form.Control type="number" step="0.01" name="margin_percent" value={formData.margin_percent} onChange={handleChange} />
                    </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-center">
                    <Button type="submit" variant="primary" className="mt-3">Save Config</Button>
                </Col>
            </Row>
        </Form>
    );
};

const AdminPricing = () => {
  const { pricingData, pricingConfig, loading: contextLoading, fetchPricing: refreshData } = usePricing();
  const API_URL = "http://127.0.0.1:8000/api/pricing";
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    // Fetch data on mount to ensure backend data is loaded
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowModal = (item) => {
    setEditingItem(item);
    setNewPrice(item.unit_price);
    setShowModal(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setNewPrice("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${API_URL}/${editingItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editingItem,
          unit_price: newPrice,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update price");
      }

      setSuccessMessage("Price updated successfully!");
      await refreshData();
      handleCloseModal();
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
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {contextLoading ? (
        <p>Loading...</p>
      ) : (
        <>
        <div style={{ background: "#f8f9fa", padding: "15px", marginBottom: "20px", borderRadius: "8px" }}>
            <h4>Global Pricing Configuration</h4>
            {pricingConfig && (
                <GlobalConfigForm config={pricingConfig} onUpdate={refreshData} />
            )}
        </div>

        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Part Number</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pricingData.map((item) => (
                <tr key={item.id}>
                  <td>{item.part_number}</td>
                  <td>${parseFloat(item.unit_price).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleShowModal(item)}
                    >
                      Update Price
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        </>
      )}

      {/* Edit Price Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Price</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Part Number</Form.Label>
              <Form.Control
                type="text"
                value={editingItem?.part_number || ""}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                required
                autoFocus
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
                Update Price
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminPricing;
