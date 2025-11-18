import axiosInstance from "./axiosInstance";

export const getCourses = () => axiosInstance.get("/courses");
export const getCourseById = (id) => axiosInstance.get(`/courses/${id}`);
export const enrollCourse = (id) => axiosInstance.post(`/users/enroll/${id}`);
