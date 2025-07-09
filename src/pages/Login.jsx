import React, { useState, useEffect } from "react";
import "../style/login.css";
import ablensLogo from "../assets/ablens.jpg";
import { useNavigate } from "react-router-dom";

export default function Login() {
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ABLENS";
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img src={ablensLogo} alt="Ablens Logo" className="login-logo" />
        <h2 className="login-title">Connexion</h2>
        <div className="login-field">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur"
            required
          />
        </div>
        <div className="login-field">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
        </div>
        <button className="login-btn" type="submit">Se connecter</button>
      </form>
    </div>
  );
}