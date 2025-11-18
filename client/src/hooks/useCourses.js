import { useCourses as useCoursesContext } from "../context/CourseContext";

export default function useCoursesHook() {
  const { courses, setCourses, loading, enrollCourse } = useCoursesContext();


  return { courses, setCourses, loading, enrollCourse };
}
