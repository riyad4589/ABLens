import React, { useState } from "react";
import { MdPerson, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import ablensLogo from "../assets/ablens2.jpg";
import { useNavigate } from "react-router-dom";
import { TextInput, PasswordInput, Button, Stack, Paper, Center, Alert } from '@mantine/core';
import { useLogin } from "../hooks/useAuthQuery";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation des champs
    if (!username.trim()) {
      setError("Le nom d'utilisateur est requis");
      return;
    }
    
    if (!password.trim()) {
      setError("Le mot de passe est requis");
      return;
    }
    
    if (password.length < 3) {
      setError("Le mot de passe doit contenir au moins 3 caractères");
      return;
    }

    try {
      await loginMutation.mutateAsync({ username: username.trim(), password });
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Erreur de connexion - Veuillez réessayer");
    }
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
                {error && (
                  <Alert 
                    color="red" 
                    title="Erreur de connexion"
                    icon={<MdLock />}
                    withCloseButton
                    onClose={() => setError("")}
                  >
                    {error}
                  </Alert>
                )}
                <TextInput
                  label="Nom d'utilisateur"
                  placeholder="Entrez votre nom d'utilisateur"
                  icon={<MdPerson />}
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value);
                    if (error) setError(""); // Effacer l'erreur quand l'utilisateur tape
                  }}
                  required
                  autoFocus
                  size="md"
                  error={!username.trim() && username.length > 0 ? "Le nom d'utilisateur est requis" : null}
                />
                <PasswordInput
                  label="Mot de passe"
                  placeholder="Entrez votre mot de passe"
                  icon={<MdLock />}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (error) setError(""); // Effacer l'erreur quand l'utilisateur tape
                  }}
                  required
                  visible={showPassword}
                  onVisibilityChange={setShowPassword}
                  error={password.length > 0 && password.length < 3 ? "Le mot de passe doit contenir au moins 3 caractères" : null}
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
                  fullWidth
                  size="md"
                  style={{ marginTop: 8, fontWeight: 600, fontSize: 18, background: '#194898', color: '#fff' }}
                >
                  Se connecter
                </Button>
              </Stack>
            </form>
          </Paper>
        </Center>
      </div>
    </div>
  );
}