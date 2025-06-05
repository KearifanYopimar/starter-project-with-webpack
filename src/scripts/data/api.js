import axios from 'axios';
import CONFIG from '../config.js';
import AuthService from './auth.js';

class ApiService {
  /**
   * Mendaftarkan pengguna baru
   * @param {Object} payload - { name, email, password }
   * @returns {Promise<Object>} Data respons dari API
   */
  static async register({ name, email, password }) {
    try {
      const response = await axios.post(`${CONFIG.API_BASE_URL}/register`, { name, email, password });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Gagal mendaftar';
      throw new Error(errorMessage);
    }
  }

  /**
   * Melakukan login pengguna
   * @param {Object} payload - { email, password }
   * @returns {Promise<Object>} Data loginResult dari API
   */
  static async login({ email, password }) {
    try {
      const response = await axios.post(`${CONFIG.API_BASE_URL}/login`, { email, password });
      const token = response.data.loginResult.token;
      AuthService.setToken(token);
      return response.data.loginResult;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Gagal login';
      throw new Error(errorMessage);
    }
  }

  /**
   * Menambahkan cerita baru
   * @param {Object} payload - { description, photo, lat, lon }
   * @returns {Promise<Object>} Data respons dari API
   */
  static async addStory({ description, photo, lat, lon }) {
    const token = AuthService.getToken();
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    if (lat && lon) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    try {
      const response = await axios.post(`${CONFIG.API_BASE_URL}/stories`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Gagal menambahkan cerita';
      throw new Error(errorMessage);
    }
  }

  /**
   * Mengambil semua cerita
   * @param {Object} options - { page, size, location }
   * @returns {Promise<Array>} Daftar cerita dari API
   */
  static async getAllStories({ page = 1, size = 10, location = 0 } = {}) {
    const token = AuthService.getToken();
    try {
      const response = await axios.get(`${CONFIG.API_BASE_URL}/stories`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size, location },
      });
      console.log('API Response:', response.data); // Log untuk debugging
      // Sesuaikan dengan struktur respons API yang sebenarnya
      return Array.isArray(response.data.listStory) ? response.data.listStory : [];
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Gagal mengambil cerita');
    }
  }

  /**
   * Mengambil detail cerita berdasarkan ID
   * @param {string|number} id - ID cerita
   * @returns {Promise<Object>} Detail cerita dari API
   */
  static async getStoryDetail(id) {
    const token = AuthService.getToken();
    try {
      const response = await axios.get(`${CONFIG.API_BASE_URL}/stories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.story || {}; // Fallback ke objek kosong jika story tidak ada
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Gagal mengambil detail cerita';
      throw new Error(errorMessage);
    }
  }

  /**
   * Berlangganan notifikasi push
   * @param {Object} subscription - Data subscription
   * @returns {Promise<Object>} Data respons dari API
   */
  static async subscribePushNotification(subscription) {
    const token = AuthService.getToken();
    try {
      const response = await axios.post(
          `${CONFIG.API_BASE_URL}/notifications/subscribe`,
          subscription,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Gagal berlangganan notifikasi';
      throw new Error(errorMessage);
    }
  }
}

export default ApiService;