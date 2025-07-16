import React, { useState, useEffect } from "react";
import { MdPerson, MdLock, MdVisibility, MdVisibilityOff, MdBusiness, MdSecurity } from "react-icons/md";
import ablensLogo from "../assets/ablens2.jpg";
import { useNavigate } from "react-router-dom";
import { TextInput, PasswordInput, Button, Group, Loader, Stack, Paper, Center } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ABLENS - Connexion";
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1800);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="login-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          overflow: hidden;
        }
        
        .login-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          position: relative;
          background: #f8fafc;
        }
        
        .login-left {
          flex: 1.2;
          background: #174189;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          overflow: hidden;
          height: 100vh;
        }
        
        @keyframes patternMove {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(30px) translateY(-20px); }
        }
        
        .company-branding {
          text-align: center;
          z-index: 2;
          color: white;
          max-width: 500px;
        }
        
        .company-logo {
          width: 100%;
          height: 100%;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .company-logo-img {
          width: 100%;
          height: 100%;
          max-width: none;
          max-height: none;
          border-radius: 0;
          object-fit: cover;
          box-shadow: none;
          border: none;
          background: none;
          margin: 0;
          display: block;
        }
        
        .company-logo-text {
          font-size: 48px;
          font-weight: 900;
          letter-spacing: 3px;
          background: linear-gradient(45deg, #ffffff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .company-title {
          font-size: 42px;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: 2px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .company-subtitle {
          font-size: 20px;
          font-weight: 300;
          opacity: 0.9;
          margin-bottom: 2rem;
          letter-spacing: 0.5px;
        }
        
        .company-features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-top: 2rem;
          max-width: 400px;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .feature-icon {
          font-size: 24px;
          color: #dbeafe;
        }
        
        .feature-text {
          font-size: 14px;
          font-weight: 500;
        }
        
        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          padding: 2rem;
          position: relative;
        }
        
        .login-right::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 30% 70%, rgba(147, 197, 253, 0.08) 0%, transparent 50%);
        }
        
        .login-form {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 20px;
          padding: 3rem 2.5rem;
          box-shadow: 
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 1px solid #e2e8f0;
          position: relative;
          z-index: 2;
        }
        
        .login-form::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #1e40af, #3b82f6, #60a5fa, #93c5fd);
          border-radius: 20px 20px 0 0;
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .login-title {
          font-size: 28px;
          font-weight: 700;
          color: #174189;
          margin-bottom: 0.5rem;
          letter-spacing: 0.5px;
        }
        
        .login-subtitle {
          font-size: 16px;
          color: #64748b;
          font-weight: 400;
        }
        
        .time-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-radius: 12px;
          margin-bottom: 2rem;
          border: 1px solid #e2e8f0;
        }
        
        .time-info {
          font-size: 14px;
          color: #475569;
        }
        
        .current-time {
          font-weight: 700;
          color: #1e40af;
          font-size: 16px;
        }
        
        .login-field {
          margin-bottom: 1.5rem;
        }
        
        .login-field label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          letter-spacing: 0.3px;
        }
        
        .input-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .input-icon {
          position: absolute;
          left: 1rem;
          font-size: 20px;
          color: #9ca3af;
          z-index: 1;
          transition: color 0.3s ease;
        }
        
        .login-field input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 16px;
          background: #f9fafb;
          color: #111827;
          outline: none;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .login-field input:focus {
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .login-field input:focus + .input-icon {
          color: #3b82f6;
        }
        
        .password-toggle {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 20px;
          padding: 0.25rem;
          border-radius: 6px;
          transition: all 0.3s ease;
        }
        
        .password-toggle:hover {
          background: #f3f4f6;
          color: #174189;
        }
        
        .login-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
          margin-top: 1rem;
          position: relative;
          overflow: hidden;
        }
        
        .login-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }
        
        .login-btn:hover::before {
          left: 100%;
        }
        
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px 0 rgba(59, 130, 246, 0.5);
        }
        
        .login-btn:active {
          transform: translateY(0);
        }
        
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 2px solid white;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .security-notice {
          text-align: center;
          margin-top: 2rem;
          padding: 1rem;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 12px;
          border: 1px solid #bae6fd;
        }
        
        .security-notice-text {
          font-size: 12px;
          color: #0369a1;
          font-weight: 500;
        }
        
        @media (max-width: 1024px) {
          .login-container {
            flex-direction: column;
          }
          
          .login-left {
            flex: none;
            min-height: 40vh;
            padding: 0;
            height: auto;
          }
          
          .company-title {
            font-size: 32px;
          }
          
          .company-subtitle {
            font-size: 16px;
          }
          
          .company-features {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .login-right {
            flex: none;
            padding: 1.5rem;
          }
          
          .login-form {
            padding: 2rem 1.5rem;
          }
          .company-logo-img {
            width: 100%;
            height: 100%;
            max-width: none;
            max-height: none;
          }
        }
        
        @media (max-width: 640px) {
          .login-left {
            min-height: 30vh;
            padding: 0;
            height: auto;
          }
          
          .company-logo {
            width: 100px;
            height: 100px;
          }
          
          .company-logo-text {
            font-size: 36px;
          }
          
          .company-title {
            font-size: 24px;
          }
          
          .company-subtitle {
            font-size: 14px;
          }
          
          .login-form {
            padding: 1.5rem 1rem;
          }
          
          .login-title {
            font-size: 24px;
          }
          
          .time-display {
            flex-direction: column;
            gap: 0.5rem;
          }
          .company-logo-img {
            width: 100%;
            height: 100%;
            max-width: none;
            max-height: none;
          }
        }
      `}</style>
      
      <div className="login-left">
        <div className="company-branding">
          <div className="company-logo">
              <img
                src={ablensLogo}
                alt="Logo ABLENS"
                className="company-logo-img"
              />          
          </div>
          {/* <h1 className="company-title">ABLENS</h1> */}
        </div>
      </div>
      
      <div className="login-right">
        <Center style={{ width: '100%', minHeight: '100vh' }}>
          <Paper shadow="md" radius={20} p={36} style={{ width: 380, maxWidth: '100%' }}>
            <div className="login-header">
              <h2 className="login-title">Connexion</h2>
              <p className="login-subtitle">Accédez à votre espace professionnel</p>
            </div>
            <form onSubmit={handleSubmit}>
              <Stack spacing={24}>
                <TextInput
                  label="Nom d'utilisateur"
                  placeholder="Entrez votre nom d'utilisateur"
                  icon={<MdPerson />}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoFocus
                  size="md"
                />
                <PasswordInput
                  label="Mot de passe"
                  placeholder="Entrez votre mot de passe"
                  icon={<MdLock />}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  visible={showPassword}
                  onVisibilityChange={setShowPassword}
                  rightSection={
                    <Button
                      variant="subtle"
                      size="xs"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </Button>
                  }
                  size="md"
                />
                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  size="md"
                  style={{ marginTop: 8, fontWeight: 600, fontSize: 18 }}
                >
                  {loading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Center>
      </div>
    </div>
  );
}