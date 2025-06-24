import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAuth } from "../../context/AuthContext";
import { EyeIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { useTimeCards } from "../../context/TimeCardContext";

const ChangeUsersPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const { changeUserPassword } = useAuth();
  const { users } = useTimeCards();

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please select a user to change password for");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    setError("");
    const success = await changeUserPassword(user, password);
    console.log(success);
    if (success) {
      alert("Success");
    } else {
      setError("Invalid username or password");
    }
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <>
      <form className="custom-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select a user to change password for</label>
          <select
            className="form-control"
            name="user_id"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          >
            <option value="">All Users</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label style={{ fontWeight: "700", fontSize: "15px" }}>
            New Password
          </label>
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="input-eye"
              onClick={handleShowPassword}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? (
                <HugeiconsIcon icon={EyeIcon} size={20} color="#545454" />
              ) : (
                <HugeiconsIcon icon={ViewOffSlashIcon} size={20} />
              )}
            </div>
          </div>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button className="form-group-button" type="submit">
          <p>Change Password</p>
        </button>
      </form>
    </>
  );
};

export default ChangeUsersPassword;
