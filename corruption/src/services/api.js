import axios from "axios";

const API_URL = "http://localhost:5000/api";
const AUTH_URL = `${API_URL}/auth`;
const REPORTS_URL = `${API_URL}/reports`;
const USERS_URL = `${API_URL}/users`;
const NOTIFICATIONS_URL = `${API_URL}/notifications`; // <- new

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
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await axios.get(`${AUTH_URL}/me`, { withCredentials: true });
    return res.data;
  },
  logout: async () => {
    const res = await axios.post(
      `${AUTH_URL}/logout`,
      {},
      { withCredentials: true }
    );
    return res.data;
  },

  // --- Reports ---

  getReports: async (userId) => {
    const res = await axios.get(
      `${REPORTS_URL}${userId ? "?userId=" + userId : ""}`,
      { withCredentials: true }
    );
    return res.data;
  },

  createReport: async (data) => {
    const res = await axios.post(REPORTS_URL, data, { withCredentials: true });
    return res.data;
  },

  updateReport: async (reportId, data) => {
    const res = await axios.put(`${REPORTS_URL}/${reportId}`, data, {
      withCredentials: true,
    });
    return res.data;
  },

  updateReportStatus: async (reportId, status) => {
    const res = await axios.put(
      `${REPORTS_URL}/${reportId}/status`,
      { status },
      { withCredentials: true }
    );
    return res.data;
  },

  deleteReport: async (reportId) => {
    const res = await axios.delete(`${REPORTS_URL}/${reportId}`, {
      withCredentials: true,
    });
    return res.data;
  },

  // --- Users (admin) ---
  getUsers: async () => {
    const res = await axios.get(USERS_URL, { withCredentials: true });
    return res.data;
  },

  // --- Notifications ---
  createNotification: async (data) => {
    const res = await axios.post(NOTIFICATIONS_URL, data, {
      withCredentials: true,
    });
    return res.data;
  },
  getNotifications: async () => {
    const res = await axios.get(NOTIFICATIONS_URL, { withCredentials: true });
    return res.data.notifications; // now returns array directly
  },
  markNotificationRead: async (id) => {
    const res = await axios.patch(
      `${NOTIFICATIONS_URL}/${id}/read`,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  },
  deleteNotification: async (id) => {
    const res = await axios.delete(`${NOTIFICATIONS_URL}/${id}`, {
      withCredentials: true,
    });
    return res.data;
  },
};

export default apiService;