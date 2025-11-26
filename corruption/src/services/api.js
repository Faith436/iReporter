import axios from "axios";
import API_BASE_URL from "../config/api"; // adjust path as needed

const AUTH_URL = "/auth";
const REPORTS_URL = "/reports";
const USERS_URL = "/users";
const NOTIFICATIONS_URL = "/notifications";

// Create a single axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const apiService = {
  // --- Auth ---
  register: async (userData) => {
    const res = await api.post(`${AUTH_URL}/register`, userData);
    return res.data;
  },

  login: async (email, password) => {
    const res = await api.post(`${AUTH_URL}/login`, { email, password });
    console.log("LOGIN RESPONSE:", res.data);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token); // store token
    }

    return res.data;
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const res = await api.get(`${AUTH_URL}/me`);
    return res.data;
  },

  logout: async () => {
    localStorage.removeItem("token");
    return { message: "Logged out" };
  },

  // --- Reports ---
  getReports: async (userId) => {
    const res = await api.get(`${REPORTS_URL}${userId ? "?userId=" + userId : ""}`);
    return res.data;
  },

  createReport: async (data) => {
    const res = await api.post(REPORTS_URL, data);
    return res.data;
  },

  updateReport: async (reportId, data) => {
    const res = await api.put(`${REPORTS_URL}/${reportId}`, data);
    return res.data;
  },

  updateReportStatus: async (reportId, status) => {
    const res = await api.put(`${REPORTS_URL}/${reportId}/status`, { status });
    return res.data;
  },

  deleteReport: async (reportId) => {
    const res = await api.delete(`${REPORTS_URL}/${reportId}`);
    return res.data;
  },

  // --- Users ---
  getUsers: async () => {
    const res = await api.get(USERS_URL);
    return res.data;
  },

  // --- Notifications ---
  getNotifications: async () => {
    const res = await api.get(NOTIFICATIONS_URL);
    return res.data.notifications;
  },

  createNotification: async (data) => {
    const res = await api.post(NOTIFICATIONS_URL, data);
    return res.data;
  },

  markNotificationRead: async (id) => {
    const res = await api.patch(`${NOTIFICATIONS_URL}/${id}/read`);
    return res.data;
  },

  deleteNotification: async (id) => {
    const res = await api.delete(`${NOTIFICATIONS_URL}/${id}`);
    return res.data;
  },

  deleteAllNotifications: async () => {
    const allNotifications = await api.get(NOTIFICATIONS_URL);
    await Promise.all(
      allNotifications.data.notifications.map((n) =>
        api.delete(`${NOTIFICATIONS_URL}/${n.id}`)
      )
    );
    return { success: true };
  },

  // --- First login / Onboarding ---
  markFirstLogin: async () => {
    const res = await api.put(`${AUTH_URL}/first-login-seen`);
    return res.data;
  },

  getOnboardingStatus: async () => {
    const res = await api.get(`${AUTH_URL}/onboarding-status`);
    return res.data;
  },

  updateOnboardingStatus: async () => {
    const res = await api.patch(`${AUTH_URL}/onboarding-status`, {
      onboardingShown: true,
    });
    return res.data;
  },
};

export default apiService;
