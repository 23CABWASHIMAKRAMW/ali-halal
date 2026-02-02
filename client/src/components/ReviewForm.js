import React, { useState } from 'react';

const ReviewForm = ({ onComplete }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviewData = {
      customerName: "Guest", // You can later link this to their login name
      rating: Number(rating),
      comment: comment
    };

    fetch('http://localhost:5000/api/reviews/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    })
    .then(() => setSubmitted(true))
    .catch(err => console.error("Review Error:", err));
  };

  if (submitted) {
    return <div style={{ textAlign: 'center', color: '#28a745' }}><h3>Shukran for your feedback! ⭐</h3></div>;
  }

  return (
    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#fff' }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Rate your experience:</h4>
      <form onSubmit={handleSubmit}>
        <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
          <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
          <option value="4">⭐⭐⭐⭐ (Good)</option>
          <option value="3">⭐⭐⭐ (Average)</option>
          <option value="2">⭐⭐ (Poor)</option>
          <option value="1">⭐ (Terrible)</option>
        </select>
        <textarea 
          placeholder="Tell us what you liked..." 
          value={comment} 
          onChange={(e) => setComment(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '5px', height: '60px', marginBottom: '10px', boxSizing: 'border-box' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#C8102E', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;