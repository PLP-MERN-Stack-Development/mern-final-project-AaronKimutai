import axiosInstance from "./axiosInstance";

const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  },

  // get enrolled courses for the dashboard
  getEnrolledCourses: async () => {
    const response = await axiosInstance.get("/users/me/courses");
    return response.data;
  },

  // Check enrollment status for a specific course
  checkEnrollment: async (courseId) => {
    const response = await axiosInstance.get(`/users/check-enrollment/${courseId}`);
    return response.data;
  },

  // enroll in a course
  enrollInCourse: async (courseId) => {
    const response = await axiosInstance.post(`/users/enroll/${courseId}`);
    return response.data;
  }
};

export default userService;
