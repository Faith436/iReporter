// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: { ...options.headers },
      ...options,
    };

    // Set Content-Type only if body is not FormData
    if (!(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      console.log(`🌐 API ${options.method || 'GET'} ${endpoint}`);
      const response = await fetch(url, config);

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log(`📨 API Response:`, data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('❌ API Request failed:', error);
      throw error;
    }
  }

  // ---------- Auth ----------
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // ---------- Reports ----------
  async getReports(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/reports${queryParams ? `?${queryParams}` : ''}`;
    return this.request(endpoint);
  }

  async getReport(id) {
    return this.request(`/reports/${id}`);
  }

  async createReport(formData) {
    return this.request('/reports', {
      method: 'POST',
      body: formData, // FormData handled directly
    });
  }

  async updateReport(id, reportData) {
    return this.request(`/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reportData),
    });
  }

  async updateReportStatus(id, statusData) {
    return this.request(`/reports/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    });
  }

  async deleteReport(id) {
    return this.request(`/reports/${id}`, { method: 'DELETE' });
  }

  // ---------- Notifications ----------
  async getNotifications() {
    const data = await this.request('/notifications');
    return data.notifications;
  }

  async markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, { method: 'PATCH' });
  }

  async deleteNotification(id) {
    return this.request(`/notifications/${id}`, { method: 'DELETE' });
  }
}

// Create and export single instance
const apiService = new ApiService();
export default apiService;
