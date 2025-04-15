import React, { useState } from 'react'
import banner from '../../assets/login.jpeg'
import logo from '../../assets/main.png'
import { useNavigate } from 'react-router-dom';

import './login.css';

const Login = () => {
    const [loginData, setLoginData] = useState({
        'username': 'apple',
        'password' : 'bees'
    });

    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate('/');
    }
  return (
    <div className='login'>
        <div className='login-container'>
          <div className="login-words-container">
            <div className="login-logo">
                <img src={logo} alt="" />
            </div>
          <div className='login-words'>
                <h3>Welcome Back 👋</h3>
                <p>Everything you need is just a click away. Sign in to get started.</p>

                <form className="custom-form">
            <div className="form-group">
              <label style={{fontWeight: '700', fontSize:'15px'}}>Username</label>
              <input
                type="text"
                name="username"
                className="input-field"
                value={loginData.username}
                onChange={null}
              />
            </div>

             <div className="form-group">
              <label style={{fontWeight: '700', fontSize:'15px'}}>Password</label>
              <input
                type="password"
                name="password"
                className="input-field"
                value={loginData.password}
                onChange={null}
              />
            </div>
            <div className="form-group-button" onClick={handleSubmit}>
                <p>Sign in</p>
            </div>
          </form>
            </div>
          </div>
            <div className='login-Image'>
                <img src={banner} alt="" />
            </div>
        </div>
    </div>
  )
}

export default Login