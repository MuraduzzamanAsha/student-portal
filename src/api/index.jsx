import axios from 'axios';

// Create an Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor to add the JWT tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Auth Endpoints ---
export const sendTeacherOtp = (data) => api.post('/auth/teacher/send-otp', data);
export const verifyTeacherOtp = (data) => api.post('/auth/teacher/verify-otp', data);
export const sendStudentOtp = (data) => api.post('/auth/student/send-otp', data);
export const verifyStudentOtp = (data) => api.post('/auth/student/verify-otp', data);
export const loginStudentWithPassword = (data) => api.post('/auth/student/login-password', data);

// --- Admin Endpoints ---
export const addTeacher = (data) => api.post('/admin/add-teacher', data);
export const deleteStudent = (studentId) => api.delete(`/admin/student/${studentId}`);

// --- Teacher Endpoints ---
export const getStudents = (session = '') => api.get(`/teacher/students?session=${session}`);
export const getPendingStudents = () => api.get('/teacher/students/pending');
export const approveStudent = (studentId) => api.post(`/teacher/students/${studentId}/approve`);
export const rejectStudent = (studentId) => api.delete(`/teacher/students/${studentId}/reject`);
export const exportStudents = () => api.get('/teacher/students/export', { responseType: 'blob' });

// --- Student Endpoints ---
export const saveStudentProfile = (data) => api.post('/student/profile', data);
export const getStudentProfile = () => api.get('/student/profile');

// --- Session Endpoints ---
export const getSessions = () => api.get('/sessions');
export const addSession = (data) => api.post('/admin/sessions', data);
export const deleteSession = (sessionId) => api.delete(`/admin/sessions/${sessionId}`);

export default api;