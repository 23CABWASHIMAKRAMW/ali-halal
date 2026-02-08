import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [waiterCalls, setWaiterCalls] = useState([]);

  // Change this to your Render URL when you deploy!
  const API_BASE_URL = "https://ali-halal-backend.onrender.com/api/orders"; 
  // For local testing, use: const API_BASE_URL = "http://localhost:5000";

  const fetchData = () => {
    // 1. Fetch Orders (Removed /all to match index.js)
    fetch(`${API_BASE_URL}/api/orders`)
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(err => console.error("Order Fetch Error:", err));

    // 2. Fetch Reviews
    fetch(`${API_BASE_URL}/api/reviews`)
      .then(res => res.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(err => console.error("Review Fetch Error:", err));

    // 3. Fetch Waiter Calls
    fetch(`${API_BASE_URL}/api/requests`)
      .then(res => res.json())
      .then(data => setWaiterCalls(Array.isArray(data) ? data : []))
      .catch(err => console.error("Request Fetch Error:", err));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  const markAsServed = (id) => {
    fetch(`${API_BASE_URL}/api/orders/${id}`, { method: 'DELETE' })
      .then(() => fetchData());
  };

  const resolveCall = (id) => {
    fetch(`${API_BASE_URL}/api/requests/${id}`, { method: 'DELETE' })
      .then(() => fetchData());
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', padding: '20px', color: 'white', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#F4A300', textAlign: 'center' }}>ALI HALAL ADMIN PANEL</h1>

      {/* --- SECTION 1: WAITER ALERTS --- */}
      {waiterCalls.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#ff4d4d' }}>🚨 WAITER REQUESTS</h2>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {waiterCalls.map(call => (
              <div key={call._id} style={{ backgroundColor: '#C8102E', padding: '15px', borderRadius: '10px', border: '2px solid white', textAlign: 'center' }}>
                <h3 style={{ margin: 0 }}>TABLE {call.tableNumber}</h3>
                <p>{call.requestType}</p>
                <button onClick={() => resolveCall(call._id)} style={{ marginTop: '10px', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold' }}>DONE ✅</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SECTION 2: ACTIVE ORDERS --- */}
      <h2 style={{ color: '#F4A300', borderBottom: '2px solid #333', paddingBottom: '10px' }}>ACTIVE ORDERS</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {orders.length === 0 ? <p>No active orders.</p> : orders.map(order => (
          <div key={order._id} style={{ backgroundColor: 'white', color: '#333', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>TABLE {order.tableNumber}</span>
              <span style={{ color: '#C8102E', fontWeight: 'bold' }}>{order.paymentMethod}</span>
            </div>
            <ul style={{ padding: '15px 0', margin: 0, listStyleType: 'none' }}>
              {order.items && order.items.map((item, i) => (
                <li key={i} style={{ padding: '3px 0' }}>• {item.itemName}</li>
              ))}
            </ul>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Total: ₹{order.totalAmount}</div>
            
            <button 
              onClick={() => markAsServed(order._id)} 
              style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              COMPLETE ORDER ✅
            </button>
          </div>
        ))}
      </div>

      {/* --- SECTION 3: CUSTOMER REVIEWS --- */}
      <h2 style={{ color: '#F4A300', borderBottom: '2px solid #333', paddingBottom: '10px', marginTop: '50px' }}>RECENT REVIEWS</h2>
      <div style={{ display: 'flex', overflowX: 'auto', gap: '20px', paddingBottom: '20px' }}>
        {reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map(review => (
          <div key={review._id} style={{ minWidth: '250px', backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '10px', borderLeft: '5px solid #F4A300' }}>
            <div style={{ color: '#ffcc00', fontSize: '1.2rem' }}>{"⭐".repeat(review.rating)}</div>
            <p style={{ fontStyle: 'italic' }}>"{review.comment}"</p>
            <small style={{ color: '#888' }}>— {review.customerName || 'Guest'}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;