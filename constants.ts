
import { QuizQuestion, Course } from './types';

export const DUMMY_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    skill: "JavaScript",
    question: "What is the correct way to create an arrow function?",
    options: ["function name => {}", "const name = () => {}", "arrow function name() {}", "def name(): {}"],
    correctIndex: 1,
    explanation: "Arrow functions use the 'const name = () => {}' syntax introduced in ES6."
  },
  {
    id: 2,
    skill: "React",
    question: "Which hook is used to handle side effects in a functional component?",
    options: ["useState", "useContext", "useEffect", "useReducer"],
    correctIndex: 2,
    explanation: "useEffect is the standard hook for side effects like data fetching or DOM manipulation."
  }
];

export const DUMMY_COURSES: Course[] = [
  {
    id: "full-java-mastery",
    title: "Java Full Course for Beginners (2024)",
    platform: "YouTube (freeCodeCamp)",
    description: "A 12-hour complete masterclass covering Java basics, OOP, Collections, and Multi-threading.",
    skill: "Java",
    duration: "12 Hours",
    isFree: true,
    url: "https://www.youtube.com/watch?v=grEKMHGYuko"
  },
  {
    id: "full-python-mastery",
    title: "Python for Beginners - Full Course",
    platform: "YouTube (Programming with Mosh)",
    description: "The definitive 6-hour guide to Python. Includes projects on automation and AI fundamentals.",
    skill: "Python",
    duration: "6 Hours",
    isFree: true,
    url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc"
  },
  {
    id: "full-data-analytics",
    title: "Data Analytics Full Course - 10 Hours",
    platform: "YouTube (freeCodeCamp)",
    description: "Complete roadmap including Excel, SQL, Tableau, and Python for Data Analysis.",
    skill: "Data Analytics",
    duration: "10 Hours",
    isFree: true,
    url: "https://www.youtube.com/watch?v=ua-CiDNNj30"
  },
  {
    id: "full-stack-mern",
    title: "MERN Stack Full Course 2024",
    platform: "YouTube (Edureka)",
    description: "Build a complete Social Media Application using MongoDB, Express, React, and Node.js.",
    skill: "Full Stack Development",
    duration: "10 Hours",
    isFree: true,
    url: "https://www.youtube.com/watch?v=7CqJlxBYj-M"
  },
  {
    id: "full-sql-db",
    title: "SQL Tutorial - Full Database Course",
    platform: "YouTube (freeCodeCamp)",
    description: "Learn how to manage data efficiently. Covers CRUD, Joins, and Database Design.",
    skill: "SQL",
    duration: "4.5 Hours",
    isFree: true,
    url: "https://www.youtube.com/watch?v=HXV3zeQKqGY"
  },
  {
    id: "full-salesforce-admin",
    title: "Salesforce Admin Full Course 2024",
    platform: "YouTube (Intellipaat)",
    description: "Complete training for Salesforce Administration and App Builder certification.",
    skill: "Salesforce",
    duration: "11 Hours",
    isFree: true,
    url: "https://www.youtube.com/watch?v=8XpZ2A6L0vU"
  },
  {
    id: "full-web-dev",
    title: "Web Development Full Course - HTML/CSS/JS",
    platform: "YouTube (SuperSimpleDev)",
    description: "The most popular 11-hour web development starter course for 2024.",
    skill: "Web Development",
    duration: "11 Hours",
    isFree: true,
    url: "https://www.youtube.com/watch?v=G3e-cpL7ofc"
  },
  {
    id: "full-gen-ai",
    title: "Generative AI for Beginners",
    platform: "YouTube (Google Cloud)",
    description: "Learn about Large Language Models, Diffusion models, and responsible AI practices.",
    skill: "Gen AI",
    duration: "5 Hours",
    isFree: true,
    url: "https://www.youtube.com/watch?v=G29p_vX35C8"
  },
  {
    id: "full-ml-course",
    title: "Machine Learning Full Course 2024",
    platform: "YouTube (freeCodeCamp)",
    description: "Deep dive into Supervised Learning, Neural Networks, and Scikit-Learn.",
    skill: "Machine Learning",
    duration: "18 Hours",
    isFree: true,
    url: "https://www.youtube.com/watch?v=GwIo3gDZCVQ"
  }
];
