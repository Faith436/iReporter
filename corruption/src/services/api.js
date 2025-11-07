// src/services/api.js - FIXED VERSION
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      method: options.method || 'GET',
      headers: { ...options.headers },
      credentials: 'include', // ✅ ADD THIS - sends cookies with requests
    };

    // ✅ REMOVE Authorization header - backend uses cookies
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    // Only set Content-Type if body exists and is NOT FormData
    if (options.body && !(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(options.body);
    } else if (options.body) {
      config.body = options.body; // FormData goes as is
    }

    try {
      console.log(`🌐 API ${config.method} ${endpoint}`);
      const response = await fetch(url, config);

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log('📨 API Response:', data);

      if (!response.ok) {
        throw new Error(
          data?.message || `HTTP error! status: ${response.status} | ${JSON.stringify(data)}`
        );
      }

      return data;
    } catch (error) {
      console.error('❌ API Request failed:', error);
      throw error;
    }
  }

  // ---------- Auth ----------
  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // ---------- Reports ----------
  getReports(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/reports${query ? `?${query}` : ''}`);
  }

  getReport(id) {
    return this.request(`/reports/${id}`);
  }

  createReport(formData) {
    return this.request('/reports', {
      method: 'POST',
      body: formData,
    });
  }

  updateReport(id, reportData) {
    return this.request(`/reports/${id}`, {
      method: 'PUT',
      body: reportData,
    });
  }

  updateReportStatus(id, statusData) {
    return this.request(`/reports/${id}/status`, {
      method: 'PATCH',
      body: statusData,
    });
  }

  deleteReport(id) {
    return this.request(`/reports/${id}`, { method: 'DELETE' });
  }

  // ---------- Notifications ----------
  async getNotifications() {
    const data = await this.request('/notifications');
    return data.notifications;
  }

  markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, { method: 'PATCH' });
  }

  deleteNotification(id) {
    return this.request(`/notifications/${id}`, { method: 'DELETE' });
  }
}

// Single instance
const apiService = new ApiService();
export default apiService;