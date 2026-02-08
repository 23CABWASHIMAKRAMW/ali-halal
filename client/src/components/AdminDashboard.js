import React, { useEffect, useState, useCallback } from 'react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [waiterCalls, setWaiterCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ensure this URL has NO trailing slash
  const API_BASE_URL = "https://ali-halal-backend.onrender.com"; 

  const fetchData = useCallback(async () => {
    const timestamp = new Date().getTime();
    try {
      // 1. Fetch Orders
      const orderRes = await fetch(`${API_BASE_URL}/api/orders?t=${timestamp}`);
      const orderData = await orderRes.json();
      setOrders(Array.isArray(orderData) ? orderData : []);

      // 2. Fetch Reviews
      const reviewRes = await fetch(`${API_BASE_URL}/api/reviews?t=${timestamp}`);
      const reviewData = await reviewRes.json();
      setReviews(Array.isArray(reviewData) ? reviewData : []);

      // 3. Fetch Waiter Calls
      const reqRes = await fetch(`${API_BASE_URL}/api/requests?t=${timestamp}`);
      const reqData = await reqRes.json();
      setWaiterCalls(Array.isArray(reqData) ? reqData : []);
      
      setLoading(false);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      // Don't set loading false here so user knows it's still trying
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  const markAsServed = async (id) => {
    // Optimistic UI update: remove immediately from screen
    setOrders(prev => prev.filter(order => order._id !== id));

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Delete failed on server");
      console.log("Order completed successfully");
    } catch (err) {
      console.error("Delete Error:", err);
      fetchData(); // Refresh to bring back the order if delete failed
    }
  };

  const resolveCall = async (id) => {
    setWaiterCalls(prev => prev.filter(call => call._id !== id));
    try {
      await fetch(`${API_BASE_URL}/api/requests/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error("Resolve Call Error:", err);
      fetchData();
    }
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', padding: '20px', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#F4A300', textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase' }}>
        Ali Halal Admin Panel
      </h1>

      {loading && orders.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888' }}>Connecting to live server...</p>
      )}

      {/* --- SECTION 1: WAITER ALERTS --- */}
      <h2 style={{ color: '#ff4d4d', borderBottom: '2px solid #ff4d4d', paddingBottom: '10px' }}>🚨 WAITER REQUESTS</h2>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '40px', marginTop: '15px' }}>
        {waiterCalls.length === 0 ? <p style={{ color: '#666' }}>No active requests.</p> : waiterCalls.map(call => (
          <div key={call._id} style={{ backgroundColor: '#C8102E', padding: '15px', borderRadius: '10px', border: '2px solid white', textAlign: 'center', minWidth: '160px' }}>
            <h3 style={{ margin: 0 }}>TABLE {call.tableNumber}</h3>
            <p style={{ fontSize: '1rem', margin: '5px 0', fontWeight: 'bold' }}>{call.requestType}</p>
            <button onClick={() => resolveCall(call._id)} style={{ marginTop: '10px', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '5px', border: 'none', background: 'white', color: '#C8102E' }}>DONE ✅</button>
          </div>
        ))}
      </div>

      {/* --- SECTION 2: ACTIVE ORDERS --- */}
      <h2 style={{ color: '#F4A300', borderBottom: '2px solid #333', paddingBottom: '10px' }}>ACTIVE ORDERS</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {orders.length === 0 ? <p style={{ color: '#666' }}>Waiting for new orders...</p> : orders.map(order => (
          <div key={order._id} style={{ backgroundColor: 'white', color: '#333', padding: '15px', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '10px' }}>
              <span style={{ fontWeight: '900', fontSize: '1.4rem', color: '#121212' }}>TABLE {order.tableNumber}</span>
              <span style={{ color: '#C8102E', fontWeight: 'bold', fontSize: '0.85rem', background: '#ffeeee', padding: '2px 8px', borderRadius: '4px' }}>{order.paymentMethod}</span>
            </div>

            <div style={{ marginBottom: '12px', fontSize: '1rem', color: '#000', fontWeight: '600' }}>
              📞 Contact: <span style={{ color: '#007bff' }}>{order.phoneNumber || "Walk-in"}</span>
            </div>

            <ul style={{ padding: '0', margin: '0 0 15px 0', listStyleType: 'none', flexGrow: 1 }}>
              {order.items && order.items.map((item, i) => (
                <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.05rem' }}>• {item.itemName}</span>
                  <span style={{ fontWeight: 'bold', color: '#C8102E', fontSize: '1.1rem' }}>
                    {item.quantity ? `x${item.quantity}` : "x1"}
                  </span>
                </li>
              ))}
            </ul>

            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', color: '#28a745', marginBottom: '15px', textAlign: 'right', borderTop: '2px solid #f0f0f0', paddingTop: '10px' }}>
              Total: ₹{order.totalAmount}
            </div>

            <button 
              onClick={() => markAsServed(order._id)} 
              style={{ width: '100%', padding: '14px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', transition: '0.3s' }}
            >
              COMPLETE ORDER ✅
            </button>
          </div>
        ))}
      </div>

      {/* --- SECTION 3: CUSTOMER REVIEWS --- */}
      <h2 style={{ color: '#F4A300', borderBottom: '2px solid #333', paddingBottom: '10px', marginTop: '60px' }}>CUSTOMER FEEDBACK</h2>
      <div style={{ display: 'flex', overflowX: 'auto', gap: '20px', padding: '20px 0' }}>
        {reviews.length === 0 ? <p style={{ color: '#666' }}>No reviews yet.</p> : reviews.map(review => (
          <div key={review._id} style={{ minWidth: '280px', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '12px', borderLeft: '6px solid #F4A300', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
            <div style={{ color: '#ffcc00', fontSize: '1.2rem', marginBottom: '10px' }}>{"⭐".repeat(review.rating)}</div>
            <p style={{ fontStyle: 'italic', color: '#ddd', lineHeight: '1.5', fontSize: '0.95rem' }}>"{review.comment}"</p>
            <div style={{ textAlign: 'right', marginTop: '12px', color: '#F4A300', fontWeight: 'bold', fontSize: '0.9rem' }}>— {review.customerName || 'Guest'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;