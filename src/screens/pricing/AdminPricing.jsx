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
  Pagination,
  InputGroup,
  Badge
} from "react-bootstrap";
import { usePricing } from "../../context/PricingContext";

// --- Global Config Form (UI Updated, Logic Preserved) ---
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
            {message && <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>{message.text}</Alert>}
            
            <div className="p-2">
                <h6 className="text-muted mb-3 text-uppercase small fw-bold">Cost Factors</h6>
                <Row className="g-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className="small text-secondary">Tariff (%)</Form.Label>
                            <InputGroup>
                                <Form.Control type="number" step="0.01" name="tariff_percent" value={formData.tariff_percent} onChange={handleChange} />
                                <InputGroup.Text className="bg-light">%</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className="small text-secondary">Overhead (%)</Form.Label>
                             <InputGroup>
                                <Form.Control type="number" step="0.01" name="overhead_percent" value={formData.overhead_percent} onChange={handleChange} />
                                <InputGroup.Text className="bg-light">%</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className="small text-secondary">Labor Cost ($)</Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="bg-light">$</InputGroup.Text>
                                <Form.Control type="number" step="0.01" name="labor_cost" value={formData.labor_cost} onChange={handleChange} />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className="small text-secondary">Misc Cost ($)</Form.Label>
                             <InputGroup>
                                <InputGroup.Text className="bg-light">$</InputGroup.Text>
                                <Form.Control type="number" step="0.01" name="misc_cost" value={formData.misc_cost} onChange={handleChange} />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>

                <hr className="my-4" />
                
                <h6 className="text-muted mb-3 text-uppercase small fw-bold">Profitability</h6>
                <Row>
                     <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small text-secondary">Margin ($)</Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="bg-light">$</InputGroup.Text>
                                <Form.Control type="number" step="0.01" name="margin_percent" value={formData.margin_percent} onChange={handleChange} />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end mt-4">
                    <Button type="submit" variant="primary" className="px-4">Save Configuration</Button>
                </div>
            </div>
        </Form>
    );
};

// --- Main Component ---
const AdminPricing = () => {
  const { pricingData, pricingPaginationData, pricingConfig, loading: contextLoading, fetchPricing: refreshData } = usePricing();
  const [searchParams, setSearchParams] = useSearchParams();
  const API_URL = `${process.env.REACT_APP_BASE_URL}/api/pricing`;
  const [showModal, setShowModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const fileInputRef = React.useRef(null);
  
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
    "T Handle",
    "Positive Lock",
    "Quick Disconnect",
    "Quick Connect",
    "PTO Cable",
    "Shift Cable",
    "RVC",
    "SMT Cable"
  ];

  // --- LOGIC SECTION: EXACTLY AS ORIGINAL ---

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



  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const handleExport = () => {
    window.location.href = `${process.env.REACT_APP_BASE_URL}/api/pricing/export`;
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/pricing/import`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage(result.message);
        refreshData();
      } else {
        throw new Error(result.error || 'Import failed');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // --- UI RENDER SECTION: UPDATED ---
  return (
    <Container fluid className="py-5 px-4 bg-light min-vh-100">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Pricing Management</h2>
          <p className="text-muted mb-0">Manage parts, prices, and global configuration</p>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Button variant="outline-primary" onClick={handleExport}>
            <i className="bi bi-download me-2"></i>Export
          </Button>
          
          <Button variant="outline-success" onClick={() => fileInputRef.current.click()}>
            <i className="bi bi-upload me-2"></i>Import
          </Button>
          <input 
              type="file" 
              accept=".csv" 
              hidden 
              ref={fileInputRef}
              onChange={handleImport}
          />
          
          <Button variant="dark" onClick={() => setShowConfigModal(true)}>
            <i className="bi bi-gear me-2"></i>Settings
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)} className="shadow-sm">{error}</Alert>}
      {successMessage && <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)} className="shadow-sm">{successMessage}</Alert>}

      {/* Search and Filter Card */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold small text-muted">Search Part Number</Form.Label>
                <InputGroup>
                    <InputGroup.Text className="bg-white border-end-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search text-muted" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </InputGroup.Text>
                    <Form.Control 
                        type="text" 
                        className="border-start-0 ps-0"
                        placeholder="Type to search..." 
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold small text-muted">Filter by Category</Form.Label>
                <Form.Select
                  value={cableTypeFilter}
                  onChange={handleCableTypeChange}
                  className="form-select"
                >
                  <option value="">All Cable Types</option>
                  {cableTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Data Table Card */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
            {contextLoading ? (
                <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading pricing data...</p>
                </div>
            ) : (
                <>
                <div className="table-responsive">
                    <Table hover className="align-middle mb-0" style={{ minWidth: '600px' }}>
                        <thead className="bg-light">
                        <tr>
                            <th className="py-3 ps-4 border-0 text-secondary text-uppercase small fw-bold">Part Number</th>
                            <th className="py-3 border-0 text-secondary text-uppercase small fw-bold">Unit Price</th>
                            <th className="py-3 pe-4 border-0 text-secondary text-uppercase small fw-bold text-end">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pricingData.length > 0 ? (
                            pricingData.map((item) => (
                                <tr key={item.id} className="border-bottom">
                                <td className="ps-4 fw-medium text-dark">{item.part_number}</td>
                                <td>
                                    <Badge bg="light" text="dark" className="border px-3 py-2 fs-6 fw-normal">
                                        ${parseFloat(item.unit_price).toFixed(2)}
                                    </Badge>
                                </td>
                                <td className="pe-4 text-end">
                                    <Button
                                    variant="link"
                                    className="text-decoration-none fw-bold"
                                    style={{ color: 'var(--text-color2)' }}
                                    onClick={() => handleShowModal(item)}
                                    >
                                    Edit Price
                                    </Button>
                                </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-5 text-muted">
                                    No pricing data found matching your criteria.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </div>
                
                {/* Pagination Footer */}
                <div className="d-flex justify-content-between align-items-center p-4 border-top">
                    <div className="text-muted small">
                        Page {currentPage} of {totalPages}
                    </div>
                    <Pagination className="mb-0">
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
        </Card.Body>
      </Card>

      {/* Edit Price Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Update Price</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-4">
          {editingItem && (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label className="small text-muted text-uppercase fw-bold">Part Number</Form.Label>
                <Form.Control 
                    type="text" 
                    value={editingItem.part_number} 
                    readOnly 
                    disabled 
                    className="bg-light"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="small text-muted text-uppercase fw-bold">New Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  autoFocus
                  className="form-control-lg"
                />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2 pt-2">
                <Button variant="light" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="px-4">
                  Save Changes
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Global Config Modal */}
      <Modal show={showConfigModal} onHide={() => setShowConfigModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Global Pricing Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pricingConfig && (
            <GlobalConfigForm config={pricingConfig} onUpdate={() => {
              refreshData();
              setShowConfigModal(false);
            }} />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminPricing;