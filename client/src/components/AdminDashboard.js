import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [waiterCalls, setWaiterCalls] = useState([]);

  const API_BASE_URL = "https://ali-halal-backend.onrender.com"; 

  const fetchData = () => {
    // We add a timestamp (?t=...) to prevent the browser from showing old "cached" data
    const timestamp = new Date().getTime();

    // 1. Fetch Orders
    fetch(`${API_BASE_URL}/api/orders?t=${timestamp}`)
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(err => console.error("Order Fetch Error:", err));

    // 2. Fetch Reviews
    fetch(`${API_BASE_URL}/api/reviews?t=${timestamp}`)
      .then(res => res.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(err => console.error("Review Fetch Error:", err));

    // 3. Fetch Waiter Calls
    fetch(`${API_BASE_URL}/api/requests?t=${timestamp}`)
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
    // Step 1: Remove from screen immediately (Optimistic UI)
    setOrders(prevOrders => prevOrders.filter(order => order._id !== id));

    // Step 2: Delete from Database
    fetch(`${API_BASE_URL}/api/orders/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        console.log("Order removed successfully");
      })
      .catch(err => {
        console.error("Delete Error:", err);
        fetchData(); // If delete fails, refresh data to bring order back
      });
  };

  const resolveCall = (id) => {
    setWaiterCalls(prevCalls => prevCalls.filter(call => call._id !== id));
    fetch(`${API_BASE_URL}/api/requests/${id}`, { method: 'DELETE' })
      .catch(err => {
        console.error("Delete Request Error:", err);
        fetchData();
      });
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', padding: '20px', color: 'white', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#F4A300', textAlign: 'center', letterSpacing: '2px' }}>ALI HALAL ADMIN PANEL</h1>

      {/* --- SECTION 1: WAITER ALERTS --- */}
      <h2 style={{ color: '#ff4d4d', borderBottom: '1px solid #ff4d4d', paddingBottom: '5px' }}>🚨 WAITER REQUESTS</h2>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '40px', marginTop: '15px' }}>
        {waiterCalls.length === 0 ? <p style={{ color: '#888' }}>No active requests.</p> : waiterCalls.map(call => (
          <div key={call._id} style={{ backgroundColor: '#C8102E', padding: '15px', borderRadius: '10px', border: '2px solid white', textAlign: 'center', minWidth: '150px' }}>
            <h3 style={{ margin: 0 }}>TABLE {call.tableNumber}</h3>
            <p style={{ fontSize: '0.9rem', margin: '5px 0' }}>{call.requestType}</p>
            <button onClick={() => resolveCall(call._id)} style={{ marginTop: '10px', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '5px', border: 'none' }}>DONE ✅</button>
          </div>
        ))}
      </div>

      {/* --- SECTION 2: ACTIVE ORDERS --- */}
      <h2 style={{ color: '#F4A300', borderBottom: '2px solid #333', paddingBottom: '10px' }}>ACTIVE ORDERS</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {orders.length === 0 ? <p style={{ color: '#888' }}>No active orders.</p> : orders.map(order => (
          <div key={order._id} style={{ backgroundColor: 'white', color: '#333', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#121212' }}>TABLE {order.tableNumber}</span>
              <span style={{ color: '#C8102E', fontWeight: 'bold', fontSize: '0.9rem' }}>{order.paymentMethod}</span>
            </div>

            {/* CUSTOMER PHONE NUMBER */}
            <div style={{ marginBottom: '10px', fontSize: '0.95rem', color: '#444' }}>
              <strong>📞 Contact:</strong> {order.phoneNumber || "Not Provided"}
            </div>

            <ul style={{ padding: '0', margin: '0 0 15px 0', listStyleType: 'none', flexGrow: 1 }}>
              {order.items && order.items.map((item, i) => (
                <li key={i} style={{ padding: '6px 0', borderBottom: '1px dashed #eee', display: 'flex', justifyContent: 'space-between' }}>
                  <span>• {item.itemName}</span>
                  {/* QUANTITY DISPLAY (Shows - X if quantity exists) */}
                  <span style={{ fontWeight: 'bold', color: '#C8102E' }}>
                    {item.quantity ? `x${item.quantity}` : ""}
                  </span>
                </li>
              ))}
            </ul>

            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#28a745', marginBottom: '15px', textAlign: 'right' }}>
              Total: ₹{order.totalAmount}
            </div>

            <button 
              onClick={() => markAsServed(order._id)} 
              style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
            >
              COMPLETE & REMOVE ✅
            </button>
          </div>
        ))}
      </div>

      {/* --- SECTION 3: CUSTOMER REVIEWS --- */}
      <h2 style={{ color: '#F4A300', borderBottom: '2px solid #333', paddingBottom: '10px', marginTop: '60px' }}>RECENT REVIEWS</h2>
      <div style={{ display: 'flex', overflowX: 'auto', gap: '20px', padding: '20px 0' }}>
        {reviews.length === 0 ? <p style={{ color: '#888' }}>No reviews yet.</p> : reviews.map(review => (
          <div key={review._id} style={{ minWidth: '280px', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #F4A300', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
            <div style={{ color: '#ffcc00', fontSize: '1.1rem', marginBottom: '10px' }}>{"⭐".repeat(review.rating)}</div>
            <p style={{ fontStyle: 'italic', color: '#eee', lineHeight: '1.4' }}>"{review.comment}"</p>
            <div style={{ textAlign: 'right', marginTop: '10px', color: '#888', fontSize: '0.85rem' }}>— {review.customerName || 'Guest'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;