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



describe('CourseCard Unit Tests', () => {


    test('renders course title and instructor correctly', () => {
        renderWithRouter(<CourseCard course={mockCourse} />);
        
        // Check for the course title
        expect(screen.getByText(/Introduction to Python/i)).toBeInTheDocument();
        
        // Check for the instructor's name
        expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
        
        expect(screen.getByText(/programming fundamentals/i)).toBeInTheDocument();
    });

    test('renders a link to the correct course details page', () => {
        renderWithRouter(<CourseCard course={mockCourse} />);
        
        const linkElement = screen.getByRole('link', { 
            name: /Introduction to Python.*View Details/i 
        });
        
        // Check if the link element exists
        expect(linkElement).toBeInTheDocument();
        
        // Check if the href attribute matches the expected route
        expect(linkElement.getAttribute('href')).toBe(`/courses/${mockCourse._id}`);
    });

    test('renders all content within a single accessible link', () => {
        renderWithRouter(<CourseCard course={mockCourse} />);
        
        
        const courseCardLink = screen.getByRole('link', { 
            name: /Introduction to Python/i 
        });
        
        expect(courseCardLink).toBeInTheDocument();
        expect(courseCardLink.getAttribute('href')).toContain(mockCourse._id);
    });
});
