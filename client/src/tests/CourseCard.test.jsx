import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, describe } from 'vitest';
import CourseCard from '../components/CourseCard'; 

// Mock Data 
const mockCourse = {
    _id: '12345courseId',
    title: 'Introduction to Python',
    description: 'A beginner\'s guide to programming fundamentals.',
    instructor: 'Jane Doe',
    lessons: [{_id: 'l1'}, {_id: 'l2'}, {_id: 'l3'}], 
    duration: 120, 
};


const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};


// CourseCard Component
describe('CourseCard Unit Tests', () => {

    // Ensure the component renders without crashing and displays core data
    test('renders course title and instructor correctly', () => {
        renderWithRouter(<CourseCard course={mockCourse} />);
        
        // Check for the course title
        expect(screen.getByText(/Introduction to Python/i)).toBeInTheDocument();
        
        // Check for the instructor's name
        expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
        
        // Check for the lesson count
        expect(screen.getByText('3 Lessons')).toBeInTheDocument();
    });

    // Ensures the 'View Course' link points to the correct URL
    test('renders a link to the correct course details page', () => {
        renderWithRouter(<CourseCard course={mockCourse} />);
        
        
        const linkElement = screen.getByRole('link', { name: /View Course/i });
        
        
        expect(linkElement).toBeInTheDocument();
        
        // Check if the href attribute matches the expected route
        expect(linkElement.getAttribute('href')).toBe(`/courses/${mockCourse._id}`);
    });

    //  Ensure description text is displayed
    test('renders the course description', () => {
        renderWithRouter(<CourseCard course={mockCourse} />);
        
        
        expect(screen.getByText(/programming fundamentals/i)).toBeInTheDocument();
    });
});
