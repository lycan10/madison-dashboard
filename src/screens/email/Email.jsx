import React, { useState, useEffect, useRef, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, MoreVerticalIcon, UserAddIcon, MailIcon, CalendarIcon, ArrowLeftIcon } from "@hugeicons/core-free-icons";
import { useEmails } from "../../context/EmailContext";
import { useAuth } from "../../context/AuthContext";
import { useMembers } from "../../context/MembersContext";
import avatar from "../../assets/a4.png";
import "../order/order.css";
import "../messages/messages.css";
import "../notification/notification.css";
import "./email.css";

const Email = () => {
    const { user } = useAuth();
    const { emails, loading, pagination, fetchEmails, fetchMoreEmails, assignTaskFromEmail, connectGoogleAccount, exchangeGoogleCode, saveImapCredentials, fetchImapCredentials } = useEmails();
    const { members, fetchMembers } = useMembers();
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assigneeId, setAssigneeId] = useState("");
    const [assigneeName, setAssigneeName] = useState("");
    const emailListRef = useRef(null);
    const [showImapModal, setShowImapModal] = useState(false);
    const [hasInitialLoad, setHasInitialLoad] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sourceFilter, setSourceFilter] = useState("all");
    const [showMobileDetail, setShowMobileDetail] = useState(false);

    const [imapCredentials, setImapCredentials] = useState({
        imap_host: "",
        imap_port: "",
        imap_username: "",
        imap_password: "",
        imap_encryption: "ssl",
        
    });

    useEffect(() => {
        const handleResize = () => {
            const wasMobile = isMobileView;
            const nowMobile = window.innerWidth <= 768;
            setIsMobileView(nowMobile);
            
            if (wasMobile && !nowMobile) {
                setShowMobileDetail(false);
            }
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileView]);
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        const handleOAuthRedirect = async () => {
            if (code) {
                const success = await exchangeGoogleCode(code);
                if (success) {
                    alert('Google account connected successfully!');
                } else {
                    alert('Failed to connect Google account.');
                }
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        };

        handleOAuthRedirect();
    }, []);

    useEffect(() => {
        if (!hasInitialLoad) {
            fetchEmails(1, searchTerm, sourceFilter);
            
            if (user?.role === 'admin') {
                fetchMembers();
            }
            
            setHasInitialLoad(true);
        }
    }, [hasInitialLoad, user?.role, fetchEmails, fetchMembers]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchEmails(1, searchTerm, sourceFilter);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, sourceFilter, fetchEmails]);

    useEffect(() => {
        if (emails.length > 0 && !selectedEmail && !isMobileView) {
            setSelectedEmail(emails[0]);
        }
    }, [emails, selectedEmail, isMobileView]);

    const handleScroll = useCallback(() => {
        if (
            emailListRef.current &&
            emailListRef.current.scrollTop + emailListRef.current.clientHeight >=
            emailListRef.current.scrollHeight - 50 &&
            !loading &&
            pagination.current_page < pagination.last_page
        ) {
            fetchMoreEmails(searchTerm, sourceFilter);
        }
    }, [loading, pagination.current_page, pagination.last_page, fetchMoreEmails, searchTerm, sourceFilter]);

    useEffect(() => {
        const listRef = emailListRef.current;
        if (listRef) {
            listRef.addEventListener("scroll", handleScroll);
        }
        return () => {
            if (listRef) {
                listRef.removeEventListener("scroll", handleScroll);
            }
        };
    }, [handleScroll]);

    useEffect(() => {
        if (showImapModal && user?.role === 'admin') {
            fetchImapCredentials().then(data => {
                if (data) {
                    setImapCredentials(prev => ({
                        ...prev,
                        imap_host: data.imap_host || "",
                        imap_port: data.imap_port || "",
                        imap_username: data.imap_username || "",
                        imap_encryption: data.imap_encryption || "ssl",
                        imap_password: data.imap_password || ""
                    }));
                }
            });
        }
    }, [showImapModal, user?.role, fetchImapCredentials]);

    const handleEmailClick = (email) => {
        setSelectedEmail(email);
        console.log(email)
        const name = getAssignedMemberName(Number(email.assigned_to_user_id));
        setAssigneeName(name);
        
        if (isMobileView) {
            setShowMobileDetail(true);
        }
    };

    const handleBackToList = () => {
        if (isMobileView) {
            setShowMobileDetail(false);
        } else {
            setSelectedEmail(null);
        }
    };

    const handleAssignClick = async () => {
        if (selectedEmail && assigneeId) {
            const success = await assignTaskFromEmail(selectedEmail.id, assigneeId);
            if (success) {
                setSelectedEmail({ ...selectedEmail, status: 'assigned', assigned_to_user_id: Number(assigneeId) });
                setShowAssignModal(false);
                setAssigneeId("");
                const name = getAssignedMemberName(Number(assigneeId));
                setAssigneeName(name);
            }
        }
    };

    const handleImapChange = (e) => {
        const { name, value } = e.target;
        setImapCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleImapSubmit = async (e) => {
        e.preventDefault();
        const success = await saveImapCredentials(imapCredentials);
        if (success) {
            alert('IMAP credentials saved successfully!');
            setShowImapModal(false);
        } else {
            alert('Failed to save IMAP credentials.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'unread': return '#e74c3c';
            case 'read': return '#3498db';
            case 'assigned': return '#27ae60';
            case 'completed': return '#9b59b6';
            case 'new': return 'rgb(255, 173, 31)';
            default: return '#95a5a6';
        }
    };

    const getAssignedMemberName = (userId) => {
        const member = members.find(m => m.id === userId);
        return member ? member.name : 'Unknown User';
    };

    return (
        <div className="email-page">
            <div className="email-header">
                <div className="email-header-content">
                    <h2 className="email-title">
                        <HugeiconsIcon icon={MailIcon} size={24} color="#3498db" />
                        Emails ({pagination.total || 0})
                    </h2>

                    <div className="email-filter">
                        <input
                            type="text"
                            className="email-search-input"
                            placeholder="Search emails..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select 
                            className="source-filter-dropdown"
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.target.value)}
                            style={{
                                borderRadius: '6px',
                                fontSize: '12px',
                            }}
                        >
                            <option value="all">All Sources</option>
                            <option value="gmail">Gmail</option>
                            <option value="imap">Others</option>
                        </select>
                    </div>
                    
                    {user?.role === 'admin' && (
                        <div className="email-buttons">
                            <button 
                                className="btn-connect"
                                onClick={connectGoogleAccount}
                            >
                                Connect Gmail
                            </button>
                            <button 
                                className="btn-imap"
                                onClick={() => setShowImapModal(true)}
                            >
                                IMAP Settings
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={`email-main-content ${isMobileView && showMobileDetail ? 'mobile-show-detail' : ''}`}>
                <div className={`email-list-container ${isMobileView && showMobileDetail ? 'mobile-hide' : ''}`}>
                    <div 
                        ref={emailListRef}
                        className="email-list"
                    >
                        {emails.map((email) => (
                            <div
                                key={email.id}
                                onClick={() => handleEmailClick(email)}
                                className={`email-item ${selectedEmail?.id === email.id ? 'active' : ''}`}
                            >
                                <div className="email-item-content">
                                    <img 
                                        src={avatar} 
                                        alt={email.from_name || "Unknown"}
                                        className="email-avatar"
                                    />
                                    <div className="email-text-content">
                                        <div className="email-meta">
                                            <h6 className="email-subject-title">
                                                {email.from_name || email.from_email}
                                            </h6>
                                            <span className="email-status" style={{ backgroundColor: getStatusColor(email.status) }}>
                                                {email.status}
                                            </span>
                                        </div>
                                        <p className="email-snippet">
                                            {email.subject.length > 35 ? email.subject.slice(0, 35) + "..." : email.subject}
                                        </p>
                                        <div className="email-date-info">
                                            <span className="email-date">
                                                <HugeiconsIcon icon={CalendarIcon} size={12} />
                                                {new Date(email.created_at).toLocaleDateString()}
                                            </span>
                                            
                                        </div>
                                        <span className="email-status" style={{ backgroundColor: '#95a5a6' }}>
                                            {email.source}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="loading-text">
                                Loading more emails...
                            </div>
                        )}
                        {emails.length === 0 && !loading && (
                            <div className="no-emails-placeholder">
                                <HugeiconsIcon icon={MailIcon} size={48} />
                                <p style={{ marginTop: '16px' }}>No emails found</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`email-detail-container ${isMobileView && !showMobileDetail ? 'mobile-hide-detail' : ''}`}>
                    {selectedEmail ? (
                        <>
                            <div className="email-detail-header">
                                <div className="email-detail-header-top">
                                    <div className="email-sender-info">
                                        {isMobileView && (
                                            <button
                                                onClick={handleBackToList}
                                                className="btn-options mobile-back-btn"
                                            >
                                                <HugeiconsIcon icon={ArrowLeftIcon} size={20} />
                                            </button>
                                        )}
                                        <img 
                                            src={avatar} 
                                            alt={selectedEmail.from_name}
                                            className="email-sender-avatar"
                                        />
                                        <div className="email-sender-text">
                                            <h5 className="email-sender-name">
                                                {selectedEmail.from_name || selectedEmail.from_email}
                                            </h5>
                                            <p className="email-sender-email">
                                                {selectedEmail.from_email}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="email-actions">
                                        {user?.role === 'admin' && (
                                            <button
                                                onClick={() => setShowAssignModal(true)}
                                                className="btn-assign"
                                            >
                                                <HugeiconsIcon icon={UserAddIcon} size={16} />
                                                {isMobileView ? '' : 'Assign Task'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="email-detail-info">
                                    <div>
                                        <h4>
                                            {selectedEmail.subject}
                                        </h4>
                                        <div className="email-date-info">
                                            {selectedEmail.assigned_to_user_id ? (
                                                <div className="assigned-info">
                                                    <span>
                                                        Assigned to: {assigneeName || getAssignedMemberName(selectedEmail.assigned_to_user_id)}
                                                    </span>
                                                </div>
                                            ):
                                                (
                                                    <span className="email-status" style={{ backgroundColor: getStatusColor(selectedEmail.status) }}>
                                                        {selectedEmail.status}
                                                    </span>
                                                )
                                            }
                                            <span className="email-detail-date">
                                                <HugeiconsIcon icon={CalendarIcon} size={16} />
                                                {new Date(selectedEmail.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="email-body">
                                <div 
                                    dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                                    className="email-body-content"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="email-placeholder">
                            <HugeiconsIcon icon={MailIcon} size={64} />
                            <h3>
                                Select an email to view
                            </h3>
                            <p>Choose an email from the list to read its content</p>
                        </div>
                    )}
                </div>
            </div>
            
            <Modal
                show={showAssignModal}
                onHide={() => setShowAssignModal(false)}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <HugeiconsIcon icon={UserAddIcon} size={24} color="#27ae60" />
                            <h4 style={{ margin: 0 }}>Assign Email as Task</h4>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-body-content">
                        <h6 style={{ color: '#2c3e50', marginBottom: '8px' }}>Email Subject:</h6>
                        <p className="modal-subject-text">
                            {selectedEmail?.subject}
                        </p>
                    </div>
                    <div className="form-group">
                        <label style={{ 
                            fontWeight: '600', 
                            marginBottom: '8px', 
                            display: 'block',
                            color: '#2c3e50'
                        }}>
                            Select User to Assign
                        </label>
                        <select 
                            className="form-control" 
                            value={assigneeId} 
                            onChange={(e) => setAssigneeId(e.target.value)}
                            style={{
                                padding: '12px',
                                borderRadius: '6px',
                                border: '1px solid #ced4da',
                                fontSize: '14px',
                                width: '100%'
                            }}
                        >
                            <option value="">-- Select a user --</option>
                            {members.map(member => (
                                <option key={member.id} value={member.id}>{member.name}</option>
                            ))}
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button 
                        className="modal-footer-btn cancel"
                        onClick={() => setShowAssignModal(false)}
                    >
                        Cancel
                    </button>
                    <button 
                        className="modal-footer-btn assign"
                        onClick={handleAssignClick}
                        disabled={!assigneeId}
                    >
                        Assign Task
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showImapModal}
                onHide={() => setShowImapModal(false)}
                backdrop="static"
                keyboard={false}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h4 style={{ margin: 0 }}>IMAP Configuration</h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleImapSubmit}>
                        <div className="row">
                            <div className="col-md-8">
                                <div className="form-group mb-3">
                                    <label className="imap-form-label">
                                        IMAP Host
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control imap-input"
                                        name="imap_host"
                                        value={imapCredentials.imap_host}
                                        onChange={handleImapChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group mb-3">
                                    <label className="imap-form-label">
                                        Port
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control imap-input"
                                        name="imap_port"
                                        value={imapCredentials.imap_port}
                                        onChange={handleImapChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label className="imap-form-label">
                                Username (Email)
                            </label>
                            <input
                                type="email"
                                className="form-control imap-input"
                                name="imap_username"
                                value={imapCredentials.imap_username}
                                onChange={handleImapChange}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label className="imap-form-label">
                                Password
                            </label>
                            <input
                                type="text"
                                className="form-control imap-input"
                                name="imap_password"
                                value={imapCredentials.imap_password}
                                onChange={handleImapChange}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label className="imap-form-label">
                                Encryption
                            </label>
                            <select
                                className="form-control imap-select"
                                name="imap_encryption"
                                value={imapCredentials.imap_encryption}
                                onChange={handleImapChange}
                            >
                                <option value="ssl">SSL</option>
                                <option value="tls">TLS</option>
                                <option value="">None</option>
                            </select>
                        </div>
                        <Modal.Footer>
                            <button 
                                className="modal-footer-btn cancel"
                                type="button" 
                                onClick={() => setShowImapModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="modal-footer-btn imap-save-btn"
                                type="submit"
                            >
                                Save Configuration
                            </button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Email;