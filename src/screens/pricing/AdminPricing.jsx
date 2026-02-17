import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Table,
  Button,
  Modal,
  Form,
  Container,
  Row,
  Col,
  Alert,
  Card,
  Pagination
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
                        <Form.Label>Margin $</Form.Label>
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
  const { pricingData, pricingPaginationData, pricingConfig, loading: contextLoading, fetchPricing: refreshData } = usePricing();
  const [searchParams, setSearchParams] = useSearchParams();
  const API_URL = `${process.env.REACT_APP_BASE_URL}/api/pricing`;
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Get initial values from URL params
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [cableTypeFilter, setCableTypeFilter] = useState(searchParams.get('cable_type') || "");
  const itemsPerPage = pricingPaginationData.per_page || 15;
  const totalPages = pricingPaginationData.last_page || 1;

  // Cable types for the filter dropdown
  const cableTypes = [
    "Push-pull cable",
    "Hydraulic Hose",
    "Universal Cable",
    "Positive Lock",
    "Precision Control",
    "Hi-Capacity",
    "Roller Cable",
    "RVC"
  ];

  // Update URL params when filters change
  useEffect(() => {
    const params = {};
    if (currentPage > 1) params.page = currentPage;
    if (searchTerm) params.search = searchTerm;
    if (cableTypeFilter) params.cable_type = cableTypeFilter;
    setSearchParams(params, { replace: true });
  }, [currentPage, searchTerm, cableTypeFilter, setSearchParams]);

  // Fetch data when filters change
  useEffect(() => {
    const params = {
      page: currentPage,
      per_page: itemsPerPage,
    };
    if (searchTerm) params.search = searchTerm;
    if (cableTypeFilter) params.cable_type = cableTypeFilter;
    
    refreshData(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, cableTypeFilter]);

  useEffect(() => {
    if (pricingPaginationData.current_page && pricingPaginationData.current_page !== currentPage) {
      setCurrentPage(pricingPaginationData.current_page);
    }
  }, [pricingPaginationData.current_page]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCableTypeChange = (e) => {
    setCableTypeFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

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

      {/* Search and Filter Controls */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Search by Part Number</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter part number..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Filter by Cable Type</Form.Label>
            <Form.Select
              value={cableTypeFilter}
              onChange={handleCableTypeChange}
            >
              <option value="">All Cable Types</option>
              {cableTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

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
        
        {/* Pagination Controls */}
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
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
