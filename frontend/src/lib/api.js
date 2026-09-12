import axios from "axios";
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
class ApiClient {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getToken();

        console.log("========== API REQUEST ==========");
        console.log("URL:", config.baseURL + config.url);
        console.log("METHOD:", config.method);
        console.log("TOKEN EXISTS:", !!token);

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log("AUTH HEADER ADDED");
        } else {
          console.log("NO TOKEN FOUND");
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor to handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log("========== API RESPONSE ==========");
        console.log("URL:", response.config.url);
        console.log("STATUS:", response.status);

        return response;
      },
      (error) => {
        console.error("========== API ERROR ==========");
        console.error("URL:", error.config?.url);
        console.error("STATUS:", error.response?.status);
        console.error("DATA:", error.response?.data);

        if (error.response?.status === 401) {
          this.clearToken();

          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }

        return Promise.reject(error);
      },
    );
  }
  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  }
  clearToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }
  setToken(token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  // Auth endpoints
  async register(data) {
    const response = await this.axiosInstance.post("/auth/register", data);
    return response.data;
  }
  async login(data) {
    const response = await this.axiosInstance.post("/auth/login", data);
    if (response.data.token) {
      this.setToken(response.data.token);
      // Also sync with zustand store
      if (typeof window !== "undefined") {
        const { setToken } = await import("@/store/authStore").then((m) =>
          m.useAuthStore.getState(),
        );
        setToken(response.data.token);
      }
    }
    return response.data;
  }
  async getMe() {
    const response = await this.axiosInstance.get("/auth/me");
    return response.data;
  }

  // Goal endpoints
  async createGoal(data) {
    const response = await this.axiosInstance.post("/goals", data);
    return response.data;
  }
  async getGoals() {
    const response = await this.axiosInstance.get("/goals");
    return response.data;
  }
  async getGoal(id) {
    const response = await this.axiosInstance.get(`/goals/${id}`);
    return response.data;
  }
  async updateGoal(id, data) {
    const response = await this.axiosInstance.put(`/goals/${id}`, data);
    return response.data;
  }
  async deleteGoal(id) {
    const response = await this.axiosInstance.delete(`/goals/${id}`);
    return response.data;
  }
  async regenerateGoalPlan(id, feedback) {
    const response = await this.axiosInstance.post(`/goals/${id}/regenerate`, {
      feedback,
    });
    return response.data;
  }

  // Progress endpoints
  async createProgress(data) {
    const response = await this.axiosInstance.post("/progress", data);
    return response.data;
  }
  async getProgressByGoal(goalId) {
    const response = await this.axiosInstance.get(`/progress/goal/${goalId}`);
    return response.data;
  }
  async getProgressStats(goalId) {
    const response = await this.axiosInstance.get(`/progress/goal/${goalId}/stats`);
    return response.data;
  }
  async updateProgress(id, data) {
    const response = await this.axiosInstance.put(`/progress/${id}`, data);
    return response.data;
  }

  // Insight endpoints
  async generateInsights(goalId) {
    const response = await this.axiosInstance.post(
      `/insights/generate/${goalId}`,
    );
    return response.data;
  }
  async getInsightsByGoal(goalId) {
    const response = await this.axiosInstance.get(`/insights/goal/${goalId}`);
    return response.data;
  }
  async getLatestInsight(goalId) {
    const response = await this.axiosInstance.get(`/insights/goal/${goalId}/latest`);
    return response.data;
  }

  // PDF endpoints
  async downloadGoalReport(goalId) {
    const response = await this.axiosInstance.get(`/pdf/goal/${goalId}/report`, {
      responseType: "blob",
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // Extract filename from Content-Disposition header if available
    const contentDisposition = response.headers["content-disposition"];
    let filename = "goal-report.pdf";
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return response.data;
  }

  // Support chat (Gemini) endpoint
  async chatWithSupport(data) {
    const response = await this.axiosInstance.post("/chat/support", data);
    return response.data;
  }
}

// Create a single instance
export const api = new ApiClient();

// Also export individual API objects for backward compatibility
export const authAPI = {
  register: (data) => api.register(data),
  login: (data) => api.login(data),
  getMe: () => api.getMe(),
};
export const goalAPI = {
  create: (data) => api.createGoal(data),
  getAll: () => api.getGoals(),
  getById: (id) => api.getGoal(id),
  update: (id, data) => api.updateGoal(id, data),
  delete: (id) => api.deleteGoal(id),
  regenerate: (id, feedback) => api.regenerateGoalPlan(id, feedback),
};
export const progressAPI = {
  create: (data) => api.createProgress(data),
  getByGoal: (goalId) => api.getProgressByGoal(goalId),
  getStats: (goalId) => api.getProgressStats(goalId),
  update: (id, data) => api.updateProgress(id, data),
};
export const insightAPI = {
  generate: (goalId) => api.generateInsights(goalId),
  getByGoal: (goalId) => api.getInsightsByGoal(goalId),
  getLatest: (goalId) => api.getLatestInsight(goalId),
};
export const pdfAPI = {
  download: (goalId) => api.downloadGoalReport(goalId),
};
export const supportChatAPI = {
  send: (message, history) =>
    api.chatWithSupport({
      message,
      history,
    }),
};
