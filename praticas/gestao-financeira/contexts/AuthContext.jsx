import { createContext, useContext, useRef, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const usersRef = useRef([]);

  function login(username, password) {
    if (!username.trim()) {
      return { ok: false, error: "Informe o nome de usuário." };
    }
    const found = usersRef.current.find(
      (u) => u.username === username.trim() && u.password === password
    );
    if (!found) {
      return { ok: false, error: "Usuário ou senha incorretos." };
    }
    setUser({ name: found.username });
    return { ok: true };
  }

  function register(username, password, confirmPassword) {
    if (!username.trim()) {
      return { ok: false, error: "Informe o nome de usuário." };
    }
    if (password.length < 4) {
      return { ok: false, error: "A senha deve ter pelo menos 4 caracteres." };
    }
    if (password !== confirmPassword) {
      return { ok: false, error: "As senhas não coincidem." };
    }
    const exists = usersRef.current.some((u) => u.username === username.trim());
    if (exists) {
      return { ok: false, error: "Este usuário já está cadastrado." };
    }
    const newUser = { username: username.trim(), password };
    usersRef.current = [...usersRef.current, newUser];
    setUser({ name: newUser.username });
    return { ok: true };
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
