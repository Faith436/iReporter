// src/utils/auth.js
export const logout = async (navigate) => {
  try {
    // Optional: tell backend to clear cookie
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout error:", err);
  }

  // Clear frontend state
  localStorage.removeItem("user");

  // Redirect to login
  navigate("/login");
};
