import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();
export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  const signup = ({ name, email, password }) => {
    if (users.find((u) => u.email === email)) {
      throw new Error("Email already in use");
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: "user", // always normal user
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const login = ({ email, password }) => {
    // Admin login
    if (email === "admin@ireporter.com" && password === "admin123") {
      const adminUser = { id: 0, name: "Admin", email, role: "admin" };
      setCurrentUser(adminUser);
      return adminUser;
    }

    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid credentials");

    setCurrentUser(user);
    return user;
  };

  const logout = () => setCurrentUser(null);

  return (
    <UserContext.Provider value={{ users, currentUser, signup, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
