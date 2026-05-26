import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(username, password) {
    if (!username.trim()) {
      return { ok: false, error: "Informe o nome de usuário." };
    }
    if (password !== "1234") {
      return { ok: false, error: "Senha incorreta. Use a senha padrão." };
    }
    setUser({ name: username.trim() });
    return { ok: true };
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
