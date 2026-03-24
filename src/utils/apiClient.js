/**
 * API utility for making requests to the backend
 * Base URL: http://localhost:5000/api
 */

const API_BASE_URL = "http://localhost:5000/api";

/**
 * Get the JWT token from localStorage
 */
const getToken = () => {
  return localStorage.getItem("authToken");
};

/**
 * Make an API request with common headers
 */
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * User APIs
 */
export const userAPI = {
  register: async (userData) => {
    return apiCall("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (email, password, role) => {
    return apiCall("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    });
  },
};

/**
 * Attendance APIs
 */
export const attendanceAPI = {
  markAttendance: async (status) => {
    return apiCall("/attendance/mark", {
      method: "POST",
      body: JSON.stringify({ status }),
    });
  },

  getMyAttendance: async () => {
    return apiCall("/attendance/my", {
      method: "GET",
    });
  },

  getAttendanceStats: async () => {
    return apiCall("/attendance/stats", {
      method: "GET",
    });
  },

  getTeacherStudents: async () => {
    return apiCall("/attendance/teacher/students", {
      method: "GET",
    });
  },

  markAttendanceBulk: async (payload) => {
    return apiCall("/attendance/teacher/mark-bulk", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getTeacherRecords: async () => {
    return apiCall("/attendance/teacher/records", {
      method: "GET",
    });
  },

  getTeacherReport: async () => {
    return apiCall("/attendance/teacher/report", {
      method: "GET",
    });
  },

  updateTeacherSession: async (payload) => {
    return apiCall("/attendance/teacher/session", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};

/**
 * Helper function to save auth token
 */
export const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

/**
 * Helper function to clear auth token
 */
export const clearAuthToken = () => {
  localStorage.removeItem("authToken");
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};
