import React, { useEffect, useState, useCallback } from 'react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [waiterCalls, setWaiterCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "https://ali-halal-backend.onrender.com"; 

  const fetchData = useCallback(async () => {
    try {
      const [orderRes, reviewRes, reqRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/orders`),
        fetch(`${API_BASE_URL}/api/reviews`),
        fetch(`${API_BASE_URL}/api/requests`)
      ]);

      setOrders(await orderRes.json());
      setReviews(await reviewRes.json());
      setWaiterCalls(await reqRes.json());
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const markAsServed = async (id) => {
    setOrders(prev => prev.filter(order => order._id !== id));
    await fetch(`${API_BASE_URL}/api/orders/${id}`, { method: 'DELETE' });
  };

  const resolveCall = async (id) => {
    setWaiterCalls(prev => prev.filter(call => call._id !== id));
    await fetch(`${API_BASE_URL}/api/requests/${id}`, { method: 'DELETE' });
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', padding: '20px', color: 'white' }}>
      <h1 style={{ color: '#F4A300', textAlign: 'center' }}>Ali Halal Admin Panel</h1>

      <h2 style={{ color: '#ff4d4d' }}>🚨 WAITER REQUESTS</h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' }}>
        {waiterCalls.map(call => (
          <div key={call._id} style={{ background: '#C8102E', padding: '15px', borderRadius: '10px' }}>
            <strong>Table {call.tableNumber}</strong>
            <button onClick={() => resolveCall(call._id)} style={{ marginLeft: '10px' }}>DONE</button>
          </div>
        ))}
      </div>

      <h2 style={{ color: '#F4A300' }}>ACTIVE ORDERS</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {orders.map(order => (
          <div key={order._id} style={{ background: 'white', color: 'black', padding: '15px', borderRadius: '10px' }}>
            <h3>TABLE {order.tableNumber}</h3>
            <ul>
              {order.items.map((item, i) => <li key={i}>{item.itemName} x{item.quantity || 1}</li>)}
            </ul>
            <h4>Total: ₹{order.totalAmount}</h4>
            <button onClick={() => markAsServed(order._id)} style={{ width: '100%', background: '#28a745', color: 'white', padding: '10px' }}>COMPLETE ✅</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;