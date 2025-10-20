// Placeholder API service for now
const api = {
  login: async (email, password) => {
    // Mock login
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: { name: 'John Doe', role: 'user' },
          token: 'dummy-token'
        });
      }, 500);
    });
  },
  signup: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ user: { name: data.firstName, role: 'user' }, token: 'dummy-token' });
      }, 500);
    });
  }
};

export default api;
