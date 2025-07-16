import React, { useState } from "react";
import { MdPerson, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import ablensLogo from "../assets/ablens2.jpg";
import { useNavigate } from "react-router-dom";
import { TextInput, PasswordInput, Button, Stack, Paper, Center, Loader } from '@mantine/core';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', background: '#f8fafc' }}>
      <div style={{ flex: 1.2, background: '#174189', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={ablensLogo} alt="Logo ABLENS" style={{ width: 600, borderRadius: 12 }} />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <Center style={{ width: '100%', minHeight: '100vh' }}>
          <Paper shadow="md" radius={20} p={36} style={{ width: 380, maxWidth: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: '#174189', marginBottom: 8 }}>Connexion</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>Accédez à votre espace professionnel</p>
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
                  style={{ marginTop: 8, fontWeight: 600, fontSize: 18, background: '#194898', color: '#fff' }}
                  loaderProps={{ type: 'oval', color: '#fff' }}
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