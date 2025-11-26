import axios from "axios";
import API_BASE_URL from "./config/api"; // make sure the path is correct

const AUTH_URL = `${API_BASE_URL}/auth`;
const REPORTS_URL = `${API_BASE_URL}/reports`;
const USERS_URL = `${API_BASE_URL}/users`;
const NOTIFICATIONS_URL = `${API_BASE_URL}/notifications`;

const apiService = {
  // --- Auth ---
  register: async (userData) => {
    const res = await axios.post(`${AUTH_URL}/signup`, userData, {
      withCredentials: true,
    });
    return res.data;
  },

  login: async (email, password) => {
    const res = await axios.post(
      `${AUTH_URL}/login`,
      { email, password },
      { withCredentials: true }
    );

    if (res.data.token) localStorage.setItem("token", res.data.token);
    return res.data;
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${AUTH_URL}/me`, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },

  logout: async () => {
    localStorage.removeItem("token");
    const res = await axios.post(
      `${AUTH_URL}/logout`,
      {},
      { withCredentials: true }
    );
    return res.data;
  },

  // --- Reports ---
  getReports: async (userId) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${REPORTS_URL}${userId ? "?userId=" + userId : ""}`,
      { withCredentials: true, headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return res.data;
  },

  createReport: async (data) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(REPORTS_URL, data, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },

  updateReport: async (reportId, data) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${REPORTS_URL}/${reportId}`, data, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },

  updateReportStatus: async (reportId, status) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${REPORTS_URL}/${reportId}/status`, { status }, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },

  deleteReport: async (reportId) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${REPORTS_URL}/${reportId}`, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },

  // --- Users ---
  getUsers: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(USERS_URL, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },

  // --- Notifications ---
  createNotification: async (data) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(NOTIFICATIONS_URL, data, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },

  getNotifications: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(NOTIFICATIONS_URL, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data.notifications;
  },

  markNotificationRead: async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.patch(`${NOTIFICATIONS_URL}/${id}/read`, {}, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },

  deleteNotification: async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${NOTIFICATIONS_URL}/${id}`, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },

  deleteAllNotifications: async () => {
    const token = localStorage.getItem("token");
    const allNotifications = await axios.get(NOTIFICATIONS_URL, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    await Promise.all(
      allNotifications.data.notifications.map((n) =>
        axios.delete(`${NOTIFICATIONS_URL}/${n.id}`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
      )
    );
    return { success: true };
  },

  // --- First login / Onboarding ---
  markFirstLogin: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${AUTH_URL}/first-login-seen`, {}, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },

  getOnboardingStatus: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${AUTH_URL}/onboarding-status`, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },

  updateOnboardingStatus: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.patch(`${AUTH_URL}/onboarding-status`, { onboardingShown: true }, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },
};

export default apiService;
