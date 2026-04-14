import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/AppContext";

const Auth = () => {
  const { login, register } = useUser();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        // Attempt API Login
        await login(email, password);
      } else {
        // Attempt API Registration
        await register(name, email, password);
      }
      navigate("/"); // Redirect to Home upon success
    } catch (err) {
      setError(err); // Display backend error
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Sign In" : "Create Account"}</h2>
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
