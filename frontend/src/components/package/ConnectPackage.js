import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import "./ConnectPackage.css";

const ConnectPackage = () => {
    const navigate = useNavigate(); // Initialize navigate

    const [reviews, setReviews] = useState([
        { name: 'John Doe', rating: 5, comment: 'Amazing experience!' },
        { name: 'Jane Smith', rating: 4, comment: 'Great tour, but the hotel could be better.' }
    ]);
    const [newReview, setNewReview] = useState({ name: '', rating: '', comment: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newReview.name && newReview.rating && newReview.comment) {
            setReviews([...reviews, newReview]);
            setNewReview({ name: '', rating: '', comment: '' }); // Reset the form
        } else {
            alert('Please fill out all fields!');
        }
    };

    const handleRatingChange = (rating) => {
        setNewReview({ ...newReview, rating });
    };

    const handleDelete = (index) => {
        const updatedReviews = reviews.filter((_, i) => i !== index);
        setReviews(updatedReviews);
    };

    return (
        <div className="reviews-container">
            {/* Navigation Bar */}
            <nav className="navbar">
                <h2 className="navbar-title">Travel Agency</h2>
                <ul className="navbar-links">
                    <li onClick={() => navigate("/")}>Home</li>
                    <li onClick={() => navigate("/packages")}>View Packages</li>
                </ul>
            </nav>

            <h2>Package Reviews and Ratings</h2>

            {/* Display Reviews */}
            <div className="reviews-list">
                {reviews.map((review, index) => (
                    <div key={index} className="review-item">
                        <h4>{review.name}</h4>
                        <p>Rating: {review.rating} / 5</p>
                        <p>{review.comment}</p>
                        <button onClick={() => handleDelete(index)} className='delete-btn'>Delete</button>
                    </div>
                ))}
            </div>

            {/* Add Review Form */}
            <div className="add-review">
                <h3>Add Your Review</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        className='inptr'
                        type="text"
                        placeholder="Your Name"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    />
                    <div className="rating">
                        <p>Rating:</p>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                                key={star}
                                className={`star ${newReview.rating >= star ? 'filled' : ''}`}
                                onClick={() => handleRatingChange(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <textarea
                        placeholder="Your Comment"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    />
                    <button type="submit" className='btnr'>Submit Review</button>
                </form>
            </div>
        </div>
    );
};

export default ConnectPackage;
