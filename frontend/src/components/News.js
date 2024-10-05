import React, { useEffect, useState } from 'react';
import axios from 'axios';


const News = () => {
    const [newsArticles, setNewsArticles] = useState([]); // Store news articles
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch tourism-related news articles
    const fetchTourismNews = async () => {
        try {
            const response = await axios.get('https://newsapi.org/v2/everything?q=tourism+sri+lanka&apiKey=282422ce39344d91bf12fb21b37c01ea');
            setNewsArticles(response.data.articles);
        } catch (error) {
            console.error('Error fetching tourism news:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    useEffect(() => {
        fetchTourismNews(); // Fetch news articles on component mount
    }, []);

    return (
        <div className="news-container">
            <h1>Latest Tourism News in Sri Lanka</h1>
            {loading ? (
                <p>Loading news articles...</p>
            ) : newsArticles.length > 0 ? (
                <div className="news-articles-container">
                    {newsArticles.map((article) => (
                        <div className="news-article" key={article.url}>
                            <h3 className="news-title">{article.title}</h3>
                            <p className="news-description">{article.description}</p>
                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">Read more</a>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No news articles available.</p>
            )}
        </div>
    );
};

export default News;
