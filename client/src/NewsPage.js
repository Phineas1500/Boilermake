import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewsPage = () => {
    const navigate = useNavigate();
    const [headlines, setHeadlines] = useState([]);

    // Function to fetch headlines from your server
    const fetchHeadlines = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/headlines');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setHeadlines(data);
        } catch (error) {
            console.error('Error fetching headlines:', error);
        }
    };

    // Fetch headlines on component mount
    useEffect(() => {
        fetchHeadlines();
    }, []);

    // Function to handle back button click
    const handleBackClick = () => {
        navigate('/stocks'); // Navigate back to the stocks page
    };

    return (
        <div>
            <h1>News</h1>
            <button onClick={handleBackClick}>Back to Stocks</button>
            <ul>
                {headlines.map((headline, index) => (
                    <li key={index}>
                        <p>{headline.content} - <i>{headline.category}</i></p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NewsPage;