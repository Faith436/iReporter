// src/services/apiService.js
import { API_ENDPOINTS } from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth methods
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

  // Report methods
  async getReports(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/reports${queryParams ? `?${queryParams}` : ''}`;
    return this.request(endpoint);
  }

  async getReport(id) {
    return this.request(`/reports/${id}`);
  }

  async createReport(reportData) {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(reportData).forEach(key => {
      if (key !== 'evidence' && reportData[key] !== null) {
        formData.append(key, reportData[key]);
      }
    });

    // Append files
    if (reportData.evidence && reportData.evidence.length > 0) {
      reportData.evidence.forEach(file => {
        formData.append('evidence', file);
      });
    }

    return this.request('/reports', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      },
      body: formData,
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
    return this.request(`/reports/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();