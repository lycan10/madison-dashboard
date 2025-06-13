import React, { useState, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu01Icon } from '@hugeicons/core-free-icons';
import './navbar.css';
import defaultAvatar from '../../assets/a1.png'; // Renamed to avoid name conflict
import { useSidebar } from '../../context/SideBarContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { sidebarShow, toggleSidebar } = useSidebar();
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [avatar, setAvatar] = useState(defaultAvatar); // use imported default
    const fileInputRef = useRef(null);

    const getFormattedDate = () => {
        const today = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return today.toLocaleDateString('en-US', options);
    };

    const handleAvatarChange = () => {
        fileInputRef.current.click(); // open file picker
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
            // Optional: Upload to server
        }
    };

    const handleLogout = async () => {
        await logout();
        window.location.reload(); // Optional: refresh to reset state
    };

    return (
        <div className='navbar'>
            <div className='navbar-container'>
                <div className="navbar-date">
                    <div className={`mobile-filter ${sidebarShow ? 'show' : ''}`} onClick={toggleSidebar}>
                        <HugeiconsIcon icon={Menu01Icon} size={16} color="#000000" strokeWidth={1.5} />
                    </div>
                    <div className='navbar-date-title'>
                        <p>{getFormattedDate()}</p>
                    </div>
                </div>

                <div className="navbar-right">
                    <div className="navbar-image" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <img src={avatar} alt="User" />
                        {dropdownOpen && (
                            <div className="navbar-dropdown">
                                <p onClick={handleAvatarChange}>Change logo</p>
                                <p onClick={handleLogout}>Logout</p>
                            </div>
                        )}
                        {/* Hidden file input */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />
                    </div>

                    <div className="navbar-text">
                        <p>{user ? user.name : 'Guest'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
