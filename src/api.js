import axios from 'axios';

const IP_API = "http://192.168.29.112:5093/api";
const LOCAL_API = "http://localhost:5093/api";

class ApiService {
  constructor() {
    this.currentApi = IP_API;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Try IP first
      const response = await axios.get(`${IP_API}/Property/all`, { timeout: 5000 });
      if (response.status === 200) {
        this.currentApi = IP_API;
        console.log("Using IP API:", IP_API);
      }
    } catch (error) {
      // If IP fails, use localhost
      this.currentApi = LOCAL_API;
      console.log("Falling back to localhost:", LOCAL_API);
    }

    this.isInitialized = true;
  }

  getApi() {
    return this.currentApi;
  }
}

const apiService = new ApiService();

// Initialize immediately
apiService.initialize();

// Export the function to get the current API URL
export const api = apiService.getApi();

// Export the service for manual initialization if needed
export const initializeApi = () => apiService.initialize();

// Export a function to get the current API URL
export const getCurrentApi = () => apiService.getApi();

// export const api = "http://localhost:5093/api"