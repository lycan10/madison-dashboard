import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Edit01Icon, Cancel02Icon } from "@hugeicons/core-free-icons";
import { useMembers } from "../../context/MembersContext";
import { useAuth } from "../../context/AuthContext";
import { useMessages } from "../../context/MessageContext";
import avatar from "../../assets/a4.png";
import "./member.css";

const initialFormData = {
  name: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  role: "staff",
  profile_picture: null,
};

const Members = () => {
  const { members, loading, error, fetchMembers, createMember, updateMember, banMember, unbanMember, deleteMember } = useMembers();
  const { user } = useAuth();
  const { createDirectConversation } = useMessages();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [showMenu, setShowMenu] = useState({});
  const [formData, setFormData] = useState(initialFormData);

  const createFileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleNewMemberChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetCreateForm = () => {
    setFormData(initialFormData);
    if (createFileInputRef.current) {
      createFileInputRef.current.value = "";
    }
  };

  const resetEditForm = () => {
    setFormData(initialFormData);
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
    setCurrentMember(null);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    for (const key in formData) {
      const val = formData[key];
      if (val === null || val === "") continue;

      if (key === "profile_picture") {
        if (val instanceof File) {
          form.append("profile_picture", val);
        }
      } else {
        form.append(key, val);
      }
    }

    try {
      await createMember(form);
      resetCreateForm();
      setShowCreateModal(false);
    } catch (err) {
      console.error("Create member failed", err);
    }
  };

  const handleEditClick = (member) => {
    setCurrentMember(member);
    setFormData({
      name: member.name || "",
      first_name: member.first_name || "",
      last_name: member.last_name || "",
      email: member.email || "",
      password: "",
      role: member.role || "staff",
      profile_picture: null,
    });
    if (editFileInputRef.current) editFileInputRef.current.value = "";
    setShowEditModal(true);
    setShowMenu({});
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!currentMember) return;

    const form = new FormData();

    for (const key in formData) {
      const val = formData[key];
      if (val === null || val === "") continue;

      if (key === "profile_picture") {
        if (val instanceof File) {
          form.append("profile_picture", val);
        }
      } else {
        form.append(key, val);
      }
    }

    form.append("_method", "PUT");

    try {
      await updateMember(currentMember.id, form);
      resetEditForm();
      setShowEditModal(false);
    } catch (err) {
      console.error("Update member failed", err);
    }
  };

  return (
    <div className="members-page">
      <div className="members-header">
        <h3>Members</h3>
        {user?.role === "admin" && (
          <div className="rightsidebar-button " onClick={() => setShowCreateModal(true)}>
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
              {members.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="member-info">
                      <img
                        src={member.profile_picture ? `${process.env.REACT_APP_BASE_URL}/storage/${member.profile_picture}` : avatar}
                        alt="Profile"
                        className="member-avatar"
                      />
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
                  {user?.role === "admin" && (
                    <td>
                      <div className="action-buttons" style={{ display: "flex", gap: "8px" }}>
                        <button className="edit-btn" onClick={() => handleEditClick(member)}>
                          <HugeiconsIcon icon={Edit01Icon} size={16} /> Edit
                        </button>
                        {member.status === "active" ? (
                          <button className="delete-btn" onClick={() => banMember(member.id)}>
                            <HugeiconsIcon icon={Cancel02Icon} size={16} /> Ban
                          </button>
                        ) : (
                          <button className="delete-btn" onClick={() => unbanMember(member.id)}>
                            <HugeiconsIcon icon={Cancel02Icon} size={16} /> Unban
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal show={showCreateModal} onHide={() => { setShowCreateModal(false); resetCreateForm(); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Member</Modal.Title>
        </Modal.Header>
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
              <input
                type="file"
                name="profile_picture"
                accept="image/*"
                onChange={handleNewMemberChange}
                ref={createFileInputRef}
              />
            </div>
            <button type="submit" className="btn-primary">Create</button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); resetEditForm(); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Member</Modal.Title>
        </Modal.Header>
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
              <input
                type="file"
                name="profile_picture"
                accept="image/*"
                onChange={handleNewMemberChange}
                ref={editFileInputRef}
              />
            </div>
            <button type="submit" className="btn-primary">Save Changes</button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Members;
