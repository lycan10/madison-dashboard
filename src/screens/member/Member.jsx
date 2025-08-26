import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Edit01Icon, Delete01Icon, Cancel02Icon, MoreVerticalIcon, Message01Icon } from "@hugeicons/core-free-icons";
import { useMembers } from "../../context/MembersContext";
import { useAuth } from "../../context/AuthContext";
import { useMessages } from "../../context/MessageContext";
import avatar from "../../assets/a4.png";
import "./member.css";

const Members = () => {
    const { members, loading, error, fetchMembers, createMember, updateMember, banMember, unbanMember, deleteMember } = useMembers();
    const { user } = useAuth();
    const { createDirectConversation } = useMessages();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentMember, setCurrentMember] = useState(null);
    const [showMenu, setShowMenu] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "staff",
        profile_picture: null,
    });

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const handleNewMemberChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        for (const key in formData) {
            form.append(key, formData[key]);
        }
        await createMember(form);
        setShowCreateModal(false);
        setFormData({ name: "", first_name: "", last_name: "", email: "", password: "", role: "staff", profile_picture: null });
    };

    const handleEditClick = (member) => {
        setCurrentMember(member);
        setFormData({
            name: member.name,
            first_name: member.first_name,
            last_name: member.last_name,
            email: member.email,
            password: "",
            role: member.role,
            profile_picture: null
        });
        setShowEditModal(true);
        setShowMenu({});
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        for (const key in formData) {
            if (formData[key]) {
                form.append(key, formData[key]);
            }
        }
        form.append('_method', 'PUT'); // Necessary for Laravel to handle PUT with FormData
        await updateMember(currentMember.id, form);
        setShowEditModal(false);
        setCurrentMember(null);
    };

    const handleDeleteClick = async (memberId) => {
        if (window.confirm("Are you sure you want to delete this member?")) {
            await deleteMember(memberId);
        }
        setShowMenu({});
    };

    const handleBanClick = async (memberId) => {
        if (window.confirm("Are you sure you want to ban this member?")) {
            await banMember(memberId);
        }
        setShowMenu({});
    };

    const handleUnbanClick = async (memberId) => {
        if (window.confirm("Are you sure you want to unban this member?")) {
            await unbanMember(memberId);
        }
        setShowMenu({});
    };

    const handleStartChatClick = async (memberId) => {
        await createDirectConversation(memberId);
        setShowMenu({});
    };

    const toggleMenu = (memberId) => {
        setShowMenu(prev => ({ [memberId]: !prev[memberId] }));
    };
    
    return (
        <div className="members-page">
            <div className="members-header">
                <h3>Members</h3>
                {user?.role === 'admin' && (
                    <div className="rightsidebar-button" onClick={() => setShowCreateModal(true)}>
                        <HugeiconsIcon icon={Add01Icon} size={16} color="#ffffff" strokeWidth={3} />
                        <p>Create Member</p>
                    </div>
                )}
            </div>

            <div className="members-list-container">
                {loading ? (
                    <p>Loading members...</p>
                ) : (
                    <table className="members-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(member => (
                                <tr key={member.id}>
                                    <td>
                                        <div className="member-info">
                                            <img src={member.profile_picture ? `${process.env.REACT_APP_BASE_URL}/storage/${member.profile_picture}` : avatar} alt="Profile" className="member-avatar" />
                                            <div>
                                                <p className="member-name">{member.name}</p>
                                                <small>{member.email}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{member.role}</td>
                                    <td>
                                        <span className={`member-status status-${member.status}`}>{member.status}</span>
                                    </td>
     
                                        {user?.role === 'admin' && (
                                        <td>
                                        {/* Remove the action-menu-container and its contents */}
                                        {user?.role === 'admin' && (
                                             <div className="action-buttons" style={{ display: "flex", gap: "8px" }}>
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => handleEditClick(member)}
                                                >
                                                    <HugeiconsIcon icon={Edit01Icon} size={16} /> Edit
                                                </button>
                                                {member.status === 'active' ? (
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => handleBanClick(member.id)}
                                                    >
                                                        <HugeiconsIcon icon={Cancel02Icon} size={16} /> Ban
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => handleUnbanClick(member.id)}
                                                    >
                                                        <HugeiconsIcon icon={Cancel02Icon} size={16} /> Unban
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                        )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create Member Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Create New Member</Modal.Title></Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleCreateSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleNewMemberChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleNewMemberChange} required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleNewMemberChange} required />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select name="role" value={formData.role} onChange={handleNewMemberChange} required>
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Profile Picture</label>
                            <input type="file" name="profile_picture" onChange={handleNewMemberChange} />
                        </div>
                        <button type="submit" className="btn-primary">Create</button>
                    </form>
                </Modal.Body>
            </Modal>
            
            {/* Edit Member Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Edit Member</Modal.Title></Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleNewMemberChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleNewMemberChange} required />
                        </div>
                        <div className="form-group">
                            <label>New Password (Optional)</label>
                            <input type="password" name="password" value={formData.password} onChange={handleNewMemberChange} />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select name="role" value={formData.role} onChange={handleNewMemberChange} required>
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Profile Picture</label>
                            <input type="file" name="profile_picture" onChange={handleNewMemberChange} />
                        </div>
                        <button type="submit" className="btn-primary">Save Changes</button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Members;